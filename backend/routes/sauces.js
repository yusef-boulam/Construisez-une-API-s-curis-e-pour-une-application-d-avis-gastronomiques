const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controllers/sauces')


// ROUTE POST CEER UN OBJET
router.post('/', auth, multer, saucesCtrl.createSauce);

// MODIFICATION DE LOBJET
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// SUPPRESSION DE LOBJET
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// ROUTE GET qui cible un objet
router.get('/:id', auth, saucesCtrl.getOneSauce);

// ROUTE GET ALL
router.use('/', auth, saucesCtrl.getAllSauce);


module.exports = router;