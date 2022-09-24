const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// MODEL USER pour l'authentification
// on utilise la methode Shema de mangoose pour créer un model
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "l'email est obligatoire"],
    unique: [true, "email non disponible"], // unique true permet d'avoir un premier controle pour s'assurer que l'adresse email est unique.
    index: { unique: true },
validate : [/^[\w\áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"l'email n'est pas valide" ]
     },

  password: {
      type: String,
      required: [true, "l'email est obligatoire"],
  }
})


// methode plugin Mongoose qui à l aide du module unique validator de mangoose va sassurer que l'email est unique en deuxieme controle avant de créer l'objet.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


