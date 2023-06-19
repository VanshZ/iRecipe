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
      if (responseCode === HttpURLConnection.HTTP_OK) {
        let reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        let line = null;
        let response = new StringBuilder();
        while ((line = reader.readLine()) !== null) {
          response.append(line);
        }
        reader.close();
        console.log(response.toString());
      } else {
        console.log('Error: ' + responseCode);
      }
      connection.disconnect();
    } catch (e) {
      e.printStackTrace();
    }
  }

  static getUserInput() {
    console.log('Enter the ingredients you have (separated by commas):');
    let input = prompt('Enter the ingredients you have (separated by commas):');
    return input;
  }
}

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
