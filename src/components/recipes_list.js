class RecipeList {
  constructor() {
    this.recipes = []
    this.allergies = []
    this.loadedRecipes = []
    this.adapter = new RecipesAdapter()
    this.selectAndAddEventListeners()
  }

  selectAndAddEventListeners(){
    const allergyRecipeForm = document.getElementById('allergy-recipe-form')
    const loader = document.getElementById('recipe-loader')

    allergyRecipeForm.addEventListener('submit', (allergy)=>{
      allergy.preventDefault()
      this.populateAllergens()
      this.callApiAndCreateRecipes()
    })
  }

  populateAllergens(){
    this.allergies = []
    const commonAllergies = document.querySelectorAll('.allergy-checkbox:checked')
    if (commonAllergies.length > 0) {
      commonAllergies.forEach(allergy => {
        let name = allergy.value
        this.allergies = this.allergies.concat(ALLERGEN[name])
      })
    }
    const allergyInput = document.getElementById('allergy-name')
    if (allergyInput.value) {
      allergyInput.value.split(", ").forEach(customAllergy =>{
        if(customAllergy){
          this.allergies.push(customAllergy)
        }
      })
      debugger
    }
  }

  callApiAndCreateRecipes(){
    let recipeInput = document.getElementById('recipe-name')
    let searchTerm = recipeInput.value

    this.adapter.getRecipes().then(data => {
      this.recipes = []
      this.loadedRecipes = []
      data.forEach(recipe =>{
        let allergyToggle = false
        recipe.title = recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)
        recipe.ingredients.some(ingredient => {
          this.allergies.forEach((allergy)=>{
            if(ingredient.toLowerCase().includes(allergy.toLowerCase()) || recipe.title.toLowerCase().includes(allergy.toLowerCase())){
              allergyToggle = true

            }
          })
        })
        if (allergyToggle === false && recipe.title.toLowerCase().includes(searchTerm.toLowerCase())) {

          let safeRecipe = new Recipe(recipe.title, recipe.ingredients, recipe.directions)
          this.recipes.push(safeRecipe)
        }
      })
      let loader = document.getElementById('recipe-loader')
      loader.className = "ui active dimmer"
      window.setTimeout(()=>{
        this.setCards()
        loader.className = "ui disabled dimmer"
      }, 2000)

    })
  }


  setCards(){
    let cardContainer = document.getElementById('card container')
    while(cardContainer.hasChildNodes()) {
      cardContainer.removeChild(cardContainer.childNodes[0])
    }

    let buttonContainer = document.getElementById('button container')
    while(buttonContainer.hasChildNodes()) {
      buttonContainer.removeChild(buttonContainer.childNodes[0])
    }

      if (this.recipes.length >= 8) {
        for (let i = 0; i < 8; i++) {
          this.loadedRecipes.push(this.recipes.pop())
        }
        this.loadRecipes()
      }else if (this.recipes.length === 0 && this.loadedRecipes === 0) {
        cardContainer.innerHTML = "No Recipes Found!"
      }else {
        for (let i = 0; i < this.recipes.length; i++) {
          this.loadedRecipes.push(this.recipes.pop())
        }
        this.loadRecipes()
      }
  }

  loadRecipes(){
    let cardContainer = document.getElementById('card container')
    this.loadedRecipes.map((recipe) => {
      let el = document.createElement('div')
      el.innerHTML = recipe.render()
      cardContainer.appendChild(el)
    })
    if (this.recipes.length > 0) {
        this.addLoadButton()
    }
  }

  addLoadButton(){
    let loadMore = document.createElement('button')
    let buttonContainer = document.getElementById('button container')

    loadMore.className = "ui center aligned red button"
    loadMore.innerHTML = "Load More"
    loadMore.addEventListener('click', ()=>{
      this.setCards()
    })
    buttonContainer.appendChild(loadMore)
  }


}
