class iRecipe {}
iRecipe.API_ID = '12f29b73';
iRecipe.API_KEY = 'fd2e4bfe519b5dc1eeb1ae301cbfae68';
iRecipe.API_URL = 'https://api.edamam.com/search';
iRecipe.main = (args) => {
  try {
    let ingredients = this.getUserInput();
    let encodedIngredients = URLEncoder.encode(ingredients, 'UTF-8');
    let urlStr = this.API_URL + '?q=' + encodedIngredients + '&app_id=' + this.API_ID + '&app_key=' + this.API_KEY;
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
      System.out.println(response.toString());
    } else {
      System.out.println('Error: ' + responseCode);
    }
    connection.disconnect();
  } catch (e) {
    e.printStackTrace();
  }
};
iRecipe.getUserInput = () => {
  let reader = new BufferedReader(new InputStreamReader(System.in));
  System.out.println('Enter the ingredients you have (separated by commas):');
  let input = reader.readLine();
  return input;
};