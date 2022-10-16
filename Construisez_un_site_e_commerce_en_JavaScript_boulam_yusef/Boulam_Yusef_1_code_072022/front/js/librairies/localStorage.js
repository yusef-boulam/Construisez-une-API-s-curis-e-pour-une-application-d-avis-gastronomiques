//FONCTION sauvegarde le tableau dans le local storage ///////////////////////////////////////////////////////////////////////
const sauvegardeLocalStorage = (arrayPanier) => {
    localStorage.arrayPanier = (JSON.stringify(arrayPanier));
  }
  
  //FONCTION qui charge le tableau depuis le local storage /////////////////////////////////////////////////////////////////////
  const chargeArrayPanier = () => {
    const arrayPanier = JSON.parse(localStorage.arrayPanier);
    console.log(arrayPanier);
    return arrayPanier
  }