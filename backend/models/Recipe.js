const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    ingredients: [
      {
        name: String,
        quantity: Number,
        unit: String,
        calories: { type: Number, default: 0 },
      },
    ],
    steps: { type: [String], default: [] },
    servings: { type: Number, default: 2 },
    totalCalories: { type: Number, default: 0 },
    macros: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
    tags: { type: [String], default: [] },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', RecipeSchema);
