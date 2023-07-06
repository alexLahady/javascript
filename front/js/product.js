let resultat = window.location;
console.log(resultat);
let url = new URL(resultat);
let id = url.searchParams.get("id");
console.log("voici l'id numero "+id);

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
    
    const optionElement = document.createElement("option");
    console.log("la longueur du tableau couleurs est de "+affiche[id].colors.length);
    for(let i = 0;i<affiche[id.colors.length];i++){
        let text = "optionElement"+i;
        const text;
        console.log(text);
    }
    /*
    tab =[]
    for(let i=0; i<affiche[id].colors.length;i++){
        optionElement.value = affiche[id].colors[i];
        optionElement.innerText = affiche[id].colors[i];
        console.log(optionElement);
        tab.push(optionElement);
    }   
    for(let i = 0;i<tab.length;i++){
        optionElement += tab[i];
    }
    
    colorsElement.appendChild(optionElement);
    */

});