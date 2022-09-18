const mongoose = require('mongoose');

// gestion du format de l'objet géré par la serveur


const modelSauce = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('modelSauce', modelSauce);