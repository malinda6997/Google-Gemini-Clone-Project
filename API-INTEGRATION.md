# Gemini Clone Project - API Integration Documentation

## Project Overview

This document outlines the implementation of the Google Gemini API in the Gemini Clone project. The application is a React-based web interface that allows users to interact with Google's Gemini AI model.

## Recent Changes

1. **API Integration Method**:

   - Updated from using the GoogleGenerativeAI library to direct fetch API calls
   - Implemented the exact format from the Google AI Studio curl example
   - Set model to "gemini-2.0-flash" as per the latest API specifications

2. **Error Handling**:

   - Enhanced error handling for rate limiting issues
   - Added detailed error messages for troubleshooting
   - Improved console logging for debugging

3. **API Configuration**:
   - Updated API endpoint to: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
   - Set appropriate generation config (temperature: 0.7, maxOutputTokens: 1024)
   - Properly formatted request body to match Google's API requirements

## API Usage Notes

### Request Format

```javascript
const requestBody = {
  contents: [
    {
      parts: [
        {
          text: "Your prompt here",
        },
      ],
    },
  ],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1024,
  },
};

// API call
const response = await fetch(API_ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-goog-api-key": apiKey,
  },
  body: JSON.stringify(requestBody),
});
```

### Response Format

The API returns a JSON response with the following structure:

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "The AI-generated response text"
          }
        ]
      }
    }
  ]
}
```

## Known Issues

1. **API Rate Limiting**:

   - The free Google Gemini API has strict rate limits
   - Users may encounter "429 Too Many Requests" errors when the limit is exceeded
   - **Solution Implemented**: Automatic retry with exponential backoff (waits longer between each retry)
   - If retries fail, user is advised to wait a minute before trying again or upgrade to a paid API tier

2. **API Key Management**:
   - Currently, the API key is hardcoded in the Gemini.js file
   - In a production environment, this should be moved to environment variables
   - Consider implementing server-side proxy to protect the API key

## Test Scripts

A test script (`test-gemini-api.mjs`) has been included to verify API functionality independently of the React application. Run it with:

```bash
node test-gemini-api.mjs
```

## Future Improvements

1. Move API key to environment variables
2. ✅ Implement exponential backoff for rate limiting (COMPLETED)
3. ✅ Add more robust error handling (COMPLETED)
4. Enhance response parsing for different content types
5. Add streaming response capability for better UX
6. Implement a server-side proxy to avoid exposing API key on client side

## Resources

- [Google Generative AI Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest/v1beta/models/generateContent)
- [API Key Management Best Practices](https://cloud.google.com/docs/authentication/api-keys)
