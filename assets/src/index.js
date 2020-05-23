//hold for js code
const _BASEURL = "http://localhost:3000/api/v1/recipes"
const cardContainer = document.querySelector(".container")
import anime from 'animejs';



document.addEventListener('DOMContentLoaded', () => {
const fetchRecipes = () => {
        fetch(_BASEURL)
        .then(resp => resp.json())
        .then(populateRecipeCards)
    }
   
    //fetchRecipes()

const populateRecipeCards = (recipes) => {
recipes.forEach(recipe =>{
    
    //create cards for food pics
    const recipeDiv = document.createElement('div')
    recipeDiv.className = "card"
    cardContainer.appendChild(recipeDiv)
    const frontCard = document.createElement('div')
    frontCard.className = "front"
    recipeDiv.appendChild(frontCard)
    const backCard = document.createElement('div')
    backCard.className = "back"
    recipeDiv.appendChild(backCard)
    frontCard.innerHTML = `
    <img src= ${recipe.image_url}>`
    backCard.innerHTML = `
    ${recipe.ingredients}
    `


    //card anime js
    const card = document.querySelector(".card");
    let playing = false;

    card.addEventListener('click',function() {
    if(playing)
    return;
  
  playing = true;
  anime({
    targets: card,
    scale: [{value: 1}, {value: 1.4}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
       playing = false;
    }
  });
});
///end card anime js

})

}

//

// end of card js

    

fetchRecipes()

 })