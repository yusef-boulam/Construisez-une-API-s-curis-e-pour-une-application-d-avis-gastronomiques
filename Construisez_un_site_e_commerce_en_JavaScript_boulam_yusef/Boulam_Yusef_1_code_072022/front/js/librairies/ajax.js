//on utilise GET pour récuperer les données sur le serveur
const getCanap = async (url) => {

    const response = await fetch(url);

    if (response.status === 200) {
        return await response.json();
    }

    return -1

};

//on utilise POST pour envoyer les commandes au serveur
const postOrder = async (url, order) => {
    console.log("order", order)

    const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });

//si retour code 201 on recupere l' id de la reponse et on la retourne
     if (response.status === 201) {
          const newObjet =  await response.json();
          console.log(newObjet.orderId)
          return newObjet.orderId
     }

    return -1

};
