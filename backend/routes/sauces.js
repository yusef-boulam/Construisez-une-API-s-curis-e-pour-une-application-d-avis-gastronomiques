const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controllers/sauces')


// ROUTE GET ALL SAUCES
router.use('/', auth, saucesCtrl.getAllSauce);

// ROUTE GET qui cible UNE SAUCE
router.get('/:id', auth, saucesCtrl.getOneSauce);

// ROUTE POST CEER UNE SAUCE
router.post('/', auth, multer, saucesCtrl.createSauce);

// SUPPRESSION DE LA SAUCE
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// MODIFICATION DE LA SAUCE 
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// LIKER OU DISLIKER DE LA SAUCE 
router.post('/:id/like', auth, multer, saucesCtrl.likeSauce);






module.exports = router;