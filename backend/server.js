
//importe le package HTTP de node et on le stocke dans un objet
const http = require('http');

//on crée un serveur
//on utilise la méthode crateServeur qui ecoute les requette et execute la fonction
const server = http.createServer((req, res) => {
    //on utilise la méthode end pour retourner la reponse
    res.end('Voilà la réponse du serveur test !');
});
    //on utilise la methode listen pour ecouter le port 
server.listen(process.env.PORT || 3000);