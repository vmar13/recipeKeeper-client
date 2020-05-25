//hold for js code
const recipesUrl = "http://localhost:3000/api/v1/recipes"
const dietsUrl = 'http://localhost:3000/api/v1/diets'
const recipedietsUrl = 'http://localhost:3000/api/v1/recipe_diets'
const cardContainer = document.querySelector(".container")
const select = document.querySelector('#diet-names')
const recipeDiv = document.createElement('div')
// import anime from 'animejs';


document.addEventListener('DOMContentLoaded', () => {
  const fetchRecipes = () => {
      fetch(recipesUrl)
        .then(resp => resp.json())
        .then(populateRecipeCards)
  }

const populateRecipeCards = recipes => {
  recipes.forEach(recipe => {
    
    //create cards for each recipe
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
    // const card = document.querySelector(".card");
    // let playing = false;

    // card.addEventListener('click',function() {
    //   if(playing)
    //   return;
  
    //     playing = true;
    //     anime({
    //       targets: card,
    //       scale: [{value: 1}, {value: 1.4}, {value: 1, delay: 250}],
    //       rotateY: {value: '+=180', delay: 200},
    //       easing: 'easeInOutSine',
    //       duration: 400,
    //       complete: function(anim){
    //         playing = false;
    //       }
    //     });
    // });
    ///end card anime js

  })  
}
 
//create select option for each diet
const fetchDiets = () => {
  fetch(dietsUrl)
    .then(resp => resp.json())
    .then(renderDietsDropdown)
}

const renderDietsDropdown = diets => {
  
  diets.forEach(diet => {
    const newOption = document.createElement('option')
    newOption.textContent = diet.name
    select.add(newOption)

    //add event listener for selections in dropdown menu
    select.addEventListener('change', (e) => {
      const fetchRecipeDiets = () => {
        fetch(recipedietsUrl)
          .then(resp => resp.json())
          .then(clickedRecipeDiets)
      }
      const clickedRecipeDiets = recipeDiets => {
        if (e.target.value === diet.name) {
          recipeDiets.forEach(recipeDiet => {
            console.log(recipeDiet.diet.filter)
          })
          
        //   recipeDiets.forEach(recipeDiet => {
        //   })
          //show recipes with target diet
        // console.log(recipeDiets.e.target.value)


        // recipeDiv.innerHTML = `${diet.name}`


      }
      }
      fetchRecipeDiets()
    })
  })
}



fetchRecipes()
fetchDiets()
})