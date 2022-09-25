//chargement des modules
const mongoose = require('mongoose');

// GESION DU MODEL SAUCE

const modelLike = mongoose.Schema({
   likes: { type: Number, required: true },
   dislikes: { type: Number, required: true},

});

module.exports = mongoose.model('modelSauce', modelLike);