const Sauce = require('../models/sauce');
const fs = require('fs');
const {validateInputUpdate} = require('../middleware/validateInputUpdate');

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

    sauce.likes = 0;
    sauce.dislikes = 0;

    // on sauvegarder la sauce sur le serveur
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !', sauce }) })  // RENVOYER LA REPONSE + la SAUCE
        .catch(error => { res.status(400).json({ error }) })
};

// ON MODIFIE UNE SAUCE
// deux gestions differentes 1: avec image en string 2: sans image en objet
exports.modifySauce = (req, res, next) => {

  
const sauceObject = validateInputUpdate (req, res, next);

if(sauceObject != false ){
    // on recuprer la sauce et on verifie l'autentification
     Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {

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
             
                // on met à jour la sauce
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(sauce => res.status(200).json(sauceObject))
                    .catch(error => res.status(400).json({ error: "La syntaxe de la requête est erronée" }));
            }
        })
        .catch((error) => {
            res.status(404).json({ error: "La sauce n'existe pas" });
        });
    }
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

    // on vérifie si l'utilisateur à deja liké ou disliké la sauce
         Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        
            const liked = sauce.usersLiked.includes(req.auth.userId)
            const disliked = sauce.usersDisliked.includes(req.auth.userId)

            console.log(liked);
            console.log(disliked, req.body.like, req.auth.userId);

    // si l'utilisateur LIKE et qu'il n'a jamais liké ou disliké 
            if(req.body.like === 1 && liked === false && disliked === false) {
                // on ajoute un like
                sauce.likes++;
                // on ajoute l'utilisateur dans le tableau like de la sauce
                sauce.usersLiked.push(req.auth.userId)
                // on sauvegarde
                sauce.save()
                // on retourne la reponse
                .then(() => {return res.status(200).json({ message:"sauce liké" })})
             .catch(error => {return res.status(404).json({ error: "la sauce n'a pas pu être liké" })});
            }

    // si l'utilisateur DISLIKE et qu'il n'a jamais liké ou disliké 
            else if(req.body.like === -1 && liked === false && disliked === false) {
                // on ajoute un dislkikes
                sauce.dislikes++;
                // on ajoute l'utilisateur dans le tableau dislike de la sauce
                sauce.usersDisliked.push(req.auth.userId)
                sauce.save()
                return res.status(200).json({ message:"sauce disliké" })
            }

       // si l'utilisateur retire le LIKE ou DISLIKE et qu'il a déja liké ou disliké 
            else if(req.body.like === 0 && (liked || disliked)) {

        // si il avait déjà LIKED
                if(liked){
                // on supprime un like
                    sauce.likes--;
                   // on supprime l'utilisateur dans le tableau like de la sauce
                    sauce.usersLiked = sauce.usersLiked.filter(liked => liked =!req.auth.userId)
                    sauce.save()
                    return res.status(200).json({ message:"sauce retiré like"})

        // si il avait déjà DISLIKED
                }else if(disliked){
                    sauce.dislikes--;
                    sauce.usersDisliked = sauce.usersDisliked.filter(disliked => disliked =!req.auth.userId)
                    sauce.save()
                    return res.status(200).json({ message:"sauce retiré dislike"})
                }
        
        //sinon on retourne une erreur
            } else{
            res.status(400).json({ message:"impossible de liker ou disliker la sauce" })


            }
            
         }).catch(error => {res.status(404).json({ error: "La sauce n'existe pas" });
        });
}

