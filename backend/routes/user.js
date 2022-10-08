//on charge les modules
const express = require('express');
// on utilise la methode router d'express
const router = express.Router();

// on charge le controlleur de user
const userCtrl = require('../controllers/user');

// const ExpressBrute  = require (' express-brute ') ; 


// //  Commence à ralentir les requêtes après 5 tentatives infructueuses de faire quelque chose pour le même utilisateur
// var userBruteforce = new ExpressBrute(store, {
//     freeRetries: 5,
//     minWait: 5*60*1000, // 5 minutes
//     maxWait: 60*60*1000, // 1 hour,
//     failCallback: failCallback,
//     handleStoreError: handleStoreError
// });

// //  Pas plus de 1000 tentatives de connexion par jour et par IP
// var globalBruteforce = new ExpressBrute(store, {
//     freeRetries: 1000,
//     attachResetToRequest: false,
//     refreshTimeoutOnRequest: false,
//     minWait: 25*60*60*1000, //  1 jour 1 heure (ne devrait jamais atteindre ce temps d'attente)  
//     maxWait: 25*60*60*1000, //  1 jour 1 heure (ne devrait jamais atteindre ce temps d'attente) 
//     lifetime: 24*60*60, //  1 jour (secondes et non millisecondes)  
//     failCallback: failCallback,
//     handleStoreError: handleStoreError
// });


// partie autentification email + mot de passe
router.post('/signup', userCtrl.signup);

router.post('/login',
// globalBruteforce.prevent,
// userBruteforce.getMiddleware({
//     key: function(req, res, next) {
//             //  empêche trop de tentatives pour le même nom d'utilisateur
//         next(req.body.username);
//     }
// }),
// function (req, res, next) {
//     if (User.isValidLogin(req.body.username, req.body.password)) {  //  omis par souci de concision 
//                  	//  réinitialise le compteur d'échecs pour que la prochaine fois qu'ils se connectent, ils obtiennent à nouveau 5 tentatives avant que les retards ne se déclenchent
//         req.brute.reset(function () {
//             res.redirect('/'); //  connecté, les envoyer à la page d'accueil 
//         });
//     } else {
//         res.flash('error', "Invalid username or password")
//         res.redirect('/login'); //  mauvais nom d'utilisateur/mot de passe, renvoyez-les à la page de connexion 
// //     }
// }, 
userCtrl.login);


module.exports = router;