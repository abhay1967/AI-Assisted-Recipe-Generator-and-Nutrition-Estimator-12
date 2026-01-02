// ❗ IMPORTANT: NO `/api` HERE
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function normalizeRecipe(recipe: any) {
  if (!recipe || typeof recipe !== "object") return recipe;

  const nutrition = recipe.nutrition ?? {
    calories: recipe.totalCalories ?? 0,
    protein: recipe.macros?.protein ?? 0,
    carbs: recipe.macros?.carbs ?? 0,
    fat: recipe.macros?.fat ?? 0,
  };

  return {
    ...recipe,
    id: recipe.id ?? recipe._id,
    isFavorite: recipe.isFavorite ?? recipe.favorite ?? false,
    instructions: Array.isArray(recipe.instructions)
      ? recipe.instructions
      : recipe.steps ?? [],
    nutrition,
  };
}

interface Ingredient {
  name: string;
  quantity: number;
}

interface RecipeRequestIngredients {
  ingredients: Ingredient[];
  preferences: {
    diet: string;
  };
}

interface RecipeRequestDish {
  dish: string;
  preferences: {
    diet: string;
  };
}

type RecipeRequest = RecipeRequestIngredients | RecipeRequestDish;

// Generate recipe
export async function generateRecipe(request: RecipeRequest) {
  const response = await fetch(`${API_BASE_URL}/api/recipes/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to generate recipe");
  }

  const data = await response.json();
  return normalizeRecipe(data);
}

// Toggle favorite
export async function toggleFavorite(recipeId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/recipes/${recipeId}/favorite`,
    { method: "PATCH" }
  );

  if (!response.ok) {
    throw new Error("Failed to update favorite");
  }

  return normalizeRecipe(await response.json());
}

// Get all recipes
export async function getAllRecipes() {
  const response = await fetch(`${API_BASE_URL}/api/recipes`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeRecipe) : [];
}

// Get favorite recipes
export async function getFavoriteRecipes() {
  const response = await fetch(`${API_BASE_URL}/api/recipes/favorites`);

  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeRecipe) : [];
}
