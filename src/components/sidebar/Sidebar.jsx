import React from 'react'
import './sidebar.css'


const Sidebar = () => {
    return (
                <div className="sidebar">
                    <div className="top">
                        <img className='menu' src="./menu_icon.png" alt="" />
                        <div className="new-chat">
                            <img src="./plus_icon.png" alt="" />
                            <p>New Chat</p>
                        </div>
                        <div className="recent">
                            <p className="recent-title">Recent</p>
                            <div className="recent-entry">
                                <img src="./message_icon.png" alt="" />
                                <p>What is react ...</p>
                            </div>
                        </div>
                        
                    </div>
                    <div className="bottom">
                        <div className="bottom-item recent-entry">
                            <img src="./question_icon.png" alt="" />
                            <p>Help</p>
                        </div>

                        <div className="bottom-item recent-entry">
                            <img src="./history_icon.png" alt="" />
                            <p>Activity</p>
                        </div>

                        <div className="bottom-item recent-entry">
                            <img src="./setting_icon.png" alt="" />
                            <p>Settings</p>
                        </div>
                    </div>
                    
                </div>
  )
}

export default Sidebar
