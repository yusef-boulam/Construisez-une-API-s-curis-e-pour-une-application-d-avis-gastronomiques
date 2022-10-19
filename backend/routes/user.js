//on charge les modules
const express = require('express');
// on utilise la methode router d'express
const router = express.Router();

// on charge le controlleur de user
const userCtrl = require('../controllers/user');

const rateLimit = require('express-rate-limit')

// limite les tentatives de connections à 5 toutes les 15 minutes
const  loginAccountLimiter  =  rateLimit ( { 
	windowMs : 15 * 60 * 1000 ,  // 15 min 
	max : 5 ,  // Limite chaque IP à 5 demandes de création de compte par `window` (ici, par heure) 
	message :
		 'Trop de tentatives de connections depuis cette IP, veuillez réessayer dans 15 min' , 
	standardHeaders : true ,  // Renvoie les informations de limite de débit dans les en-têtes `RateLimit-*` 
	legacyHeaders : false ,  // Désactive les en-têtes `X-RateLimit-*` 
} )


// partie autentification email + mot de passe
router.post('/signup', userCtrl.signup);

router.post('/login', loginAccountLimiter, userCtrl.login);


module.exports = router;