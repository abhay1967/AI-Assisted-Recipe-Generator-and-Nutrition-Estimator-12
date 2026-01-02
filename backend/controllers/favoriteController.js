const Recipe = require('../models/Recipe');

exports.toggle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    recipe.favorite = !recipe.favorite;
    await recipe.save();
    res.json({ id: recipe._id, favorite: recipe.favorite });
  } catch (e) {
    next(e);
  }
};

exports.listFavorites = async (req, res, next) => {
  try {
    const favorites = await Recipe.find({ favorite: true }).sort({ updatedAt: -1 });
    res.json(favorites);
  } catch (e) {
    next(e);
  }
};
