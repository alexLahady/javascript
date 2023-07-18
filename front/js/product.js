let resultat = window.location;
console.log(resultat);
let url = new URL(resultat);
let id = url.searchParams.get("id");
//console.log("voici l'id numero "+id);

fetch("http://localhost:3000/api/products")
.then(response => response.json())
.then(affiche => {
    //PARENT IMG
    const divItemImgElement = document.querySelector(".item__img");

    //IMG
    const imgElement = document.createElement("img");
    imgElement.src= affiche[id].imageUrl;
    imgElement.alt= affiche[id].altTxt;

    divItemImgElement.appendChild(imgElement);

    //TITRE
    const titleElement = document.getElementById("title");
    titleElement.innerText = affiche[id].name;

    //PRIX
    const priceElement = document.getElementById("price");
    priceElement.innerText = affiche[id].price;

    //DESCRIPTION
    const descriptionElement = document.getElementById("description");
    descriptionElement.innerText = affiche[id].description;

    //COULEURS
    const colorsElement = document.getElementById("colors");
    //console.log("la longueur du tableau couleurs est de "+affiche[id].colors.length);
    
    for(let i=0; i<affiche[id].colors.length;i++){
        const optionElement = document.createElement("option");
        optionElement.value = affiche[id].colors[i];
        optionElement.innerText = affiche[id].colors[i];
        //console.log(optionElement);
        colorsElement.appendChild(optionElement); 
    }   

    //ENVOYER AU PANIER
    //récupéré la quantité

    const addButtonElement = document.querySelector('.item__content__addButton');
    const cardElement = document.getElementById("addToCart");
    const linkCardElement = document.createElement('a');
    linkCardElement.href= "./cart.html";
    console.log(linkCardElement);

    addButtonElement.appendChild(linkCardElement);
    linkCardElement.appendChild(cardElement);
    
    const button = document.querySelector("button");

    button.addEventListener("click", (event) => {
        let quantity = document.getElementById("quantity").value;
        //console.log("La quantité d'article est de "+quantity);

        let color = document.getElementById("colors").value;
        //console.log(color);

        linkCardElement.href= "./cart.html?id="+id+"&quantity="+quantity+"&color="+color;
        //console.log(linkCardElement);

    });
});