//hold for js code
const recipesUrl = "http://localhost:3000/api/v1/recipes"
const dietsUrl = 'http://localhost:3000/api/v1/diets'
const recipedietsUrl = 'http://localhost:3000/api/v1/recipe_diets'
const cardContainer = document.querySelector(".container")
const select = document.querySelector('#diet-names')
const card = document.querySelectorAll('.card')
const recipeDiv = document.createElement('div')
// const frontCard = document.createElement('div')
// const backCard = document.createElement('div')
// import anime from 'animejs';


document.addEventListener('DOMContentLoaded', () => {
  const fetchRecipes = () => {
    fetch(recipesUrl)
      .then(resp => resp.json())
      .then(populateRecipeCards)
  }


  const populateRecipeCards = (recipes) => {
    cardContainer.innerHTML = ""

    recipes.forEach(recipe => {

      const recipeDiv = document.createElement('div')
      const frontCard = document.createElement('div')
      const backCard = document.createElement('div')

      //create cards for each recipe
      recipeDiv.className = "card"
      recipeDiv.dataset.id = `${recipe.id}`
     
      //const frontCard = document.createElement('div')
      frontCard.className = "front"
      recipeDiv.appendChild(frontCard)

      //const backCard = document.createElement('div')
      backCard.className = "back"
      recipeDiv.appendChild(backCard)

      frontCard.innerHTML = `
      <img src= ${recipe.image_url}>`

      const ingredientSplitFunc = () => {
       // let recIngredients = ""
       let recIngredients = recipe.ingredients
        const stringToArray = recIngredients.split(',')
        const ul = document.createElement('ul')//
        ul.innerHTML = `
        <h3>${recipe.name}</h3>
        <h3>Ingredients</h3>
        `
        stringToArray.forEach(word => {
          const ingredientLi = document.createElement('li')
          ul.appendChild(ingredientLi)
          ul.className = 'ul'
          ingredientLi.className = 'li'
          backCard.appendChild(ul)
          ingredientLi.innerHTML += `
          ${word}
          `
        })
        ul.innerHTML += `
      <h3>Instructions</h3>
      ${recipe.instructions}`
      }

      ingredientSplitFunc()
      cardContainer.appendChild(recipeDiv)
 
      //anime.js
      const card = document.querySelectorAll(".card").forEach(card => {
      let playing = false;
      card.addEventListener('click',function(e) {
          
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
          })
      })
    })
    //end anime
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
      newOption.value = diet.id
      select.appendChild(newOption)
    })
  }

      //add event listener for selections in dropdown menu
      select.addEventListener('change', (e) => {
       let id = e.target.value
       console.log(e.target.value)
        
          fetch(`${dietsUrl}/${id}`)
          .then(resp => resp.json())
          .then(data => {
            populateRecipeCards(data.recipes)
            })
          })
  
        const clickedRecipeDiets = recipeDiets => {
            const recipeDiv = document.querySelector('card')
            const frontCard = document.querySelector('front')
            const backCard = document.querySelector('back')
            const testest = recipeDiets.filter(recipeDiet => recipeDiet.diet.name === e.target.value)
            console.log(testest)
            testest.forEach(test => {
             // if (recipeDiv.innerHTML = ""){
              recipeDiv.innerHTML = 
                `<img src= ${test.recipe.image_url} width="400" height="600">`
              cardContainer.appendChild(frontCard)
            })
        }
        fetchRecipes()
        fetchDiets()
    })
  //})


