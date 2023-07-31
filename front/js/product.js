let resultat = window.location;
let url = new URL(resultat);
let id = url.searchParams.get("id");

//AFFICHE L'ÉLÉMEN EN FOCNTION DE L'ID REÇU
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
    
    for(let i=0; i<affiche[id].colors.length;i++){
        const optionElement = document.createElement("option");
        optionElement.value = affiche[id].colors[i];
        optionElement.innerText = affiche[id].colors[i];
        colorsElement.appendChild(optionElement); 
    }   

    //ENVOYER AU PANIER
    //récupéré la quantité

    const addButtonElement = document.querySelector('.item__content__addButton');
    const cardElement = document.getElementById("addToCart");
    const linkCardElement = document.createElement('a');
    linkCardElement.href= "./cart.html";
    
    addButtonElement.appendChild(linkCardElement);
    linkCardElement.appendChild(cardElement);
    
    const button = document.querySelector("button");

    button.addEventListener("click", () => {
        let quantity = document.getElementById("quantity").value;
        if(parseInt(quantity) > 100){
            quantity =  100;
        }

        let color = document.getElementById("colors").value;
    
        linkCardElement.href= "./cart.html?id="+id+"&quantity="+parseInt(quantity)+"&color="+color;

    });
});