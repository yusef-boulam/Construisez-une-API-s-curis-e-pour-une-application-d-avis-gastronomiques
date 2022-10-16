
//FUNCTION qui recupere les CARDS CANAPES dans la base de donnée et l'ijecte dans le HTML
const showListProduct = async () => {

 // on initialise la variable
  let canapCards = "";

  // on recupere les datas avec la FUNCTION getCanap
  const datas = await getCanap('http://localhost:3000/api/products');

    // on verifie la reception des datas
    if (datas === -1) {
      alert("problème de connection au serveur, veuillez retenter ulterieurement ou vérifier votre connection.");
      return;
    };  

   /* on boucle avec la METHODE forEach sur chaque objet du datas 
      et on charge les valeurs dans canapCards  */
    datas.forEach(canap => {
   
      canapCards += `<a href="./product.html?id=${canap._id}">
      <article>
        <img src="${canap.imageUrl}" alt=${canap.altTxt}>
        <h3 class="productName">${canap.name}</h3>
        <p class="productDescription">${canap.description}</p>
      </article>
    </a>`   
    });

     // on injecte les datas dans le code HTML
    document.getElementById("items").innerHTML=canapCards;
   
}
  // on execute la FUNCTION qui recupere les CARDS CANAPES dans la base de donnée et l'ijecte dans le HTML
showListProduct();