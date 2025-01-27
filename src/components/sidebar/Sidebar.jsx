import { useState } from 'react'
import './sidebar.css'


const Sidebar = () => {
    const [extended, setExtended] = useState(false)
    return (
        <div className="sidebar">
            <div className="top">
                <img onClick={()=>setExtended(prev=>!prev)} className='menu' src="./menu_icon.png" alt="" />
                <div className="new-chat">
                    <img src="./plus_icon.png" alt="" />
                   {extended? <p>New Chat</p>: null}
                </div>
                {extended ?
                 <div className="recent">
                    <p className="recent-title">Recent</p>
                    <div className="recent-entry">
                        <img src="./message_icon.png" alt="" />
                        <p>What is react ...</p>
                    </div>
                </div> : null
                }
               
                        
        </div>
        <div className="bottom">
             <div className="bottom-item recent-entry">
                 <img src="./question_icon.png" alt="" />
                 {extended ?<p>Help</p> : null}
            </div>

                <div className="bottom-item recent-entry">
                    <img src="./history_icon.png" alt="" />
                    {extended ?<p>Activity</p> : null}
                </div>

                <div className="bottom-item recent-entry">
                     <img src="./setting_icon.png" alt="" />
                     { extended ?<p>Settings</p> : null}
                </div>
        </div>
                    
     </div>
  )
}

export default Sidebar
