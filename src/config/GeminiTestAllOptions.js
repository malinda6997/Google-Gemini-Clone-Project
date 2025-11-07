// Enhanced Gemini API test with multiple models and configurations
import { GoogleGenerativeAI } from "@google/generative-ai";

// The API key to test
const API_KEY = "AIzaSyBwJ4iYw2Vdu3v42W71PvCIw1IieTQe2KQ";

async function testAllConfigurations() {
  console.log("Starting comprehensive Gemini API tests...");
  console.log("API Key Length:", API_KEY.length);
  console.log(
    "API Key Format:",
    /^AIza[0-9A-Za-z\-_]{35}$/.test(API_KEY) ? "Valid format" : "Invalid format"
  );

  // Initialize client
  try {
    console.log("\nInitializing Gemini client...");
    const genAI = new GoogleGenerativeAI(API_KEY);
    console.log("✓ Client initialized successfully");

    // Test multiple models
    const modelVariants = [
      "gemini-pro",
      "gemini-1.0-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
    ];

    // Test different prompt styles
    const prompts = [
      "Hello, can you give me a simple greeting?",
      "What is 2+2?",
      "Tell me about artificial intelligence.",
    ];

    // Test different generation settings
    const configOptions = [
      { temperature: 0.7, maxOutputTokens: 1024 },
      { temperature: 0, maxOutputTokens: 256 },
    ];

    // Try all combinations
    for (const modelName of modelVariants) {
      console.log(`\n\n==== Testing model: ${modelName} ====`);

      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        console.log(`✓ Model "${modelName}" initialized`);

        for (const prompt of prompts) {
          for (const config of configOptions) {
            console.log(
              `\n> Testing prompt: "${prompt.substring(
                0,
                20
              )}..." with config:`,
              config
            );

            try {
              const result = await model.generateContent(prompt, config);
              const text = await result.response.text();
              console.log(
                "✓ SUCCESS! Response:",
                text.substring(0, 50) + "..."
              );

              // If we get here, we found a working configuration
              return {
                success: true,
                workingModel: modelName,
                workingConfig: config,
                sampleResponse: text.substring(0, 100),
              };
            } catch (error) {
              console.error(
                `✗ Error with ${modelName} and prompt "${prompt.substring(
                  0,
                  20
                )}...":`,
                error.message
              );
            }
          }
        }
      } catch (modelError) {
        console.error(
          `✗ Failed to initialize model "${modelName}":`,
          modelError.message
        );
      }
    }

    // If we get here, all combinations failed
    console.error("\n\n❌ All API configurations failed");
    return {
      success: false,
      message:
        "All API configurations failed. The API key may be invalid or you may not have access to any of the tested models.",
    };
  } catch (clientError) {
    console.error("❌ Failed to initialize Gemini client:", clientError);
    return {
      success: false,
      message: "Failed to initialize API client: " + clientError.message,
    };
  }
}

// Run the test
testAllConfigurations().then((result) => {
  console.log("\n\n==== FINAL RESULT ====");
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log(
      `\n✅ WORKING CONFIGURATION FOUND: Use model "${result.workingModel}" with the displayed configuration.`
    );
  } else {
    console.log(
      "\n❌ NO WORKING CONFIGURATION FOUND. Please check your API key and account permissions."
    );
  }
});

export default testAllConfigurations;
