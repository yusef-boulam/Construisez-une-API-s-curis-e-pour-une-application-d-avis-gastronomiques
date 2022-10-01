//chargement des modules
const mongoose = require('mongoose');

// GESION DU MODEL SAUCE

const modelSauce = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  heat: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  mainPepper: { type: String, required: true },
  usersLiked: { type: Array },
  usersDisliked: { type: Array},
  likes: { type: Number},
  disliked: { type: Number},
  userId:{ type: String, required: true },
});

module.exports = mongoose.model('modelSauce', modelSauce);