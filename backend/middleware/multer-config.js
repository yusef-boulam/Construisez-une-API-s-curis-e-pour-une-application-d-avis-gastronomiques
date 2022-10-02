const multer = require('multer');

// gestion des images ajoutées au serveur 

// creation d'un objet de configuration de multer
// utilisé avec la propriété diskStorage pour l'enregistrer sur le disque
const storage = multer.diskStorage({
  //argument destination pour lui dire ou enregistrer les images (il faut modifier uniquement 'images' avec le nom du fichier)
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // argument qui génére le nom pour chaque fichier
  filename: (req, file, callback) => {
    // on supprim les espaces et on les remplaces par des UNDERSCORES
    const name = file.originalname.split(' ').join('_');


    // on va créer le file name entier = nom + time stamp (pour rendre le nom unique) + "." + extension
    callback(null, Date.now() + "_" + name);
  }
});

// methode multer à l'aquelle on applique l'objet STORAGE 
// on ajoute la methode single pour lui indiquer que c'est une fichier unique
// on passe la parametre 'image' pour lui indiquer que c'est une image
module.exports = multer({storage: storage}).single('image');