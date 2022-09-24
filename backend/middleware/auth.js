const jwt = require('jsonwebtoken');

// controle du TOKEN pour authentification renforcée pour nos ROUTES.
 
module.exports = (req, res, next) => {
   try {
    // pour recuperer le token dans le header et on le SPLIT (creation d'un tableau on recupere le deuxieme element)
       const token = req.headers.authorization.split(' ')[1];
    // on decode le TOKEN avec .verify 
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // on recupere le user id du TOKEN
       const userId = decodedToken.userId;
    // on crée un objet AUTH dans req avec un champ userId
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};