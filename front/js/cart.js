//FONCTION
//PERMET DE LIRE LES OBJET DE LOCALSTORAGE
function valuesLocalStorage(keyString){
    let objLinea = localStorage.getItem(keyString);
    let objJson = JSON.parse(objLinea);
    console.log(objJson);
    return objJson;
}


//VERIFIE S'IL EXISTE UN DOUBLON
//S'IL EXISTE AJOUTER DANS LA CATEGORIE QUANTITE
//SINON PASSER 
function verifIdQuantityExist(id,quantity,color){
    //console.log("fonction verif id="+id+" quantité="+quantity+" couleur="+color);
    //console.log("local id = "+ valuesLocalStorage(localStorage.key(0)).id);
    let resID, resColor, resQuantity ;
    
    for(let i = 0;i<localStorage.length;i++){

        resID = valuesLocalStorage(localStorage.key(i)).id;
        resColor = valuesLocalStorage(localStorage.key(i)).color;

        if( (resID == id) && (resColor == color) ){
            
            resQuantity = valuesLocalStorage(localStorage.key(i)).quantity;
            resQuantity = parseInt(resQuantity);
            //console.log("l'index est "+i+"localstorage 0 = "+localStorage.key(i));
            //console.log(typeof localStorage.key(i));
            
            let canap = {
                id : id,
                quantity : resQuantity + quantity,
                color : color
            }
            let objLinea = JSON.stringify(canap);
            localStorage.setItem(localStorage.key(i),objLinea);
            
            return true;
        }
    }
    
    return false;
};

//AJOUTE UN NOUVEL OBJET SUR LOCALSTORAGE
function addtLocalStorage(id,quantity,color){
    let i = 0;
    //console.log(localStorage.key(42));
    while(localStorage.key(i) != null){//erreur ici faire par rapport à localstorage le teste
        i++;
    }
    let str = "panier "+i;
    //console.log("l'id du panier est '"+str+"'");
    let canap = {
            id : id,
            quantity : quantity,
            color : color
        }
    let cartObject = JSON.stringify(canap);
    localStorage.setItem(str,cartObject);
};

//CALCUL LA SOMME DE TOUS LES CANAPE ET LA QUANTITE DES CANAPE 
//RENVOI LA VALEUR DANS UN TABLEAU 
function sumTotal(){
    let resID, resQuantity, res;
    let sumQuantity = 0;
    let tab =[];

    fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(affiche => {
        for(let i = 0;i<localStorage.length;i++){
            resID = valuesLocalStorage(localStorage.key(i)).id;
            //resID = parseInt(resID);

            resQuantity = valuesLocalStorage(localStorage.key(i)).quantity;
            resQuantity = parseInt(resQuantity);

            res = affiche[resID].price * resQuantity;
            console.log(res);
            res += res;
            console.log("la somme est de "+res);
            sumQuantity += resQuantity;
        }
        tab = [sumQuantity,res];
        console.log(tab);
        return tab;
    })
};



//MAIN

//SI ON A UNE VALEUR A AJOUTER
let resultat = window.location;
console.log(resultat);
let url = new URL(resultat);
let id = url.searchParams.get("id");
if(id != null){
    //console.log("il y a quelques chose");
    
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
    //console.log("id : "+id+" quantité : "+quantity+" couleur : "+color);
    //console.log("taille du local "+localStorage.length);
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

//AFFICHER LA LISTE DES RESULTATS

fetch("http://localhost:3000/api/products")
.then(response => response.json())
.then(affiche => {
    let resID, resColor, resQuantity;
    let cartOriginElement = document.getElementById('cart__items');

    for(let i = 0;i<localStorage.length;i++){
        //VARIABLE
        resID = valuesLocalStorage(localStorage.key(i)).id;
        resID = parseInt(resID);

        resColor = valuesLocalStorage(localStorage.key(i)).color;

        resQuantity = valuesLocalStorage(localStorage.key(i)).quantity;
        resQuantity = parseInt(resQuantity);

        //GRAND PARENT

        let cartArticleElement = document.createElement('article');
        cartArticleElement.classList.add("cart__item");
        cartArticleElement.dataset.id = String(resID);
        cartArticleElement.dataset.color = resColor;
        
        cartOriginElement.appendChild(cartArticleElement);

        //PANIER IMAGE

        let cartImgElement = document.createElement("div");
        cartImgElement.classList.add("cart__item__img");

        let imgElement = document.createElement('img');
        imgElement.src = affiche[resID].imageUrl;
        imgElement.alt = affiche[resID].altTxt;

        cartArticleElement.appendChild(cartImgElement);
        cartImgElement.appendChild(imgElement);

        //CONTENU

        let cartContentElement = document.createElement("div");
        cartContentElement.classList.add("cart__item__content");

        cartArticleElement.appendChild(cartContentElement);

        //DESCRITION DU PRODUIT

        let cartDescritptionElement = document.createElement("div");
        cartDescritptionElement.classList.add("cart__item__content__description");

        let cartTitleElement = document.createElement('h2');
        cartTitleElement.innerHTML = affiche[resID].name;

        let cartColorElement = document.createElement('p');
        cartColorElement.innerHTML = resColor;

        let cartPriceElement = document.createElement('p');
        cartPriceElement.innerHTML = affiche[resID].price +" €";

        cartContentElement.appendChild(cartDescritptionElement);
        cartDescritptionElement.appendChild(cartTitleElement);
        cartDescritptionElement.appendChild(cartColorElement);
        cartDescritptionElement.appendChild(cartPriceElement);

        //AFFICHER LA QUANTITE
        
        let cartContentSetttingElement = document.createElement("div");
        cartContentSetttingElement.classList.add("cart__item__content__settings");

        let cartQuantityElement = document.createElement("div");
        cartQuantityElement.classList.add("cart__item__content__settings__quantity");

        cartContentElement.appendChild(cartContentSetttingElement);
        cartContentSetttingElement.appendChild(cartQuantityElement);

        let cartTextElement = document.createElement("p");
        cartTextElement.innerHTML = "Qté : ";

        let cartInputElement = document.createElement('input');
        cartInputElement.type = "number";
        cartInputElement.classList.add("itemQuantity");
        cartInputElement.name = "itemQuantity";
        cartInputElement.min = "1";
        cartInputElement.max = "100";
        cartInputElement.value = String(resQuantity);

        cartQuantityElement.appendChild(cartTextElement);
        cartQuantityElement.appendChild(cartInputElement);
        
        //SUPPRIMER

        let cartDeleteElement = document.createElement('div');
        cartDeleteElement.classList.add("cart__item__content__settings__delete");

        let cartDeleteItemElement = document.createElement('p');
        cartDeleteItemElement.classList.add("deleteItem");
        cartDeleteItemElement.innerHTML = "Supprimer";

        cartContentElement.appendChild(cartDeleteElement);
        cartDeleteElement.appendChild(cartDeleteItemElement);
    }
    /*
    let tab = []
    tab = sumTotal();
    console.log(tab);
    let totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerHTML = tab[1];

    let totalPrice = document.getElementById("totalPrice");
    totalPrice.innerHTML = tab[0];
    */

});

