const router = require('express').Router();
const recipeCtrl = require('../controllers/recipeController');

router.get('/', recipeCtrl.list);
router.get('/favorites', recipeCtrl.listFavorites); // list only favorites
router.get('/:id', recipeCtrl.get);
router.post('/generate', recipeCtrl.generate);
router.patch('/:id/favorite', recipeCtrl.toggleFavorite); // toggle favorite

module.exports = router;
