const express = require('express');
const router = express.Router();

// on importe auth qui verifie l'autorisation du toket et transmet l'identifiant Id aux gestionnaires de routes
const auth = require('../middleware/auth');

const likesCtrl = require('../controllers/likes')

// LIKER OU DISLIKER DE LA SAUCE 
router.post('/:id/like', auth, likesCtrl.likeSauce);


module.exports = router;