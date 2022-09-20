const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// MODEL USER pour l'authentification
// on utilise la methode Shema de mangoose pour créer un model
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique true permet d'avoir un premier controle pour s'assurer que l'adresse email est unique.
  password: { type: String, required: true }
});

// methode plugin Mongoose qui à l aide du module unique validator de mangoose va sassurer que l'email est unique en deuxieme controle avant de créer l'objet.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


