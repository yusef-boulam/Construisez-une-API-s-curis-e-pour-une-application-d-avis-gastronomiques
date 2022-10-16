//FONCTION principale qui remplit le panier, ecoute la saisie du panier et envoi la commande au serveur////////////////////////////////////////////////////////////
const showPanier = async () => {
  // on recupere le tableau dans le local storage
  let arrayPanier = chargeArrayPanier();
  // si local storage vide on retourne sur la home page
  if (arrayPanier.length === 0) {
    alert("panier vide");
    location.href = "./index.html"
    return
  }

  // on recupere les datas avec la FUNCTION getCanap
  let datas = await getCanap('http://localhost:3000/api/products');
  console.log(datas);

  // on verifie la reception des datas
  if (datas === -1) {
    alert("problème de connection au serveur, veuillez retenter ulterieurement ou vérifier votre connection.");
    return;
  };

  // on initialise la variable objetPanier
  let objetPanier = "";

  /* on boucle avec la METHODE forEach sur chaque objet du localStorage
        et on charge les objets dans le panier  */

  arrayPanier.forEach(objet => {

    // on recupere le prix du serveur pour chaque produit
    const price = datas.find(element => element._id === objet._id).price

    // on charge les donnée du local storage + le prix
    objetPanier += ` <article class="cart__item" data-id= ${objet._id} data-color=${objet.color} >
       <div class="cart__item__img">
         <img src=${objet.image} alt="Photographie d'un canapé">
       </div>
       <div class="cart__item__content">
         <div class="cart__item__content__description">
           <h2>${objet.name}</h2>
           <p>${objet.color}</p>
           <p>${price} €</p>
         </div>
         <div class="cart__item__content__settings">
           <div class="cart__item__content__settings__quantity">
             <p>Qté : </p>
             <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${objet.quantity}>
           </div>
           <div class="cart__item__content__settings__delete">
             <p class="deleteItem">Supprimer</p>
           </div>
         </div>
       </div>
     </article> `

    // on injecte les articles dans le code HTML
    document.getElementById("cart__items").innerHTML = objetPanier;
  });

//FONCTION qui calcule la quantité et le prix total des articles du panier /

const totalQuantityPrice = () => {
  // total des articles
  let totalQuantity = 0;
  arrayPanier.forEach(canape => {
    totalQuantity += canape.quantity;
  })
  document.getElementById("totalQuantity").innerHTML = totalQuantity;


  // total du prix
  let totalPrice = 0;
  arrayPanier.forEach(canape => {
    const price = datas.find(element => element._id === canape._id).price;
    totalPrice += price * canape.quantity;
  })
  document.getElementById("totalPrice").innerHTML = totalPrice;
}
  
//on execute la FONCTION qui calcule la quantité et le prix total des articles du panier /
totalQuantityPrice();

  // SUPPRIMER L'ARTICLE
  // on boucle sur chaque lien "supprimer" et on ecoute le click
  const allButtonDelete = document.querySelectorAll('.deleteItem')
  
  allButtonDelete.forEach(btnDelete => {
    btnDelete.addEventListener('click', () => {
      //on recupere l id du produit cliqué dans le panier
      const idObjectToDelete = btnDelete.closest('.cart__item').dataset.id
      const colorObjectToDelete = btnDelete.closest('.cart__item').dataset.color
      //on le compare à l'index du tableau / on recupere l'index et on le supprime
      const objectArrayToDelete = arrayPanier.find(element => element._id === idObjectToDelete && element.color === colorObjectToDelete);
      const indexToDelete = arrayPanier.indexOf(objectArrayToDelete);
      arrayPanier.splice(indexToDelete, 1);
      //on sauvegarde dans le local storage
      sauvegardeLocalStorage(arrayPanier);
     //on execute showPanier pour re-actualiser le contenu du panier
      showPanier();
      })
    });

  // MODIFIER QUANTITE ARTICLE
  // on boucle sur les inputs de chaque produit et on écoute le changement
  document.querySelectorAll('.itemQuantity').forEach((inputQuantity) => {
    inputQuantity.addEventListener('change', () => {
        // on verifie que la saisie soit positive
      if (inputQuantity.value < 1) {
        alert("la quantité ne peut être inferieure à 1")
        return
      }
        // on verifie que la saisie soit inferieur à 100
      if (inputQuantity.value > 100) {
        alert("la quantité ne peut être supérieure à 100")
        location.href = "./cart.html"
        return
      }
      //on recupere l id du produit modifié dans le panier et sa couleure
      const idObjectToChange = inputQuantity.closest('.cart__item').dataset.id
      const colorObjectToChange = inputQuantity.closest('.cart__item').dataset.color
      //on recupere l'emplacement de l'objet dans le tableau chargé depuis le local storage et on modifie la quantite
      const objectArrayToChange = arrayPanier.find(element => element._id === idObjectToChange && element.color === colorObjectToChange);
      objectArrayToChange.quantity = Number(inputQuantity.value)
      //on sauvegarde à nouveau dans le local storage et on actualise la page
      sauvegardeLocalStorage(arrayPanier);
      //on execute la FONCTION qui calcule la quantité et le prix total des articles du panier /
      totalQuantityPrice();
    }
    )
  })

  // FORMULAIRE////////////////////////////////////////////////////////////

  // On écoute le boutton commander et on supprime le comportment par defaut.
  document.getElementById("order").addEventListener('click', (event) => {
    event.preventDefault();
    // On execute les fonctions et on les stocke dans des constantes.
    const isValidFirstName = firstName();
    const isValidLastName = lastName();
    const isValidaddress = address();
    const isValidcity = city();
    const isValidemail = email();
    console.log(isValidFirstName)

    // On controle que toutes les infos du formulaires sont valides
    if (isValidFirstName && isValidLastName && isValidaddress && isValidcity && isValidemail) {

      // FONCTION qui crée l'objet contact, 
      const saveOrder = async () => {
        const contact = {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        };
         //on crée un objet "order" qui stoque l'objet contact 
         //et le tableau contenant la commande 
        const order = {
          contact, 
          products: arrayPanier.map(product => product._id),
      }
         // on charge le numberOrder si la commande c'est bien passé (envoi des données)
        const numberOrder = await postOrder('http://localhost:3000/api/products/order', order);
        // on veri fie la reception du numero de commande
        if (numberOrder === -1) {
          alert("problème d'enregistrement sur le serveur. La commande n'a pas pu être envoyé, veuillez retenter ulterieurement");
          return;
        };
       // si la requette c'est bien passé on se deplace sur la page confirmation en inserant le numéro de commande avec la methode querystring
        location.href = `./confirmation.html?orderid=${numberOrder}`
      }
      // on execute la FONCTION qui crée l'objet contact, recupere le tableau contenant la commande et l'envoi au serveur avec la methode POST
      saveOrder();

    } else {
      alert("commande pas envoyé");
    }
  })
}
// on execute la FUNCTION principale qui remplit le panier, ecoute la saisie du panier et envoi la commande au serveur
showPanier();


