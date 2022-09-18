//chargement des modules
const mongoose = require('mongoose');
//on importe express
const express = require('express');
const path = require('path');

// chargment des fichiers routes
const saucesRoutes = require('./routes/sauces');
// chargment de la partie autentification
const userRoutes = require('./routes/user');

const app = express();

// LOGIQUE DE CONNECTION A MANGO DB
mongoose.connect('mongodb+srv://yusefdev:test1234@cluster0.gxfyist.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// BODY PARSER
app.use(express.json());

// AUTENTIFICATION CORS qui ajoute des header et va permettre à l'application d'acceder a l API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


//execution des routes sauces
app.use('/api/sauces', saucesRoutes);
//execution des routes d'autentification
app.use('/api/auth', userRoutes);
//gestion du chargement des images
app.use('/images', express.static(path.join(__dirname, 'images')));


// on exporte la const app pour pouvoir l'utiliser dans le fichier server.js
module.exports = app;