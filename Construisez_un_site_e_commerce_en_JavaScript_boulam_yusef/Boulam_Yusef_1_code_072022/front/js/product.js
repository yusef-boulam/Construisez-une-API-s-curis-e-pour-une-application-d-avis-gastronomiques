///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//INSERER LES DETAILS CANAPE SELECTIONNE DANS LA PAGE
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// on crée la FONCTION qui recupere l'ID dans l'URL  ////////////////////////////////////////////////////////////////////////
const recupId = () => {
  //on recupere url du produit
  const url = new URL(document.location.href);
  // on recupere l'id dans l'Url
  const idProduit = url.searchParams.get("id");
  return idProduit;
}

///on crée la FONCTION "MAIN" qui récupère la CARD CANAPE dans la base de donnée et on l'ijecte dans le HTML//////////////////////////////
const showListProduct = async () => {

  // on execute la FONCTION recupId qu'on charge dans la variable idProduit
  const idProduit = recupId();

  // on recupere les datas avec la FONCTION getCanap
  const datas = await getCanap(`http://localhost:3000/api/products/${idProduit}`);
  console.log(datas)

  // on test l'Url si inexistant ou erroné on renvoi vers la page d'accueil
  if (datas._id !== idProduit) {
    location.href = "./index.html";
    return;
  };

  // on verifie la reception des datas
  if (datas === -1) {
    alert("problème de connection au serveur, veuillez retenter ulterieurement ou vérifier votre connection.");
    return;
  };

  // on injecte les datas dans le code HTML
  document.querySelector(".item__img").innerHTML = `<img src=${datas.imageUrl} alt="Photographie d'un canapé">`;
  document.querySelector("#title").innerHTML = `${datas.name}`;
  document.querySelector("#price").innerHTML = `${datas.price}`;
  document.querySelector("#description").innerHTML = `${datas.description}`;

  // on injecte les COULEURS séléctionnables dans le code HTML avec +=
  datas.colors.forEach(color => {
    const addOptionCouleur = `<option value="${color}">${color}</option>`;
    document.querySelector("#colors").innerHTML += addOptionCouleur;
  });

  // on execute la FONCTION///////////////////////////////////////////////////////////////////////////////////////
 // placé à l'intérieur de showListProduct() pour récupérer les datas. Ajoute le produit et la quantité dans le panier au clic.
  AjoutPanier(datas);
};

// on execute la FONCTION///////////////////////////////////////////////////////////////////////////////////////
//FONCTION "MAIN" qui récupère la CARD CANAPE dans la base de donnée et on l'ijecte dans le HTML
showListProduct();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FONCTION AJOUT PANIER /////////////////////////////////////////////////////////////////////////////////////////////////
//Ajoute le produit et la quantité dans le panier au clic.
const AjoutPanier = (datas) => {

  // on initialise le tableau si localStorage vide sinon on charge le localStorage
  let arrayPanier = localStorage.length === 0 ? [] : chargeArrayPanier();

  // on ECOUTE le boutton au "clic"
  const ajoutPanier = document.getElementById('addToCart').addEventListener('click', () => {

    // on crée le nouvel objet
    const newObjetPanier = {
      _id: datas._id,
      color: document.getElementById("colors").value,
      quantity: Number(document.getElementById("quantity").value),
      image: datas.imageUrl,
      name: datas.name,
    };
    console.log("newObjetPanier", newObjetPanier)

    // on verifie que la quantite soit saisie
    if (newObjetPanier.color === "") {
      alert("il manque la couleur du produit");
      return;
    };

    // on verifie que la quantite est differente de 0
    if (newObjetPanier.quantity === 0) {
      alert("il manque la quantité du produit");
      return;
    };

      // on verifie que la quantite n'es pas negative
    if (newObjetPanier.quantity < 0) {
      alert("la quantité ne peut pas être négative");
      return;
    };

      // on verifie que la quantite n'es pas superieure à 100
    if (newObjetPanier.quantity > 100) {
      alert("la quantité ne peut pas être supérieure à 100");
      return;
    };

    // on verifie si le produit à deja été ajouté 
    const produitIdentique = arrayPanier.find(element => element._id === newObjetPanier._id && element.color === newObjetPanier.color);
    console.log(produitIdentique)

    // si produit identique déjà ajouté on modifie seulement la quantité
    if (produitIdentique !== undefined) {

       // on verifie que la quantité du panier ne depassera pas 100
    if (produitIdentique.quantity + newObjetPanier.quantity > 100){
      alert("la quantité du produit dans le panier ne peut être supérieure à 100");
      return;
    }
     //on modifie la quantité du panier
      alert("Quantité du panier modifié");
      produitIdentique.quantity += newObjetPanier.quantity;

      // SINON ajouter un nouvel objet dans le tableau
    } else {
      alert("Article ajouté au panier");
      arrayPanier.push(newObjetPanier);
    }
    //on sauvegarde dans le local Storage
    sauvegardeLocalStorage(arrayPanier);
    console.log("localStorage", localStorage)

    // redirection vers le panier
    location.href = "./cart.html"
  }
  )
};

