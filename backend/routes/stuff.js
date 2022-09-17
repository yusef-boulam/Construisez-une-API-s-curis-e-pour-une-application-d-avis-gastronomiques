const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const stuffCtrl = require('../controllers/stuff')


// ROUTE POST CEER UN OBJET
router.post('/', auth, multer, stuffCtrl.createThing);

// MODIFICATION DE LOBJET
router.put('/:id', auth, multer, stuffCtrl.modifyThing);

// SUPPRESSION DE LOBJET
router.delete('/:id', auth, stuffCtrl.deleteThing);

// ROUTE GET qui cible un objet
router.get('/:id', auth, stuffCtrl.getOneThing);

// ROUTE GET ALL
router.use('/', auth, stuffCtrl.getAllThing);


module.exports = router;