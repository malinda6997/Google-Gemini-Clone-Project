import React from 'react'
import './main.css'

const Main = () => {
  return (
    <div className="main">
        <div className="nav">
            <p>Gemini</p>
            <img src="./me.jpg" alt="" />
        </div>
        <div className="main-container">
          <div className="greet">
            <p><span>Hello, Malinda</span></p>
            <p>How can I help you today ?</p>
            </div> 
            <div className="cards">
                <div className="card">
                    <p>What are the latest advancements in 
                        artificial intelligence and their 
                        applications in 2025?</p>
                    <img src="./compass_icon.png" alt="" />
                </div>
                <div className="card">
                    <p>How can I optimize my CI/CD pipeline 
                        using tools like Jenkins, Docker, 
                        and Terraform?</p>
                    <img src="./compass_icon.png" alt="" />
                </div>
                <div className="card">
                    <p>Exploring the differences between AWS, 
                        Google Cloud Platform, and Azure for 
                        enterprise solutions.</p>
                    <img src="./compass_icon.png" alt="" />
                </div>
                <div className="card">
                    <p>What are the best practices for securing 
                        cloud-based applications in a multi-cloud 
                        environment?</p>
                    <img src="./compass_icon.png" alt="" />
                </div>
            </div> 
            <div className="main-bottom">
                <div className="search-box">
                   <input type="text" placeholder="Enter a promt here...." /> 
                   <div>
                    <img src="./gallery_icon.png" alt="" />
                    <img src="./mic_icon.png" alt="" />
                    <img src="./send_icon.png" alt="" />

                   </div>
                </div>
                <p className="bottom-info">Gemini Clone © 2025 | Built by Malinda Prabath. For queries or feedback, contact us at malindaprabath877@gmail.com.</p>
            </div>
        </div>
      
    </div>
  )
}

export default Main
