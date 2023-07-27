let resultat = window.location;
let url = new URL(resultat);
let id = url.searchParams.get("id");

let orderElement = document.getElementById('orderId');
orderElement.innerHTML = id;
