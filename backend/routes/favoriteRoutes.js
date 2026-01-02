const router = require('express').Router();
const favoriteCtrl = require('../controllers/favoriteController');

router.get('/', favoriteCtrl.listFavorites);
router.post('/:id/toggle', favoriteCtrl.toggle);

module.exports = router;
