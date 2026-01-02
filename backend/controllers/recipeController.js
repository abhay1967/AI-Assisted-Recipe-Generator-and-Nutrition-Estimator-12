const Recipe = require('../models/Recipe');
const { generateRecipeWithClaude } = require('../services/claudeService');
const { calculateNutrition } = require('../services/usdaNutritionService');

exports.generate = async (req, res, next) => {
  try {
    const { ingredients = [], preferences = {} } = req.body || {};
    const aiRecipe = await generateRecipeWithClaude(ingredients, preferences);

    // Normalize AI response into Recipe model shape
    const finalIngredients = Array.isArray(aiRecipe.ingredients) && aiRecipe.ingredients.length
      ? aiRecipe.ingredients
      : ingredients;

    // TEMP debug
    console.log('🧠 AI ingredients:', finalIngredients);

    // Deterministic nutrition calculation from DB per-100g values
    const nutrition = await calculateNutrition(
      (finalIngredients || []).map((i) => ({ name: i.name, quantity: Number(i.quantity) || 0 }))
    );

    const recipeDoc = await Recipe.create({
      title: aiRecipe.title || 'AI Generated Recipe',
      description: aiRecipe.description || '',
      ingredients: finalIngredients,
      steps: aiRecipe.steps || [],
      servings: aiRecipe.servings || 2,
      totalCalories: nutrition.calories || 0,
      macros: {
        protein: nutrition.protein || 0,
        carbs: nutrition.carbs || 0,
        fat: nutrition.fat || 0,
      },
      tags: aiRecipe.tags || [],
    });

    res.status(201).json(recipeDoc);
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const items = await Recipe.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Recipe.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Recipe not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
};

// List only favorite recipes
exports.listFavorites = async (req, res, next) => {
  try {
    const favorites = await Recipe.find({ favorite: true }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (e) {
    next(e);
  }
};

// Toggle favorite flag for a recipe
exports.toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    recipe.favorite = !recipe.favorite;
    await recipe.save();
    res.json(recipe);
  } catch (e) {
    next(e);
  }
};
