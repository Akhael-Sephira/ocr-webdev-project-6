const express = require('express');
const saucesCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer.js');
const { isOwner } = require('../middleware/sauce.js');

const router = express.Router();

router.get('/', saucesCtrl.get);
router.get('/:id', saucesCtrl.getOne);
router.post('/', multer, saucesCtrl.post);
router.delete('/:id', isOwner, saucesCtrl.deleteOne);
router.put('/:id', isOwner, multer, saucesCtrl.updateOne);
router.post('/:id/like', saucesCtrl.like);

module.exports = router;