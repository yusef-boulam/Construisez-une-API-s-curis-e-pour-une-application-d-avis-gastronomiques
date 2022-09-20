//on charge les modules
const express = require('express');
// on utilise la methode router d'express
const router = express.Router();

// on charge le controlleur de user
const userCtrl = require('../controllers/user');

// partie autentification email + mot de passe
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;