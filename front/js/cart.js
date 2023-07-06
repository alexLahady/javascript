//FONCTION

//Prroblème faire une liste des local storage à part
function verifIdQuantityExist(id,quantity,color){
    console.log("fonction verif id="+id+" quantité="+quantity+" couleur="+color);
    console.log("local id="+localStorage.key(0));
    for(let i = 0;i<localStorage.length;i++){
        if((localStorage.key(i).id==id) && (localStorage.key(i).color == color)){
            localStorage.key(i).quantity = localStorage.key(i).quantity + quantity;
            console.log(localStorage.key(i).quantity);
            console.log("c'est vrai");
            return true;
        }
    }
    console.log("c'est faux");
    return false;
};

function addtLocalStorage(id,quantity,color){
    let i = 0;
    while(localStorage.key(i) == "panier "+i){
        i++;
    }
    let str = "panier "+i;
    console.log("l'id du panier est '"+str+"'");
    let canap = {
            id : id,
            quantity : quantity,
            color : color
        }
    let cartObject = JSON.stringify(canap);
    localStorage.setItem(str,cartObject);
};








//MAIN

let resultat = window.location;
console.log(resultat);
let url = new URL(resultat);
let id = url.searchParams.get("id");
if(id != null){
    console.log("il y a quelques chose");
    
    let quantity = url.searchParams.get("quantity");
    if(quantity==0){ 
        quantity=1 
    };
    let color = url.searchParams.get("color");
    fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(affiche => {
        if(color == ""){ 
            color = affiche[id].colors[0];
        };
    console.log("id : "+id+" quantité : "+quantity+" couleur : "+color);
    console.log("taille du local "+localStorage.length);
    if(localStorage.length == 0){
        let canap = {
            id : id,
            quantity : quantity,
            color : color
        }
        let cartObject = JSON.stringify(canap);
        localStorage.setItem("panier 0",cartObject);
    }else{
        if(verifIdQuantityExist(id,quantity,color)==false){
            addtLocalStorage(id,quantity,color);
        }
    }
    });
};  






/*
fetch("http://localhost:3000/api/products")
.then(response => response.json())
.then(affiche => {
    if(color == ""){ 
        color = affiche[id].colors[0];
    };
    console.log("id : "+id+" quantité : "+quantity+" couleur : "+color);

    //PANIER IMAGE

    let cartImgElement = document.querySelector(".cart__item__img");

    let imgElement = document.createElement('img');
    imgElement.src = affiche[id].imageUrl;
    imgElement.alt = affiche[id].altTxt;

    cartImgElement.appendChild(imgElement);

    //DESCRITION DU PRODUIT

    let cartDescritptionElement = document.querySelector(".cart__item__content__description");

    let cartTitleElement = document.createElement('h2');
    cartTitleElement.innerHTML = affiche[id].name;

    let cartColorElement = document.createElement('p');
    cartColorElement.innerHTML = color;

    let cartPriceElement = document.createElement('p');
    cartPriceElement.innerHTML = affiche[id].price +" €";

    cartDescritptionElement.appendChild(cartTitleElement);
    cartDescritptionElement.appendChild(cartColorElement);
    cartDescritptionElement.appendChild(cartPriceElement);

    //AFFICHER LA QUANTITE
    
    let cartQuantityElement = document.querySelector(".cart__item__content__settings__quantity");

    let cartInputElement = document.createElement('input');
    cartInputElement.type = "number";
    cartInputElement.class = "itemQuantity";
    cartInputElement.name = "itemQuantity";
    cartInputElement.min = "1";
    cartInputElement.max = "100";
    cartInputElement.value = String(quantity);

    cartQuantityElement.appendChild(cartInputElement);
});

*/





/*
let can = {
    id : 1,
    quantity : 2,
    color : "blue"
}
let cartObject = JSON.stringify(can);
localStorage.setItem("panier",cartObject);

let can2 = {
    id : 6,
    quantity : 4,
    color : "red"
}
let cartObject2 = JSON.stringify(can2);
localStorage.setItem("panier2",cartObject2);

let can3 = {
    id : 5,
    quantity : 6,
    color : "purple"
}
let cartObject3 = JSON.stringify(can3);
localStorage.setItem("panier3",cartObject3);
*/