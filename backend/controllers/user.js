// modile pour le hachage du mot de passe
const bcrypt = require('bcrypt');
// module pour le TOKEN
const jwt = require('jsonwebtoken');

const User = require('../models/user')

require('dotenv').config()

// CREATION D UN COMPTE

//hachage du mot de passe à la création d'un utilisateur

exports.signup = (req, res, next) => {
  //on utilise la methode hash que l'on fait mouliner 10 fois
    bcrypt.hash(req.body.password.trim(), 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        //on sauvegarde dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

//CONNECTION AU COMPTE - COMPARAISON DES H

  exports.login = (req, res, next) => {
    // on filtre la base de donnée pour trouver l'utilisateur
    User.findOne({ email: req.body.email })
        .then(user => {
      // si non présente on retourne une erreur
            if (!user) {
                return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte !' });
            }
            // on compare les # des mots de passe
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                // si aucune correspondance on retourne une erreur
                    if (!valid) {
                        return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte !' });
                    }
                // si ok on retourne l'objet avec le TOKEN
                    res.status(200).json({
                        userId: user._id,
                        // création du TOKEN a l'aide du package
                        token: jwt.sign(
                          // premier argument pour s'assurer qu'on l'applique bien a notre utilisateur
                            { userId: user._id },
                          // deuxieme argument qui est la cléfs secrete du TOKEN a complexifier pour augmenter la securité
                          process.env.TOKEN,     
                          // troisieme argument est la durée de validité du TOKEN
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };