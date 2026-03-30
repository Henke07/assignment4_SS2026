/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
       Called on page load to start all the requests:
       - Fetch random meal
       - Display meal
       - Map meal category to spirit
       - Fetch matching (or random) cocktail
       - Display cocktail
*/
function init() {
  fetchRandomMeal()
    .then((meal) => {
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchCocktailByDrinkIngredient(spirit);
    })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */
function fetchRandomMeal() {
      return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(res => res.json())       
        .then(data => {
          const meal=data.meals[0]
          console.log(meal)
          return meal
          })
        }
/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/
function displayMealData(meal) {
  const mealName=document.createElement("h2")
          mealName.textContent=meal.strMeal
          document.getElementById("meal-container").appendChild(mealName)

          const mealThumb=document.createElement("img")
          mealThumb.src=meal.strMealThumb //henter fra console
          document.getElementById("meal-container").appendChild(mealThumb)

          const mealInstructions=document.createElement("p")
          mealInstructions.textContent=meal.strInstructions
          document.getElementById("meal-container").appendChild(mealInstructions)

          const mealList=document.createElement("div")
          mealList.style.display="flex"
          mealList.style.gap = "2rem"
          

      //sorterer measures
        const measuresList = document.createElement("ul")

        const underoverskrift2=document.createElement("h3")
        underoverskrift2.textContent="Measures"
        measuresList.appendChild(underoverskrift2)

        for( let nummer=1; nummer <=20; nummer++){
          const measure =meal["strMeasure"+nummer]

          if (measure && measure.trim() !==""){
            const li = document.createElement("li")
            li.textContent=measure
            measuresList.appendChild(li)
      }  }

        mealList.appendChild(measuresList)

                            //sorterer ingredienser 
        const ingredientList = document.createElement("ul")

        const underoverskrift=document.createElement("h3")
        underoverskrift.textContent="Ingredients"
        ingredientList.appendChild(underoverskrift)

        for (let nummer = 1; nummer <=20; nummer++) {
          const ingredient= meal["strIngredient"+nummer]

          if(ingredient && ingredient.trim() !=="") {
            const li= document.createElement("li")
            li.textContent=ingredient
            ingredientList.appendChild(li)
          }
        }
        mealList.appendChild(ingredientList)

        document.getElementById("meal-container").appendChild(mealList)
}


/*
Convert MealDB Category to a TheCocktailDB Spirit
Looks up category in our map, or defaults to 'cola'
*/
function mapMealCategoryToDrinkIngredient(category) {
  if (!category) return "cola";
  console.log(mealCategoryToCocktailIngredient[category])
  return mealCategoryToCocktailIngredient[category] || "cola";
}

/*
Fetch a Cocktail Using a Spirit from TheCocktailDB
Returns Promise that resolves to cocktail object
We call https://www.thecocktaildb.com/api/json/v1/1/search.php?s=DRINK_INGREDIENT to get a list of cocktails
Don't forget encodeURIComponent()
If no cocktails found, fetch random
*/
function fetchCocktailByDrinkIngredient(drinkIngredient) {
  return fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + encodeURIComponent(drinkIngredient))
    .then(res => res.json())
    .then(data => {
      if (!data.drinks){
        return fetchRandomCocktail()
      }
      const cocktail=data.drinks[0]
      console.log(cocktail)
      return cocktail
    })
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
function fetchRandomCocktail() {
        return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        .then (response => response.json()) //svarer til fetchen om at ja her er posten
        .then (data => {
            const drink=data.drinks[0] // lettere å skrive bare drink
            return drink
        })}

    // Fill in


/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
    const drinkName = document.createElement("h2");
    drinkName.textContent = cocktail.strDrink;
    document.getElementById("cocktail-container").appendChild(drinkName); 

    const drinkThumb = document.createElement("img");
    drinkThumb.src = cocktail.strDrinkThumb; /*henter fra console*/
    document.getElementById("cocktail-container").appendChild(drinkThumb); /*koble til html*/

    const ingredientsList = document.createElement("ul");

    const underoverskrift=document.createElement("h3")
    underoverskrift.textContent="Ingredients"
    ingredientsList.appendChild(underoverskrift)

    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== "") {
            const li = document.createElement("li");
            li.textContent = `${ingredient}`;
            ingredientsList.appendChild(li);
        }
    }
    document.getElementById("cocktail-container").appendChild(ingredientsList);
}



/*
Call init() when the page loads
*/
window.onload = init;
