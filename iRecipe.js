class iRecipe {
  static API_ID = '12f29b73';
  static API_KEY = 'fd2e4bfe519b5dc1eeb1ae301cbfae68';
  static API_URL = 'https://api.edamam.com/search';

  static main(args) {
    try {
      let ingredients = this.getUserInput();
      let encodedIngredients = encodeURIComponent(ingredients);
      let urlStr = `${this.API_URL}?q=${encodedIngredients}&app_id=${this.API_ID}&app_key=${this.API_KEY}`;
      let url = new URL(urlStr);
      let connection = url.openConnection();
      connection.setRequestMethod('GET');
      let responseCode = connection.getResponseCode();
      if (responseCode === 200) {
        let reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        let line = null;
        let response = '';
        while ((line = reader.readLine()) !== null) {
          response += line;
        }
        reader.close();
        console.log(response);
      } else {
        console.log('Error: ' + responseCode);
      }
      connection.disconnect();
    } catch (e) {
      console.error(e);
    }
  }

  static getUserInput() {
    console.log('Enter the ingredients you have (separated by commas):');
    let input = prompt('Enter the ingredients you have (separated by commas):');
    return input;
  }
}

let groceryList = [];

function saveGroceryList() {
  localStorage.setItem('groceryList', JSON.stringify(groceryList));
}

function loadGroceryList() {
  let storedGroceryList = localStorage.getItem('groceryList');
  if (storedGroceryList) {
    groceryList = JSON.parse(storedGroceryList);
    updateGroceryList();
  }
}

// Add the following code at the end of the script section:
window.addEventListener('load', loadGroceryList);
window.addEventListener('beforeunload', saveGroceryList);

function addToGroceryList() {
  let ingredientInput = document.getElementById("ingredientInput").value;
  let quantityInput = document.getElementById("quantityInput").value;

  let groceryItem = {
    ingredient: ingredientInput,
    quantity: quantityInput
  };

  groceryList.push(groceryItem);

  updateGroceryList();
  saveGroceryList();
  clearInputs();
}

function updateGroceryList() {
  let groceryListElement = document.getElementById("groceryList");
  groceryListElement.innerHTML = "";

  groceryList.forEach((groceryItem, index) => {
    let groceryListItem = document.createElement("li");
    groceryListItem.className = "grocery-list-item";

    let itemText = document.createElement("span");
    itemText.textContent = groceryItem.ingredient;

    let quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = groceryItem.quantity;
    quantityInput.oninput = function (event) {
      let updatedQuantity = event.target.value;
      groceryList[index].quantity = updatedQuantity;
      saveGroceryList();
    };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
      groceryList.splice(index, 1);
      updateGroceryList();
      saveGroceryList();
    };

    groceryListItem.appendChild(itemText);
    groceryListItem.appendChild(quantityInput);
    groceryListItem.appendChild(deleteButton);

    groceryListElement.appendChild(groceryListItem);
  });
}

function clearInputs() {
  document.getElementById("ingredientInput").value = "";
  document.getElementById("quantityInput").value = "";
}
