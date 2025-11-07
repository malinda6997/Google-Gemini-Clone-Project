import { createContext, useState } from "react";
import run from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultsData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResults(false);
  };

  const onSent = async (prompt) => {
    try {
      setResultsData("");
      setLoading(true);
      setShowResults(true);
      console.log("Context: Preparing to send prompt to Gemini API");

      let response;
      const actualPrompt = prompt !== undefined ? prompt : input;

      if (prompt !== undefined) {
        setRecentPrompt(prompt);
      } else {
        setPrevPrompts((prev) => [...prev, input]);
        setRecentPrompt(input);
      }

      console.log(
        `Context: Sending prompt to API: "${actualPrompt.substring(0, 30)}..."`
      );
      response = await run(actualPrompt);

      // Check if we got an error response
      if (
        response &&
        response.includes("Sorry, I couldn't process your request")
      ) {
        console.error("Received error response from API:", response);
        // Still show the error message to the user
      } else {
        console.log("Context: Received successful response from API");
      }

      // Format the response with markdown-style formatting
      let responseArray = response.split("**");
      let newResponce = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponce += responseArray[i];
        } else {
          newResponce += "<b>" + responseArray[i] + "</b>";
        }
      }

      let newResponce2 = newResponce.split("*").join("</br>");
      let newResponceArray = newResponce2.split(" ");

      console.log(
        "Context: Formatting completed, starting word-by-word display"
      );
      for (let i = 0; i < newResponceArray.length; i++) {
        const nextWord = newResponceArray[i];
        delayPara(i, nextWord + " ");
      }
    } catch (error) {
      console.error("Error in onSent function:", error);
      // Display error to the user
      setResultsData(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResults,
    loading,
    resultsData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
}; // Closing brace for ContextProvider function

export default ContextProvider;
