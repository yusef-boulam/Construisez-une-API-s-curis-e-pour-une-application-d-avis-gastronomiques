const sauce = require('../models/sauce');
const fs = require('fs');

// gestion des ROUTES


 // ROUTE GET ALL SAUCES
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
        const sauceObject = JSON.parse(req.body.Sauce);
          //on supprime les identifiants de l'objet
        delete sauceObject._id;
        delete sauceObject._userId;

        const sauce = new Sauce({
            // on stocke le nouvel objet sans les ID

            ...sauceObject,
            //recuperartion du user id directement du TOKEN
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        // on sauvegarder la sauce sur le serveur
        sauce.save()
        .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
        .catch(error => { res.status(400).json( { error })})
     };


// ON MODIFIE UNE SAUCE
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.Sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
 

// ON SUPPRIME UNE SAUCE
    delete sauceObject._userId;
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
  exports.likeSauce = (req, res, next) => {
   if(req.body.like===1) {
    const like = new Like({
        likes: req.body.like,
        userId: req.auth.userId,
      });
      like.save().then(
        () => {
          res.status(201).json({
            message: 'sauce likes!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    }
    };
