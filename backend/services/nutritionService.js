const Ingredient = require('../models/Ingredient');

/**
 * Calculate nutrition totals from a list of ingredients using per-100g values in DB.
 * Input items should be of shape: { name: string, quantity: number }
 * Quantity is assumed to be in grams. Factor = quantity / 100.
 * Totals are rounded to nearest integer.
 *
 * Returns: { totalCalories, macros: { protein, carbs, fat } }
 */
async function calculateNutrition(ingredients = []) {
  if (!Array.isArray(ingredients)) return zeroTotals();

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  for (const item of ingredients) {
    if (!item || !item.name || typeof item.quantity !== 'number') continue;

    const name = String(item.name).trim();
    const qty = Number(item.quantity) || 0;
    if (!name || qty <= 0) continue;

    // Case-insensitive lookup by name
    const doc = await Ingredient.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, 'i') }).lean();

    const per100g = doc?.per100g || {};
    const f = qty / 100; // factor

    calories += (Number(per100g.calories) || 0) * f;
    protein += (Number(per100g.protein) || 0) * f;
    carbs += (Number(per100g.carbs) || 0) * f;
    fat += (Number(per100g.fat) || 0) * f;
  }

  return {
    totalCalories: Math.round(calories),
    macros: {
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    },
  };
}

function zeroTotals() {
  return { totalCalories: 0, macros: { protein: 0, carbs: 0, fat: 0 } };
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { calculateNutrition };
