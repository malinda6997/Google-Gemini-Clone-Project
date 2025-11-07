import "./Main.css";
import { useContext } from "react";
import { Context } from "../../context/Context";
import { assets } from "../../assets/assets";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResults,
    loading,
    resultsData,
    setInput,
    input,
  } = useContext(Context);
  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {!showResults ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Malinda</span>
              </p>
              <p>How can I help you today ?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>
                  What are the latest advancements in artificial intelligence
                  and their applications in 2025?
                </p>
                <img src="./bulb_icon.png" alt="" />
              </div>
              <div className="card">
                <p>
                  How can I optimize my CI/CD pipeline using tools like Jenkins,
                  Docker, and Terraform?
                </p>
                <img src="./code_icon.png" alt="" />
              </div>
              <div className="card">
                <p>
                  Exploring the differences between AWS, Google Cloud Platform,
                  and Azure for enterprise solutions.
                </p>
                <img src="./compass_icon.png" alt="" />
              </div>
              <div className="card">
                <p>
                  What are the best practices for securing cloud-based
                  applications in a multi-cloud environment?
                </p>
                <img src="./message_icon.png" alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="results">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="results-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultsData }}></p>
              )}
            </div>
          </div>
        )}
        <div className="space"></div>

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a promt here...."
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img onClick={() => onSent()} src={assets.send_icon} alt="" />
            </div>
          </div>
          <p className="bottom-info">
            Gemini Clone © 2025 | Built by Malinda Prabath. For queries or
            feedback, contact us at malindaprabath877@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
