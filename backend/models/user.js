const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// MODEL USER pour l'authentification

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// plugin Mongoose qui sassurer que l'email est unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


