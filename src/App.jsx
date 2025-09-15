import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Main from "./components/main/Main";
import ContextProvider from "./context/Context";

const App = () => {
  return (
    <ContextProvider>
      <Sidebar />
      <Main />
    </ContextProvider>
  );
};
// AIzaSyCJcrx_PsNdh0y1Q-Lr_dBWDljwjyFdCPM (old api key)
export default App;
