
import React from 'react';
import './PhoneFrame.css';

const PhoneFrame = ({ children }) => {
    return (
        <div className="phone-chassis">
            <div className="phone-buttons-left"></div>
            <div className="phone-buttons-right"></div>
            <div className="phone-screen">
                <div className="status-bar">
                    <span>9:41</span>
                    <div className="status-icons">
                        <i className="signal-icon"></i>
                        <i className="wifi-icon"></i>
                        <i className="battery-icon"></i>
                    </div>
                </div>
                <div className="notch"></div>

                <div className="app-content">
                    {children}
                </div>

                <div className="home-indicator"></div>
            </div>
        </div>
    );
};

export default PhoneFrame;
