const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function normalizeRecipe(recipe: any) {
  if (!recipe || typeof recipe !== "object") return recipe
  const nutrition = recipe.nutrition ?? {
    calories: recipe.totalCalories ?? 0,
    protein: recipe.macros?.protein ?? 0,
    carbs: recipe.macros?.carbs ?? 0,
    fat: recipe.macros?.fat ?? 0,
  }
  return {
    ...recipe,
    id: recipe.id ?? recipe._id ?? recipe.id,
    isFavorite: recipe.isFavorite ?? recipe.favorite ?? false,
    instructions: Array.isArray(recipe.instructions) ? recipe.instructions : (recipe.steps ?? []),
    nutrition,
  }
}

interface Ingredient {
  name: string
  quantity: number
}

interface RecipeRequestIngredients {
  ingredients: Ingredient[]
  preferences: {
    diet: string
  }
}

interface RecipeRequestDish {
  dish: string
  preferences: {
    diet: string
  }
}

type RecipeRequest = RecipeRequestIngredients | RecipeRequestDish

export async function generateRecipe(request: RecipeRequest) {
  console.log("[v0] Generating recipe with request:", request)

  const response = await fetch(`${API_BASE_URL}/recipes/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error("Failed to generate recipe. Please try again.")
  }

  const data = await response.json()
  console.log("[v0] Recipe generated successfully:", data)
  console.log("[v0] Nutrition data in response:", data.nutrition)

  return normalizeRecipe(data)
}

export async function toggleFavorite(recipeId: string) {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/favorite`, {
    method: "PATCH",
  })

  if (!response.ok) {
    throw new Error("Failed to update favorite status")
  }

  const data = await response.json()
  return normalizeRecipe(data)
}

export async function getAllRecipes() {
  const response = await fetch(`${API_BASE_URL}/recipes`)

  if (!response.ok) {
    throw new Error("Failed to fetch recipes")
  }

  const data = await response.json()
  return Array.isArray(data) ? data.map(normalizeRecipe) : []
}

export async function getFavoriteRecipes() {
  const response = await fetch(`${API_BASE_URL}/recipes/favorites`)

  if (!response.ok) {
    throw new Error("Failed to fetch favorite recipes")
  }

  const data = await response.json()
  return Array.isArray(data) ? data.map(normalizeRecipe) : []
}
