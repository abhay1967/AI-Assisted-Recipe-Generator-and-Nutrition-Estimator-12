const router = require('express').Router();
const ingredientCtrl = require('../controllers/ingredientController');

router.get('/', ingredientCtrl.list);
router.post('/', ingredientCtrl.create);
router.delete('/:id', ingredientCtrl.remove);

module.exports = router;
