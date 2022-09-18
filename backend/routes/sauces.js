const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controllers/sauces')


// ROUTE POST CEER UNE SAUCE
router.post('/', auth, multer, saucesCtrl.createSauce);

// MODIFICATION DE LA SAUCE 
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// SUPPRESSION DE LA SAUCE
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// ROUTE GET qui cible UNE SAUCE
router.get('/:id', auth, saucesCtrl.getOneSauce);

// ROUTE GET ALL SAUCES
router.use('/', auth, saucesCtrl.getAllSauce);


module.exports = router;