const multer = require('multer');

// gestion des images ajoutées au serveur 

// creation de l'objet MIME_TYPE pour gerer l'extention de l'image (dictionnaire)
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

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

    // creation de l'extenxtion du fichier
    const extension = MIME_TYPES[file.mimetype];

    // on va créer le file name entier = nom + time stamp (pour rendre le nom unique) + "." + extension
    callback(null, name + Date.now() + '.' + extension);
  }
});

// methode multer à l'aquelle on applique l'objet STORAGE 
// on ajoute la methode single pour lui indiquer que c'est une fichier unique
// on passe la parametre 'image' pour lui indiquer que c'est une image
module.exports = multer({storage: storage}).single('image');