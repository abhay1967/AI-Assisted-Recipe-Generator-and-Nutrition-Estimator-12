const Ingredient = require('../models/Ingredient');

exports.list = async (req, res, next) => {
  try {
    const items = await Ingredient.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Ingredient.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};
