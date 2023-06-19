var groceryList = [];
var allRecipes = [];

function addToGroceryList() {
    var ingredientInput = document.getElementById("ingredientInput").value;
    var quantityInput = document.getElementById("quantityInput").value;

    var groceryItem = {
        ingredient: ingredientInput,
        quantity: quantityInput
    };

    groceryList.push(groceryItem);

    updateGroceryList();
    saveGroceryList();
    clearInputs();
}

function updateGroceryList() {
    var groceryListElement = document.getElementById("groceryList");
    groceryListElement.innerHTML = "";

    for (var i = 0; i < groceryList.length; i++) {
        var groceryItem = groceryList[i];
        var groceryListItem = document.createElement("li");
        groceryListItem.className = "grocery-list-item";

        var itemText = document.createElement("span");
        itemText.textContent = groceryItem.ingredient;

        var quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = groceryItem.quantity;
        quantityInput.oninput = function (event) {
            var updatedQuantity = event.target.value;
            var index = Array.from(groceryListItem.parentNode.children).indexOf(groceryListItem);
            groceryList[index].quantity = updatedQuantity;
            saveGroceryList();
        };

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            var index = Array.from(groceryListItem.parentNode.children).indexOf(groceryListItem);
            groceryList.splice(index, 1);
            updateGroceryList();
            saveGroceryList();
        };

        groceryListItem.appendChild(itemText);
        groceryListItem.appendChild(quantityInput);
        groceryListItem.appendChild(deleteButton);

        groceryListElement.appendChild(groceryListItem);
    }
}

function clearInputs() {
    document.getElementById("ingredientInput").value = "";
    document.getElementById("quantityInput").value = "";
}

function findRecipes() {
    var ingredients = [];
    for (var i = 0; i < groceryList.length; i++) {
        ingredients.push(groceryList[i].ingredient);
    }
    var encodedIngredients = encodeURIComponent(ingredients.join(","));

    // Make the API request with the encodedIngredients using Ajax or Fetch API
    // Replace the following example code with your actual API request implementation
    var apiUrl = "https://api.edamam.com/search?q=" + encodedIngredients + "&app_id=12f29b73&app_key=fd2e4bfe519b5dc1eeb1ae301cbfae68";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            allRecipes = data.hits;
            displayRecipes(allRecipes);
        })
        .catch(error => console.error(error));
}

function displayRecipes(recipes) {
    var recipeListElement = document.getElementById("recipeList");
    recipeListElement.innerHTML = "";

    for (var i = 0; i < recipes.length; i++) {
        var recipe = recipes[i].recipe;
        var recipeListItem = document.createElement("li");
        recipeListItem.className = "recipe-list-item";

        var recipeImage = document.createElement("img");
        recipeImage.src = recipe.image;

        var recipeLink = document.createElement("a");
        recipeLink.href = recipe.url;
        recipeLink.textContent = recipe.label;
        recipeLink.target = "_blank"; // Open the link in a new tab

        recipeListItem.appendChild(recipeImage);
        recipeListItem.appendChild(recipeLink);

        recipeListElement.appendChild(recipeListItem);
    }
}

function applyFilters() {
    var cuisineFilter = document.getElementById("cuisineFilter").value;
    var timeFilter = document.getElementById("timeFilter").value;
    var nutritionFilter = document.getElementById("nutritionFilter").value;

    var filteredRecipes = allRecipes.filter(function (recipe) {
        if (cuisineFilter && recipe.recipe.cuisineType !== cuisineFilter) {
            return false;
        }

        if (timeFilter) {
            var totalTime = recipe.recipe.totalTime;
            if (!totalTime) {
                return false;
            }

            var timeRange = timeFilter.split("-");
            var minTime = parseInt(timeRange[0]);
            var maxTime = parseInt(timeRange[1]);

            if (totalTime < minTime || totalTime > maxTime) {
                return false;
            }
        }

        if (nutritionFilter && !recipe.recipe.dietLabels.includes(nutritionFilter)) {
            return false;
        }

        return true;
    });

    displayRecipes(filteredRecipes);
}

function saveGroceryList() {
    localStorage.setItem("groceryList", JSON.stringify(groceryList));
}

function loadGroceryList() {
    var savedGroceryList = localStorage.getItem("groceryList");
    if (savedGroceryList) {
        groceryList = JSON.parse(savedGroceryList);
        updateGroceryList();
    }
}

loadGroceryList();
