const express = require('express');
const router = express.Router();

// on importe auth qui verifie l'autorisation du toket et transmet l'identifiant Id aux gestionnaires de routes
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controllers/sauces')


// ROUTE GET ALL SAUCES
// on applique le middleware auth à toutes les routes que l'on veut proteger
//il faut placer auth avant les routes sinon il ne fonctionne pas
router.get('/', auth, saucesCtrl.getAllSauce); 

// ROUTE GET qui cible UNE SAUCE
router.get('/:id', auth, saucesCtrl.getOneSauce);

// ROUTE POST CEER UNE SAUCE
// placer multer avec la route
router.post('/', auth, multer, saucesCtrl.createSauce);

// SUPPRESSION DE LA SAUCE
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// MODIFICATION DE LA SAUCE 
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// LIKER OU DISLIKER DE LA SAUCE 
router.post('/:id/like', auth, multer, saucesCtrl.likeSauce);






module.exports = router;