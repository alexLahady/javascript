let resultat = window.location;
console.log(resultat);
let url = new URL(resultat);
let id = url.searchParams.get("id");

let orderElement = document.getElementById('orderId');
orderElement.innerHTML = id;


/*
en gros dans les donnée product il faut mettre l'id du back donc le _id et le récupéré par le orderId
*/