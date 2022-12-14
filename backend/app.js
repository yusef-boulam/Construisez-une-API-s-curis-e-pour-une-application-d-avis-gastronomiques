//chargement des modules
const mongoose = require('mongoose');
//on importe express
const express = require('express');
const path = require('path');

require('dotenv').config()

// chargment des fichiers routes
const saucesRoutes = require('./routes/sauces');
// chargment de la partie autentification
const userRoutes = require('./routes/user');


// on charge express dans la constante app
const app = express();


// LOGIQUE DE CONNECTION A MANGO DB
mongoose.connect(process.env.BDD,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//middleware qui va extraire le corp JSON du front
app.use(express.json());

// AUTENTIFICATION CORS qui ajoute des header et va permettre à l'application d'acceder a l API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//execution des routes d'autentification
app.use('/api/auth', userRoutes);
//execution des routes sauces
app.use('/api/sauces', saucesRoutes);
//gestion du chargement des images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req,res) =>{res.status(404).json({ message: 'ce end point n existe pas' })});

// on exporte la const app pour pouvoir l'utiliser dans le fichier server.js
module.exports = app;