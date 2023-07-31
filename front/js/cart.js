//FONCTION
//PERMET DE LIRE LES OBJETS DE LOCALSTORAGE
function valuesLocalStorage(keyString){
    let objLinea = localStorage.getItem(keyString);
    let objJson = JSON.parse(objLinea);
    //console.log(objJson);
    return objJson;
}

//PERMET DE FAIRE UN TABLEAU _ID DE L'API EN FONCTION DES PRODUITS DANS LE PANIER
function tabProdutsID(object,products) {
    let tab =[];
    for(let i = 0;i < products.length; i++){
        let resID = products[i].id;
        tab.push(object[resID]._id);
    }
    return tab;
}

//VERIFIE S'IL EXISTE UN DOUBLON
//S'IL EXISTE ADDICTIONNER DANS LA CATEGORIE QUANTITE
//SINON PASSER 
function verifElementExist(id,quantity,color){
    let res = valuesLocalStorage("panier");
    for(let i = 0;i < res.length;i++){

        let resID = res[i].id;
        let resColor = res[i].color;
        
        if( (resID == id) && (resColor == color) ){
                    
            let resQuantity = res[i].quantity;
            resQuantity = parseInt(resQuantity);
            
            res[i].quantity = resQuantity + parseInt(quantity);
                    
            let cartObject = JSON.stringify(res);
            localStorage.setItem("panier",cartObject);
                
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
//AFFCIHE LA SOMME ET LE PRIX APRÈS LA BOUCLE
function sumTotalAffiche(object){
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
    let totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerHTML = sumQuantity;

    let totalPrice = document.getElementById("totalPrice");
    totalPrice.innerHTML = res;
};

//SUPPRIME L'ÉLÉMENT DANS LOCALSTORAGE EN FONCTION DE L'ID ET LA COULEUR
function deleteLocal(id,color){
    let res = valuesLocalStorage("panier");
    let panier = res.filter((element) => element.id != id || element.color != color);

    let cartObject = JSON.stringify(panier);
    localStorage.setItem("panier",cartObject);
    
};

//CHANGE LA QUANTITÉ
function changeQuantity(id,color,quantity){
    let res = valuesLocalStorage("panier");
    for(let i = 0;i < res.length;i++){
        if(res[i].id == id && res[i].color == color){
            res[i].quantity = quantity;
            break;
        }
    }
    let cartObject = JSON.stringify(res);
    localStorage.setItem("panier",cartObject);
    
};

//FONCTTION FOMRULAIRE POUR LES ERREURS
function formulaireError(idInput,idError){
    let formInput = document.getElementById(idInput);     
    let formError = document.getElementById(idError);

    //CHAINE DE CARACTÈRE POUR TESTER SI UN CHIFFRE EXISTE
    let masque = /[0-9]/;

    formInput.addEventListener("blur", () => {

        //TEST SI DANS LA PARTIE EMAIL IL EXISTE JUSTE UN @
        if (idInput == "email" && formInput.value == '@'){
            formError.innerHTML = "Le champ n'est pas très bien rempli";
        }

        //TEST SI DANS LA PARTIE EMAIL IL EXISTE UN TEXTE MAIS SANS LE @
        else if (idInput == "email"  && formInput.value.length > 0 && !formInput.value.includes("@") ){
            formError.innerHTML = "Il manque le @";
        }

        //TEST SI DANS LA PARTIE FIRSTNAME ET LASTNAME ILS EXISTENT UN CHIFFRE
        else if ( (idInput == "firstName" || idInput == "lastName") && masque.test(formInput.value) ) {
            formError.innerHTML = "Il y a un chiffre dans le champ";
        }

        //TEST SI LE CHAMP EST VIDE
        else if (formInput.value == ""){
            formError.innerHTML = "Le champ n'est pas rempli";
        }
        
        //CELA VEUT DIRE QUE LE CHAMP CORRESPONDANT RESPECTE TOUTES LES CONDITIONS
        else{
            formError.innerHTML = "";
        }
    });
}


//MAIN

let resultat = window.location;
let url = new URL(resultat);
let id = url.searchParams.get("id");
fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(affiche => {
        //SI ON A UNE VALEUR A AJOUTER

        if(id != null){
        
            let quantity = url.searchParams.get("quantity");
            if(parseInt(quantity) <= 0 || quantity == 'NaN'){ 
                quantity = 1;
            }
            let color = url.searchParams.get("color");
            if(color == ""){ 
                color = affiche[id].colors[0];
            }

            //REMET L'URL À LA NORMAL DONC CART.HTML
            window.history.replaceState(null, null, "./cart.html");
            
            //AJOUTE UN NOUVEL ÉLÉMENT DANS LOCALSTORAGE SI LE LOCAL EST VIDE
            if(localStorage.length == 0){
                let tabStorage = [];

                let canap = {
                    id : id,
                    quantity : quantity,
                    color : color
                }
                
                tabStorage.push(canap);

                let cartObject = JSON.stringify(tabStorage);
                localStorage.setItem("panier",cartObject);
            }else{
                if(!verifElementExist(id,quantity,color)){
                    addtLocalStorage(id,quantity,color);
                }
            }
        }   

//AFFICHER LA LISTE DES RESULTATS
        if(localStorage.length > 0){

            let value, resID, resColor, resQuantity;
            //ORIGINE
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

                //CHANGE LA VALEUR DE LA QUANTITÉ À CHAQUE CLIQUE
                cartInputElement.addEventListener("change", () => {
                    const r3 = cartDeleteElement.closest(':not(div)');
                    let r2 = cartInputElement.value;

                    if(r2 > 100){
                        r2 = 100;
                        cartInputElement.value = String(r2);
                    }else if(r2 <= 0){
                        r2 = 1;
                        cartInputElement.value = String(r2);
                    }
                    
                    changeQuantity(r3.dataset.id,r3.dataset.color,r2);
                    sumTotalAffiche(affiche);
                });
                
                //SUPPRIMER

                let cartDeleteElement = document.createElement('div');
                cartDeleteElement.classList.add("cart__item__content__settings__delete");

                let cartDeleteItemElement = document.createElement('p');
                cartDeleteItemElement.classList.add("deleteItem");
                cartDeleteItemElement.innerHTML = "Supprimer";

                cartContentElement.appendChild(cartDeleteElement);
                cartDeleteElement.appendChild(cartDeleteItemElement);

                //SUPPRIME L'ÉLÉMENT QUAND ON CLIQUE SUR 'SUPPRIMER'
                cartDeleteElement.addEventListener("click", () => {
                    const r1 = cartDeleteElement.closest(':not(div)');
                    deleteLocal(r1.dataset.id,r1.dataset.color);
                    r1.remove();
                    //window.location.reload();
                    sumTotalAffiche(affiche);
                });
                

            }
            
            //SOMME TOTAL DE LA QUANTITÉ ET LE PRIX ET L'AFFCIHE 
            sumTotalAffiche(affiche);

            //FORMULAIRE
            formulaireError('firstName','firstNameErrorMsg');
            formulaireError('lastName','lastNameErrorMsg');
            formulaireError('address','addressErrorMsg');
            formulaireError('city','cityErrorMsg');
            formulaireError('email','emailErrorMsg');

            
            //CONSTRUCTION DE L'OBJET POST
            orderElement = document.querySelector('.cart__order__form');
            
            orderElement.onsubmit = (event) => {
                let firstName = document.getElementById('firstName').value;
                let lastName = document.getElementById('lastName').value;
                let address = document.getElementById('address').value;
                let city = document.getElementById('city').value;
                let email = document.getElementById('email').value;
                
                let contact = {
                    firstName : firstName,
                    lastName: lastName,
                    address: address,
                    city: city,
                    email: email 
                }
                let products = valuesLocalStorage("panier");
                products = tabProdutsID(affiche,products);
            
                let data = {contact,products};

                fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                body:  JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    }
                })       
                .then((response) => response.json())
                .then((result) => {
                    if(result.orderId != undefined){
                        localStorage.clear();
                        window.location.href = "./confirmation.html?id="+result.orderId;
                    }else {
                        console.log('il y a une erreur');
                    }
                })
                .catch((error) => {
                    console.error("Error :", error.message);
                })

                //EMPÊCHE LE FORMULAIRE DE RAFRAÎCHIR LA PAGE QUAND ON CLIQUE SUR COMMANDER
                event.preventDefault();
            }
        }   
        
});
