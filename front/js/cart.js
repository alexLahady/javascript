//FONCTION
//PERMET DE LIRE LES OBJET DE LOCALSTORAGE
function valuesLocalStorage(keyString){
    let objLinea = localStorage.getItem(keyString);
    let objJson = JSON.parse(objLinea);
    //console.log(objJson);
    return objJson;
}


//VERIFIE S'IL EXISTE UN DOUBLON
//S'IL EXISTE AJOUTER DANS LA CATEGORIE QUANTITE
//SINON PASSER 
function verifIdQuantityExist(id,quantity,color){
    let res = valuesLocalStorage("panier");
    
    for(let i = 0;i<res.length;i++){

        resID = res[i].id;
        resColor = res[i].color;

        if( (resID == id) && (resColor == color) ){
            
            resQuantity = res[i].quantity;
            resQuantity = parseInt(resQuantity);
    
            res[i].quantity = resQuantity + parseInt(quantity);
            
            let cartObject = JSON.stringify(res);
            localStorage.setItem("panier",cartObject);
            //console.log("c'est vrai");
            return true;
        }
    }
    
    return false;
};

//AJOUTE UN NOUVEL OBJET SUR LOCALSTORAGE
function addtLocalStorage(id,quantity,color){
    let res = valuesLocalStorage("panier"); 
    let add = {
            id : id,
            quantity : quantity,
            color : color
        }
    res.push(add);
    let cartObject = JSON.stringify(res);
    localStorage.setItem("panier",cartObject);

};


//CALCUL LA SOMME DE TOUS LES CANAPE ET LA QUANTITE DES CANAPE 
//RENVOI LA VALEUR DANS UN TABLEAU 
function sumTotal(object){
    let value =  valuesLocalStorage("panier");
    let resID, resQuantity, resPrice;
    let sumQuantity = 0;
    let res = 0;

    for(let i = 0;i < value.length ;i++){
        resID = value[i].id;

        resQuantity = value[i].quantity;
        resQuantity = parseInt(resQuantity);

        resPrice = object[resID].price;
       
        res = res + (resPrice * resQuantity);
        sumQuantity += resQuantity;
    }
    return [sumQuantity,res];
};

//SUPPRIMER
function deleteLocal(id,color){
    let res = valuesLocalStorage("panier");
    let panier = res.filter((element) => element.id !== id || element.color !== color);

    let cartObject = JSON.stringify(panier);
    localStorage.setItem("panier",cartObject);
    
};

//CHANGE LA QUANTITE ET RECALCULE LA SOMME 

function changeQuantity(index,quantity){
    let res = valuesLocalStorage("panier");
    res[index].quantity = parseInt(quantity);
    
    let cartObject = JSON.stringify(res);
    localStorage.setItem("panier",cartObject);
    
};

//FONCTTION FOMRULAIRE

function formulaireError(idInput,idError){
    let formInput = document.getElementById(idInput);     
    let formError = document.getElementById(idError);

    formInput.addEventListener("blur", (event) => {
        if (idInput == "email" && formInput.value == '@'){
            formError.innerHTML = "Le champ n'est pas très bien rempli";
        }
        else if (idInput == "email"  && formInput.value.length > 0 && !formInput.value.includes("@") ){
            formError.innerHTML = "Il manque le @";
        }
        else if (formInput.value == ""){
            formError.innerHTML = "Le champ n'est pas rempli";
        }else{
            formError.innerHTML = "";
        }
    });
}





//MAIN

//SI ON A UNE VALEUR A AJOUTER
let resultat = window.location;
//console.log(resultat);
let url = new URL(resultat);
let id = url.searchParams.get("id");
fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(affiche => {
        if(id != null){
        //console.log("il y a quelques chose");
        
            let quantity = url.searchParams.get("quantity");
            if(quantity == 0){ 
                quantity = 1;
            }
            let color = url.searchParams.get("color");
            if(color == ""){ 
                color = affiche[id].colors[0];
            }

            //REMET L'URL À LA NORMAL DONC CART.HTML
            window.history.replaceState(null, null, "./cart.html");
            
            //console.log("id : "+id+" quantité : "+quantity+" couleur : "+color);
            //console.log("taille du local "+localStorage.length);
            if(localStorage.length == 0){
                let tabStorage = [];

                let canap = {
                    id : id,
                    quantity : quantity,
                    color : color
                }
                
                tabStorage.push(canap);
                console.log(tabStorage);

                let cartObject = JSON.stringify(tabStorage);
                localStorage.setItem("panier",cartObject);
            }else{
                if(!verifIdQuantityExist(id,quantity,color)){
                    addtLocalStorage(id,quantity,color);
                }
            }
        }   

//AFFICHER LA LISTE DES RESULTATS

        let value, resID, resColor, resQuantity;
        let cartOriginElement = document.getElementById('cart__items');

        value = valuesLocalStorage("panier");

        for(let i = 0;i < value.length;i++){
            //VARIABLE
            resID = value[i].id;
            resID = parseInt(resID);

            resColor = value[i].color;

            resQuantity = value[i].quantity;
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

            //click et modifier ?? quantité
            cartInputElement.addEventListener("click", (event) => {
                const r2 = cartInputElement.value;
                changeQuantity(i,r2);

                let tab = sumTotal(affiche);

                let totalQuantity = document.getElementById("totalQuantity");
                totalQuantity.innerHTML = tab[0];

                let totalPrice = document.getElementById("totalPrice");
                totalPrice.innerHTML = tab[1];
            });
            
            //SUPPRIMER

            let cartDeleteElement = document.createElement('div');
            cartDeleteElement.classList.add("cart__item__content__settings__delete");

            let cartDeleteItemElement = document.createElement('p');
            cartDeleteItemElement.classList.add("deleteItem");
            cartDeleteItemElement.innerHTML = "Supprimer";

            cartContentElement.appendChild(cartDeleteElement);
            cartDeleteElement.appendChild(cartDeleteItemElement);

            //click supprimeer
            cartDeleteElement.addEventListener("click", (event) => {
                const r1 = cartDeleteElement.closest(':not(div)');
                deleteLocal(r1.dataset.id,r1.dataset.color);
                window.location.reload();

            });
            

        }
        
        let tab = sumTotal(affiche);

        let totalQuantity = document.getElementById("totalQuantity");
        totalQuantity.innerHTML = tab[0];

        let totalPrice = document.getElementById("totalPrice");
        totalPrice.innerHTML = tab[1];

        //FORMULAIRE
        formulaireError('firstName','firstNameErrorMsg');
        formulaireError('lastName','lastNameErrorMsg');
        formulaireError('address','addressErrorMsg');
        formulaireError('city','cityErrorMsg');
        formulaireError('email','emailErrorMsg');

        
        //CONSTRUCTION DE L'OBJET POST
        let firstName = url.searchParams.get("firstName");
        if(firstName != null){
            let lastName = url.searchParams.get("lastName");
            let address = url.searchParams.get("address");
            let city = url.searchParams.get("city");
            let email = url.searchParams.get("email");

            let contact = {
                    firstName : firstName,
                    lastName: lastName,
                    address: address,
                    city: city,
                    email: email 
                };
            let products = valuesLocalStorage("panier");

            let data = {contact,products};
            
            //console.log(data);
        
        };
        
        


});

//quand on va commander récupérer les values au cas ou l'utilisateur veut les modifier
//Pour changer la valeur de la quanftité en direct il faut utiliser element.closet pour chaque valeur de input
//on doit le changer avec addEventListener

// pour supprimer soit faire remove et faire un reload soit faire autrement 
//Supprimer l'élément localStorage.removeItem("clé")
//Cherher la clé grâce à l'id et la couleur et pas l'inverse

// exemple de post 
/*
fetch("https://localhost:3000/login", {
  method: "POST",
  body: form
})
*/


// comment faire la commande 
/*
fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            //body:  ton objet contact + tableau de produits ,
            headers: {
                "Content-Type": "application/json",
            },
});
*/
/*
{
    contact = {
        firstName: "donnée",
        lastName: "donnée",
        address: "donnée",
        city: "donnée",
        email: "donnée"
    },
    products = [
        //{  canapé du panier 1 },
        //{  canapé du panier 2  },
        //{  canapé du panier 3  }
    ]
}

let data = {contact, products}
*/