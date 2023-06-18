import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class iRecipe {
    private static final String API_ID = "12f29b73";
    private static final String API_KEY = "fd2e4bfe519b5dc1eeb1ae301cbfae68";
    private static final String API_URL = "https://api.edamam.com/search";

    public static void main(String[] args) {
        try {
            String ingredients = getUserInput();
            String encodedIngredients = URLEncoder.encode(ingredients, "UTF-8");
            String urlStr = API_URL + "?q=" + encodedIngredients + "&app_id=" + API_ID + "&app_key=" + API_KEY;

            URL url = new URL(urlStr);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String line;
                StringBuilder response = new StringBuilder();

                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                // Process the response JSON here
                System.out.println(response.toString());
            } else {
                System.out.println("Error: " + responseCode);
            }
            connection.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String getUserInput() throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

        System.out.println("Enter the ingredients you have (separated by commas):");
        String input = reader.readLine();

        // You can add validation or additional logic here if needed

        return input;
    }
}
