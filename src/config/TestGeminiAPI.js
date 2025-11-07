import { GoogleGenerativeAI } from "@google/generative-ai";

// Direct API test with hardcoded key for testing only
const API_KEY = "AIzaSyDzCTHypSa2nX_pe6dNf-WnwnFxsPqYEs4";

// Test function for directly calling the Gemini API without the React context
async function testGeminiAPI() {
  try {
    console.log("Starting API test...");

    const genAI = new GoogleGenerativeAI(API_KEY);
    console.log("API instance created");

    // Trying with both model versions for testing
    const models = ["gemini-pro", "gemini-1.0-pro"];
    let success = false;
    let error = null;

    for (const modelName of models) {
      try {
        console.log(`Trying with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        // Simple prompt for testing
        const prompt =
          "Hello, this is a test message. Please respond with a simple greeting.";
        console.log("Sending test prompt:", prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`Success with model ${modelName}! Response:`, text);
        success = true;
        return {
          success: true,
          model: modelName,
          response: text,
        };
      } catch (e) {
        console.error(`Error with model ${modelName}:`, e);
        error = e;
      }
    }

    if (!success) {
      throw error || new Error("All models failed");
    }
  } catch (error) {
    console.error("API Test Error:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}

export default testGeminiAPI;
