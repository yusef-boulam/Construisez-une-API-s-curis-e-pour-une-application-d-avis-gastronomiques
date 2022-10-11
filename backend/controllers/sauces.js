const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

// gestion des ROUTES.   toute la partie "metier"

// ROUTE GET ALL SAUCES - on exporte la fonction
exports.getAllSauce = (req, res, next) => {
    //on utilise la methode find pour recuperer toutes les sauces
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error: "La syntaxe de la requête est erronée" }));
}

// ROUTE GET qui cible UNE SAUCE
exports.getOneSauce = (req, res, next) => {
    //findOne permet de cible la sauce. en parametre on compare l'id recherché
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce === null) { res.status(404).json({ error: "La sauce n'existe pas" }) }
            else { res.status(200).json(sauce) }
        })
        .catch(error => res.status(404).json({ error: "Ressources non trouvées" }));
}

//ON CREE UNE NOUVELLE SAUCE
exports.createSauce = (req, res, next) => {
    // on parse car avec l'image présente dans la requette on recoit une string
    const sauceObject = JSON.parse(req.body.sauce);


    const sauce = new Sauce({
        // on stocke le nouvel objet avec les ... qui est un raccourci pour stoquer l'enseble de l'objet.
        ...sauceObject,
        //on remplace le user id par le user id pris directement du TOKEN
        userId: req.auth.userId,

        //on génére l'url de l'image
        // protocolle + nom d'hote + nom de fichier donnée par MULTER
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });


    // on sauvegarder la sauce sur le serveur
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !', sauce }) })  // RENVOYER LA REPONSE + la SAUCE
        .catch(error => { res.status(400).json({ error }) })
};

// ON MODIFIE UNE SAUCE
// deux gestions differentes 1: avec image en string 2: sans image en objet
exports.modifySauce = (req, res, next) => {

    //on recupere l'objet que l'on parse ou non s'il contient une image et on ajoute le userId du TOKEN
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: req.auth.userId,
    } : {
        ...req.body,
        userId: req.auth.userId,

    };

    // on recuprer la sauce et on verifie l'autentification
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {

                // on supprime l'ancienne image si ajout d'une nouvelle image

                // on supprime l'ancienne image si ajout d'une nouvelle image
                // Remove old photo
                if (sauceObject.imageUrl != null) {
                    const oldFileName = sauce.imageUrl.split('/images/')[1];
                    if (fs.existsSync(`images/${oldFileName}`)) {
                        fs.unlink(`images/${oldFileName}`, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            res.status(200);
                        });
                    }
                }
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(sauce => res.status(200).json(sauceObject))
                    .catch(error => res.status(400).json({ error: "La syntaxe de la requête est erronée" }));
            }
        })
        .catch((error) => {
            res.status(404).json({ error: "La sauce n'existe pas" });
        });
};

// ON SUPPRIME UNE SAUCE
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(204).json() })
                        .catch(error => res.status(404).json({ error: "la sauce n'a pas pu être supprimé - ressource non trouvé" }));
                });
            }
        })
        .catch(error => {
            res.status(404).json({ error: "La sauce n'existe pas" });
        });
};

// LIKER OU DISLIKER DE LA SAUCE 

exports.modifyLikes = (req, res, next,) => {

    if (req.body.like === 1) {

        Sauce.findOne({ _id: req.params.id }).then((sauce) => {

            const userLiked = Sauce.find({ usersLiked: req.auth.usersLiked }).then((userLiked) => {
                return userLiked
            })
            .catch(error => res.status(404).json({ error: "userLiked non trouvé" }));
            next

            if (userLiked === undefined) {
                sauce.likes = 1;
                Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.auth.userId } }).then((saucelike) => { res.status(200)})
                .catch(error => res.status(404).json({ error: "probleme au push" }));
                next
            }
            console.log(sauce)
            sauce.save()
                .then((saucelike) => { res.status(200).json(saucelike) })
                .catch(error => res.status(404).json({ error: "probleme au save like" }));
        })
            .catch(error => res.status(404).json({ error: "ressource non trouvé" }));

    } else if (req.body.like === 0) {

        Sauce.findOneAndUpdate({ _id: req.params.id }, { $pull: { usersLiked: req.auth.userId }, $pull: { usersLiked: req.auth.userId } }).then((sauce) => {
            sauce.likes -= 1;
  
            sauce.save().then((saucelike) => { res.status(200).json(saucelike) })
        })


    } else if (req.body.like === -1) {

        Sauce.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { usersDisliked: req.auth.userId } }).then((sauce) => {
            sauce.dislikes += 1;
   
            sauce.save().then((saucelike) => { res.status(200).json(saucelike) })
        })

    }
}

