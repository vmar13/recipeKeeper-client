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

  const cleanIng = () => {
    const newIng = recipes.ingredients.split(', ')
    return newIng
  }

  const populateRecipeCards = (recipes) => {
    cardContainer.innerHTML = ""
 
    //change recipes to new variable named above
    recipes.forEach(recipe => {

      const recipeDiv = document.createElement('div')
      const frontCard = document.createElement('div')
      const backCard = document.createElement('div')
      const delDiv = document.createElement("div")

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

      backCard.innerHTML = `
      ${recipe.ingredients}
      <button class="delete">&times;</button >
      `
      delDiv.innerHTML = 

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
          });
      });
    });
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
          // }
          //const switchOnDiet = (e) => {
          //switch (e.target.value) {
          //case 'vegetarian':
           // console.log('veg
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
        document.addEventListener('click', (e) => {
          if (e.target.className === "delete") {
            console.log(e.target.className)
            const cardID = e.target.parentNode.parentNode.dataset.id
            fetch(`${recipesUrl}/${cardID}`, {
              method: 'DELETE',
              // headers: {
              //   'Content-Type': 'application/json',
              //   'Accept': 'application/json'
              // }
            })
              .then(resp => {
                e.target.parentNode.parentNode.remove()
              })
          }
        })


        fetchRecipes()
        fetchDiets()
    })
  //})


