// test-gemini-api.js
// Use this script to test the Gemini API directly from the command line
// Run with: node test-gemini-api.js
// Note: You may need to add "type": "module" to package.json or rename this to .mjs

import { GoogleGenerativeAI } from "@google/generative-ai";

// API key to test
const API_KEY = "AIzaSyBwJ4iYw2Vdu3v42W71PvCIw1IieTQe2KQ";

async function testGeminiAPI() {
  console.log("Testing Gemini API with key:", API_KEY.substring(0, 8) + "...");

  try {
    // Initialize the API
    const genAI = new GoogleGenerativeAI(API_KEY);
    console.log("API client initialized successfully");

    // Try multiple model versions
    const modelNames = ["gemini-pro", "gemini-1.0-pro"];

    for (const modelName of modelNames) {
      console.log(`\nTesting model: ${modelName}`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        // Test simple prompt
        const prompt =
          'Hello, this is a test. Please respond with "API is working correctly."';
        console.log("Sending test prompt...");

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log(`SUCCESS with model ${modelName}!`);
        console.log("Response:", text);
        console.log("\n-----------------------------------");
      } catch (e) {
        console.error(`ERROR with model ${modelName}:`, e.message);
      }
    }
  } catch (error) {
    console.error("Error initializing API:", error.message);
    console.error("Full error:", error);
  }
}

// Run the test
testGeminiAPI()
  .then(() => {
    console.log("Test completed");
  })
  .catch((error) => {
    console.error("Test failed with error:", error);
  });
