import { createContext, useState } from "react";
import run from "../config/Gemini"; 

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState('');
  const [recentPrompt, setRecentPrompt] = useState('');
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function(){
        setResultsData(prev => prev + nextWord);
    },75*index)
  };

  const onSent = async (prompt) => {
    setResultsData("");
    setLoading(true);
    setShowResults(true);
    setRecentPrompt(input);
    const response = await run(input);
    let responseArray = response.split("**");
    let newResponce ;
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponce += responseArray[i];
        } else {
          newResponce += "<b>"+responseArray[i]+"</b>";
        }
      }
    let newResponce2 = newResponce.split("*").join("<br>");
    let newResponceArray = newResponce2.split(" ");
    for(let i=0; i<newResponceArray.length; i++)
    {
       const nextWord = newResponceArray[i];
       delayPara(i,nextWord+""); 

    }  
    setLoading(false);
    setInput('');
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
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  ); 
}; // Closing brace for ContextProvider function

export default ContextProvider;