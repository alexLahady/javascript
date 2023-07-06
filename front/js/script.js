/*test */

fetch("http://localhost:3000/api/products")
.then(response => response.json())
.then(response2 => console.table(response2[5]));

/*
const response = await fetch("http://localhost:3000/api/products");
const tab = await response.json();
*/

/*afficher tous les élément*/
fetch("http://localhost:3000/api/products")
.then(response => response.json())
.then(response2 => {
    for(let i in response2){
        //Récuparation DOM
        const sectionItems = document.querySelector(".items");

        //Création des balise
        const linkElement = document.createElement("a");
        linkElement.href = "./product.html?id="+i;
        //console.log(linkElement);

        const pieceElement = document.createElement("article");

        //Création de balise dans article
        const imageElement = document.createElement("img");
        imageElement.src = response2[i].imageUrl;
        imageElement.alt = response2[i].altTxt;
       

        const titleElement = document.createElement("h3");
        titleElement.innerText = response2[i].name;

        const descritionElement = document.createElement("p");
        descritionElement.innerText = response2[i].description;

        //pieceElement.appendChild(imageElement);
        sectionItems.appendChild(linkElement);
        linkElement.appendChild(pieceElement);
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(titleElement);
        pieceElement.appendChild(descritionElement);
    }
});
