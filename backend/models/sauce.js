//chargement des modules
const mongoose = require('mongoose');

// GESION DU MODEL SAUCE

const modelSauce = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  heat: { 
    type: Number, 
    required: true,
    min: [1, 'NE peut pas être inferieur à 1'],
    max: [10, 'ne peut pas être supérieur à 10']
  },
  imageUrl: { type: String, required: true },
  mainPepper: { type: String, required: true },
  usersLiked: { type: Array },
  usersDisliked: { type: Array},
  likes: { type: Number},
  disliked: { type: Number},
  userId:{ type: String, required: true },
});

module.exports = mongoose.model('modelSauce', modelSauce);