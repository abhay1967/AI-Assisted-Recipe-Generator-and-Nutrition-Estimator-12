const fetch = require("node-fetch");

const USDA_API_KEY = process.env.USDA_API_KEY;
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

// Normalize common names to USDA-friendly search queries
const USDA_NAME_MAP = {
  // Proteins & staples
  "chicken breast": "Chicken, broilers or fryers, breast, meat only, raw",
  "egg": "Egg, whole, raw, fresh",
  "milk": "Milk, whole",
  "rice": "Rice, white, long-grain, raw",
  "potato": "Potatoes, raw, skin",
  "cheese": "Cheese, cheddar",
  "flour": "Wheat flour, white, all-purpose, unenriched",
  // Fats & oils
  "olive oil": "Oil, olive, salad or cooking",
  "butter": "Butter, salted",
  // Vegetables & aromatics
  "garlic": "Garlic, raw",
  "clove": "Garlic, raw",
  "onion": "Onions, raw",
  "tomato": "Tomatoes, red, ripe, raw, year round average",
  "bell pepper": "Peppers, sweet, red, raw",
  "carrot": "Carrots, raw",
  // Pantry
  "salt": "Salt, table",
  "sugar": "Sugar, granulated",
};

function normalizeName(raw) {
  if (!raw) return "";
  const cleaned = String(raw)
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const singularMap = {
    cloves: "clove",
    tomatoes: "tomato",
    onions: "onion",
    eggs: "egg",
    potatoes: "potato",
    peppers: "pepper",
    carrots: "carrot",
  };
  return singularMap[cleaned] || cleaned;
}

// Simple in-memory cache with TTL to reduce API calls
// Key: ingredient name (lowercased); Value: { nutrients, expiresAt }
const cache = new Map();
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function now() {
  return Date.now();
}

function setCache(key, nutrients, ttlMs = DEFAULT_TTL_MS) {
  cache.set(key, { nutrients, expiresAt: now() + ttlMs });
}

function getCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt < now()) {
    cache.delete(key);
    return null;
  }
  return hit.nutrients;
}

// Extract macros safely from a USDA food item
function extractNutrients(food) {
  const nutrients = food?.foodNutrients || [];
  // For /foods/search, fields are nutrientName and value.
  const get = (name) => nutrients.find((n) => n?.nutrientName === name)?.value || 0;

  return {
    calories: get("Energy"),
    protein: get("Protein"),
    carbs: get("Carbohydrate, by difference"),
    fat: get("Total lipid (fat)"),
  };
}

async function fetchFoodByName(name) {
  if (!USDA_API_KEY) {
    throw new Error("USDA_API_KEY is not set in environment");
  }
  // Prefer Foundation foods for more consistent nutrient definitions
  const url = `${BASE_URL}/foods/search?query=${encodeURIComponent(name)}&dataType=Foundation&pageSize=1&api_key=${USDA_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`USDA API error: ${res.status} ${errText}`);
  }
  const data = await res.json();
  return data?.foods?.[0] || null;
}

async function getNutrientsForName(name) {
  const key = normalizeName(name);
  if (!key) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Apply normalization for better USDA matches
  let usdaQuery = USDA_NAME_MAP[key] || key;

  const cached = getCache(usdaQuery);
  if (cached) return cached;

  let food = await fetchFoodByName(usdaQuery);
  if (!food) {
    console.warn("❌ USDA no match for:", usdaQuery);
    // Fallback attempt: try the raw key without commas, then first word
    const fallback1 = key.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    if (fallback1 && fallback1 !== usdaQuery) {
      food = await fetchFoodByName(fallback1);
    }
    if (!food) {
      const firstWord = key.split(" ")[0];
      if (firstWord && firstWord !== fallback1) {
        food = await fetchFoodByName(firstWord);
      }
    }
    // Cache negative result briefly to avoid hammering API
    if (!food) {
      setCache(usdaQuery, { calories: 0, protein: 0, carbs: 0, fat: 0 }, 10 * 60 * 1000); // 10 min
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
  }

  const nutrients = extractNutrients(food);
  setCache(usdaQuery, nutrients);
  return nutrients;
}

/**
 * Calculate nutrition totals from USDA per-100g values (approximate).
 * Each ingredient: { name, quantity } where quantity is grams.
 * factor = quantity / 100, total += per100gValue * factor
 * Returns rounded totals: { calories, protein, carbs, fat }
 */
async function calculateNutrition(ingredients = []) {
  if (!Array.isArray(ingredients)) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

  let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  console.log("🧮 Calculating nutrition for:", ingredients);

  for (const item of ingredients) {
    if (!item || !item.name || typeof item.quantity !== "number") continue;
    const qty = Number(item.quantity) || 0;
    if (qty <= 0) continue;

    console.log("🔍 USDA lookup for:", String(item.name).trim().toLowerCase());
    const nutrients = await getNutrientsForName(item.name);
    const factor = qty / 100;

    totals.calories += (Number(nutrients.calories) || 0) * factor;
    totals.protein += (Number(nutrients.protein) || 0) * factor;
    totals.carbs += (Number(nutrients.carbs) || 0) * factor;
    totals.fat += (Number(nutrients.fat) || 0) * factor;
  }

  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fat: Math.round(totals.fat),
  };
}

module.exports = { calculateNutrition };
