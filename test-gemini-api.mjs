// Test script for Gemini API using ES modules
// Run with Node.js: node test-gemini-api.mjs

const apiKey = "AIzaSyBwJ4iYw2Vdu3v42W71PvCIw1IieTQe2KQ";
const API_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const prompt = "Hello, tell me about yourself in one paragraph.";

console.log("Starting Gemini API test...");
console.log(`API Endpoint: ${API_ENDPOINT}`);
console.log(`API Key (first 10 chars): ${apiKey.substring(0, 10)}...`);
console.log(`Test prompt: ${prompt}`);

// Test function using fetch to match the curl example
async function testGeminiAPI() {
  try {
    // Prepare the request body exactly as shown in the curl example
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    console.log("\nRequest Body:");
    console.log(JSON.stringify(requestBody, null, 2));

    // Make the API call using fetch
    console.log("\nSending request to API...");
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Response status: ${response.status}`);

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }

    // Parse the response
    const data = await response.json();
    console.log("\nAPI Response Data Structure:");
    console.log(JSON.stringify(data, null, 2));

    // Extract the text from the response based on the structure
    if (
      data &&
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      const responseText = data.candidates[0].content.parts[0].text || "";
      console.log("\nResponse Text:");
      console.log(responseText);
      return responseText;
    } else {
      console.warn("Unexpected response structure:", data);
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("\nError testing Gemini API:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
    });
    return `Error: ${error.message}`;
  }
}

// Execute the test function
testGeminiAPI()
  .then((result) => {
    console.log("\nTest completed successfully!");
  })
  .catch((error) => {
    console.error("\nTest failed:", error);
  });
