document.addEventListener('DOMContentLoaded', () => {
  
  const recipesUrl = 'http://localhost:3000/api/v1/recipes'
  const dietsUrl = 'http://localhost:3000/api/v1/diets'
  const recipedietsUrl = 'http://localhost:3000/api/v1/recipe_diets'
  const cardContainer = document.querySelector('.container')
  const select = document.querySelector('#diet-names')
  const recipeDivSelected = document.querySelector('.card')
  const modal = document.querySelector('#modal')
  const recipeModal = document.querySelector('#recipe-modal')
  const closeButton = document.querySelector('#close-button')
  const recipeCloseBtn = document.querySelector('#recipe-close-button')
  const openButton = document.querySelector('#open-button')
  const form = document.querySelector('#recipe-form')
  const recipeModGuts = document.querySelector('.recipe-modal-guts')
  let dietBtnCounter = 0;

  const fetchRecipes = () => {
    fetch(recipesUrl)
      .then(resp => resp.json())
      .then(populateRecipeCards)
  }

  // console.log(dietBtnCounter)
  const populateRecipeCards = (recipes) => {
    cardContainer.innerHTML = ''

    recipes.forEach(recipe => {

      const recipeDiv = document.createElement('div')
      const frontCard = document.createElement('div')
      const backCard = document.createElement('div')

      //create cards for each recipe
      recipeDiv.className = 'card'
      recipeDiv.dataset.id = `${recipe.id}`
     
      //create front of card
      frontCard.className = 'front'
      frontCard.innerHTML = `<img src= ${recipe.image_url}>`
      recipeDiv.appendChild(frontCard)

      //create back of card
      backCard.className = 'back'
      recipeDiv.appendChild(backCard)

      //break up string of ingredients into individual bullet points on back of card
      const ingredientSplitFunc = () => {
       let recIngredients = recipe.ingredients
        const stringToArrIngs = recIngredients.split(',')
        const ul = document.createElement('ul')
        ul.innerHTML = `
        <h3 class='recipe-name-backCard'>${recipe.name}</h3>
        <h4 class='ingred-title-backCard'>Ingredients</h4>
        `
        stringToArrIngs.forEach(singleIng => {
          const ingredientLi = document.createElement('li')
          ul.appendChild(ingredientLi)
          ul.className = 'ul'
          ingredientLi.className = 'li-backCard'
          backCard.appendChild(ul)
          ingredientLi.innerHTML += `
          ${singleIng}
          `
        })

        ul.innerHTML += `
        <h4 class='instruct-title-backCard'>Instructions</h4>
        <p class='instructions-backCard'>${recipe.instructions}</p>
        <button class='delete'>Delete</button>
        <button class='view'>Full View</button>`
      }

      ingredientSplitFunc()
      cardContainer.appendChild(recipeDiv)
      cardFlip()
      
      const createRecipeDiet = (recipeId) => {
        recipeId = recipeDiv.dataset.id
        if (recipe.done_tagging === false) {
          // fetch all diets and for each one create buttons with diet id
          fetch(dietsUrl)
            .then(resp => resp.json())
            .then(renderDietButtons)
        }
      }
        
      const renderDietButtons = diets => {
        const dietBtnsAndRecCont = document.createElement('div')
        dietBtnsAndRecCont.className = 'dietBtns-and-recipe-container'
        const dietBtnsCont = document.createElement('div')
        dietBtnsCont.className = 'diet-btns-container'
        const doneTaggingBtn = document.createElement('button')
        doneTaggingBtn.className = 'diet-done-tagging-btn'
        doneTaggingBtn.textContent = 'Done Tagging'

        diets.forEach(diet => {
          const dietBtn = document.createElement('button')
          dietBtn.textContent = diet.name
          dietBtn.value = diet.id
          dietBtn.className = 'diet-btn' 

          cardContainer.append(dietBtnsAndRecCont)
          dietBtnsAndRecCont.append(recipeDiv, dietBtnsCont)
            recipeDiv.insertAdjacentElement('afterend', dietBtnsCont)

            dietBtnsCont.appendChild(dietBtn)
            dietBtnsCont.appendChild(doneTaggingBtn)
            
            //Clicking on any of the diet btns (Gluten-Free, Dairy-Free, etc.)
            //will create a row on the recipe-diet join table in the DB
            dietBtn.addEventListener('click', e => {
              fetch(recipedietsUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  recipe_id: recipeDiv.dataset.id,
                  diet_id: e.target.value
                })
              })
              .then(resp => {
                // console.log(resp.ok)
                if (resp.ok) { //if resp.ok evaluates to true (meaning fetch was successful), increment dietBtnCounter
                  dietBtnCounter++
                  // console.log(dietBtnCounter)
                }
              })
            })
        }) 
        
        //May need to create helper function that listens for 
        //at least 1 click on a dietBtn, and if it doesn't record
        // >= 1 click, it triggers an error on doneTagging click
        //that says "Please select at least one diet"

        doneTaggingBtn.addEventListener('click', e => {
          dietBtnsCont.style.display = 'none'
          doneTaggingBtn.style.display = 'none'
          if (dietBtnCounter >= 1) {
            //PATCH request to update done_tagging to true
            recipeId = recipeDiv.dataset.id
            fetch(`${recipesUrl}/${recipeId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                done_tagging: true
              })
            })
          } else {
            let errorMsg = document.createElement('p')
            errorMsg.textContent = 'Please select at least one diet.'
            doneTaggingBtn.insertAdjacentElement('afterend', errorMsg)
          }
          dietBtnCounter = 0;
        })
      }

      createRecipeDiet()
    })
  }


  const cardFlip = () => {
    const cards = document.querySelectorAll('.card').forEach(card => {

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
  }

  //fetch all diets and create select option for each one
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

  select.addEventListener('change', (e) => {
    if(e.target.value === ''){
      return (
        fetchRecipes()
      )
    } else {
      let id = e.target.value
      fetch(`${dietsUrl}/${id}`)
      .then(resp => resp.json())
      .then(dietData => {
        populateRecipeCards(dietData.recipes)
      })
    }  
  })
    
  openButton.addEventListener('click', (e) => {
    modal.classList.toggle('closed');
  })

  closeButton.addEventListener('click', (e) => {
    modal.classList.toggle('closed');
  })

  //create a recipe
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    let recipeName = form.name.value
    let recipeIng = form.ingredients.value
    let recipeInstuct = form.instructions.value
    let recipeImage = form.image_url.value
    let doneTagging = form.done_tagging.value

    fetch(recipesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: recipeName,
        ingredients: recipeIng,
        instructions: recipeInstuct,
        image_url: recipeImage,
        done_tagging: doneTagging 
      })
    })
    .then(resp => resp.json())
    .then(fetchRecipes)

    form.name.value = ''
    form.ingredients.value = ''
    form.instructions.value = ''
    form.image_url.value = ''

    modal.classList.toggle('closed');
  })

    document.addEventListener('click', (e) => {
      if (e.target.className === 'delete') {
        const cardID = e.target.parentNode.parentNode.parentNode.dataset.id
        fetch(`${recipesUrl}/${cardID}`, {
          method: 'DELETE',
        })
          .then(resp => {
            e.target.parentNode.parentNode.parentNode.remove()
          })
      }
    })

    document.addEventListener('click', (e) => {
      if (e.target.className === 'view') {
        // console.log(e.target.parentNode.children)
        const recipeTitle = e.target.parentNode.children[0]
        const ingTitle = e.target.parentNode.children[1]
        const ul = document.createElement('ul')
        const ingredientsHTMLcoll = e.target.parentNode.getElementsByTagName('li')
        const ingArr = Array.from(ingredientsHTMLcoll)
        ingArr.forEach(ing => {
          const ingLi = document.createElement('li')
          ul.appendChild(ingLi)
          ingLi.innerHTML += `${ing.textContent}`
        })

        const instructTitle = document.createElement('h4')
        instructTitle.textContent = 'Instructions'
        const instructions = document.createElement('p')
        instructions.textContent = e.target.previousElementSibling.previousElementSibling.textContent

        recipeModal.classList.toggle('closed')
        recipeModGuts.appendChild(recipeTitle)
        recipeModGuts.appendChild(ingTitle)
        recipeModGuts.appendChild(ul)
        recipeModGuts.appendChild(instructTitle)
        recipeModGuts.append(instructions)
      }
    })

    recipeCloseBtn.addEventListener('click', () => {
      //Clear all elements within recipeModGuts, so "Full View" doesn't duplicate every recipe view
      recipeModGuts.querySelectorAll('*').forEach(node => node.remove())
      recipeModal.classList.toggle('closed');
    })
  

  fetchRecipes()
  fetchDiets()

})

