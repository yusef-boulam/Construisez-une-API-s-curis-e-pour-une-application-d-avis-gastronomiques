const Sauce = require('../models/sauce');
const fs = require('fs');

// gestion des ROUTES.   toute la partie "metier"

// ROUTE GET ALL SAUCES - on exporte la fonction
exports.getAllSauce = (req, res, next) => {
  //on utilise la methode find pour recuperer toutes les sauces
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

// ROUTE GET qui cible UNE SAUCE
exports.getOneSauce = (req, res, next) => {
  //findOne permet de cible la sauce. en parametre on compare l'id recherché
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

//ON CREE UNE NOUVELLE SAUCE
exports.createSauce = (req, res, next) => {
  // on parse car avec l'image présente dans la requette on recoit une string
  const sauceObject = JSON.parse(req.body.sauce);
  //on supprime les identifiants de l'objet
  console.log(sauceObject)
  const sauce = new Sauce({
    // on stocke le nouvel objet sans les ID
    ...sauceObject,
    //recuperartion du user id directement du TOKEN
    userId: req.auth.userId,

    //on génére l'url de l'image
    // protocolle + nom d'hote + nom de fichier donnée par MULTER
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  // on sauvegarder la sauce sur le serveur
  sauce.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !', sauce })})  // RENVOYER LA REPONSE
    .catch(error => { res.status(400).json({ error }) })
};

// ON MODIFIE UNE SAUCE
// deux gestions differentes 1: avec image en string 2: sans image en objet
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// ON SUPPRIME UNE SAUCE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

// LIKER OU DISLIKER DE LA SAUCE 
exports.modifyLikes = (req, res, next) => {
    console.log(req.body)
    const sauceObject = {
        ...req.body 
    };
    console.log(sauceObject)
  
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
  };