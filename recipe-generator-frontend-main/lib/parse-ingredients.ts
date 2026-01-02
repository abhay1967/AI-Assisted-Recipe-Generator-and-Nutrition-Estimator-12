export interface Ingredient {
  name: string
  quantity: number
}

/**
 * Parses ingredient text input into structured ingredient objects
 * Supports formats like:
 * - "Chicken breast 300g"
 * - "300g Chicken breast"
 * - "2 eggs"
 * - "Salt to taste" (defaults to 100g)
 */
export function parseIngredients(text: string): Ingredient[] {
  // Convert to grams with simple heuristics; assumes density ~1g/ml for liquids unless overridden
  const UNIT_REGEX = /(g|grams?|kg|kilograms?|oz|ounces?|ml|milliliters?|l|liters?|cups?|cup|tbsp?|tablespoons?|tsp?|teaspoons?|cloves?|pieces?|pcs?|eggs?)/i

  function normalizeName(raw: string): string {
    const cleaned = raw
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    // singularize a few common plurals
    const map: Record<string, string> = {
      cloves: "clove",
      tomatoes: "tomato",
      onions: "onion",
      eggs: "egg",
      potatoes: "potato",
    }
    return map[cleaned] || cleaned
  }

  function convertToGrams(name: string, qty: number, unit?: string): number {
    const n = normalizeName(name)
    const u = (unit || "").toLowerCase()

    // Direct mass
    if (!u || u === "g" || u.startsWith("gram")) return qty
    if (u === "kg" || u.startsWith("kilogram")) return qty * 1000
    if (u === "oz" || u.startsWith("ounce")) return qty * 28.3495

    // Volume -> grams (approx densities)
    if (u === "ml" || u.startsWith("milliliter")) return qty * 1 // approx water-like
    if (u === "l" || u.startsWith("liter")) return qty * 1000
    if (u === "cup" || u === "cups") {
      // olive oil ~216g/cup; water ~240g/cup; fallback 240g
      if (n.includes("oil")) return qty * 216
      return qty * 240
    }
    if (u === "tbsp" || u.startsWith("tablespoon")) {
      if (n.includes("oil")) return qty * 14 // olive oil ~14g per tbsp
      return qty * 15
    }
    if (u === "tsp" || u.startsWith("teaspoon")) {
      if (n.includes("oil")) return qty * 5 // olive oil ~4.5-5g per tsp
      return qty * 5
    }

    // Piece-based heuristics
    if (u.startsWith("clove") || n.includes("clove")) {
      // garlic clove ~3g
      return qty * 3
    }
    if (u.startsWith("egg") || n === "egg" || n.includes("egg")) {
      // one egg ~50g
      return qty * 50
    }
    if (u.startsWith("piece") || u.startsWith("pc") || u.startsWith("pcs")) {
      // rough defaults by ingredient
      if (n.includes("onion")) return qty * 110
      if (n.includes("tomato")) return qty * 125
      return qty * 50
    }

    // Unknown unit -> assume grams
    return qty
  }

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      // Try to capture quantity, unit, and name in both orders
      const regex =
        /^(\d+(?:\.\d+)?)\s*(g|grams?|kg|kilograms?|oz|ounces?|ml|milliliters?|l|liters?|cups?|cup|tbsp?|tablespoons?|tsp?|teaspoons?|cloves?|pieces?|pcs?|eggs?)?\s+(.+)$|^(.+?)\s+(\d+(?:\.\d+)?)\s*(g|grams?|kg|kilograms?|oz|ounces?|ml|milliliters?|l|liters?|cups?|cup|tbsp?|tablespoons?|tsp?|teaspoons?|cloves?|pieces?|pcs?|eggs?)?$/i
      const match = line.match(regex)

      if (match) {
        const quantityStr = match[1] || match[5]
        const unit = match[2] || match[6] || undefined
        const name = (match[3] || match[4] || "").trim()

        const qty = Number.parseFloat(quantityStr)
        const grams = convertToGrams(name, qty, unit)

        // Clean name: remove unit words and leading quantities
        let cleanName = name
          .replace(UNIT_REGEX, "")
          .replace(/\b\d+(?:\.\d+)?\b/g, "")
          .replace(/\s+/g, " ")
          .trim()

        cleanName = normalizeName(cleanName)

        return {
          name: cleanName,
          quantity: Math.round(grams),
        }
      }

      // Fallback: treat entire line as ingredient name with default quantity
      const clean = normalizeName(line)
      return {
        name: clean,
        quantity: 100,
      }
    })
}

/**
 * Determines if the input is a dish description rather than ingredient list
 * Returns true if input looks like a natural language request
 */
export function isDishPrompt(text: string): boolean {
  const lowerText = text.toLowerCase().trim()

  // Check for common prompt patterns
  const promptIndicators = [
    /^(i want|make me|create|i need|give me|suggest)/,
    /^(a|an|some)\s+\w+\s+(dish|meal|recipe|dinner|lunch|breakfast)/,
    /(healthy|protein|low[- ]?carb|vegan|vegetarian|gluten[- ]?free)/,
  ]

  // If it contains newlines, likely an ingredient list
  if (text.includes("\n")) {
    return false
  }

  // Check if any prompt pattern matches
  return promptIndicators.some((pattern) => pattern.test(lowerText))
}
