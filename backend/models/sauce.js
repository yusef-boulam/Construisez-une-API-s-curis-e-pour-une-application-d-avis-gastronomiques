const mongoose = require('mongoose');

// GESION DU MODEL SAUCE


const modelSauce = mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number},
  dislikes: { type: Number},
  imageUrl: { type: String, required: true },
  mainPepper: { type: String, required: true },
  usersLiked: [{ type: String, required: true }],
  usersDisliked: [{ type: String, required: true }],
  userId:{ type: String, required: true },
});

module.exports = mongoose.model('modelSauce', modelSauce);