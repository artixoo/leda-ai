
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CompanioInterface.css';

const CompanioInterface = () => {
    const [isListening, setIsListening] = useState(false);

    const toggleListening = () => {
        setIsListening(!isListening);
    };

    return (
        <div className="companio-ui">
            <header className="ui-header">
                <div className="greeting">Good Morning,</div>
                <div className="user-name">Grandma</div>
            </header>

            <main className="ui-main">
                <div className="mic-container" onClick={toggleListening}>
                    <motion.div
                        className="mic-circle"
                        animate={{
                            scale: isListening ? [1, 1.1, 1] : 1,
                            boxShadow: isListening
                                ? "0 0 0 20px rgba(255, 171, 145, 0.2)"
                                : "0 10px 30px rgba(255, 171, 145, 0.3)"
                        }}
                        transition={{
                            duration: 2,
                            repeat: isListening ? Infinity : 0,
                            ease: "easeInOut"
                        }}
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                    </motion.div>
                    <p className="mic-label">
                        {isListening ? "Listening..." : "Tap to talk"}
                    </p>
                </div>

                <div className="cards-scroll">
                    <motion.div className="feature-card primary" whileTap={{ scale: 0.98 }}>
                        <div className="card-icon pill">💊</div>
                        <div className="card-content">
                            <h3>Medicine Time</h3>
                            <p>Heart pill • 9:00 AM</p>
                        </div>
                        <div className="card-action">Mark Done</div>
                    </motion.div>

                    <motion.div className="feature-card" whileTap={{ scale: 0.98 }}>
                        <div className="card-icon news">📰</div>
                        <div className="card-content">
                            <h3>Morning News</h3>
                            <p>Read me the headlines</p>
                        </div>
                    </motion.div>

                    <motion.div className="feature-card emergency" whileTap={{ scale: 0.98 }}>
                        <div className="card-icon alert">🆘</div>
                        <div className="card-content">
                            <h3>Call Help</h3>
                            <p>Emergency Contact</p>
                        </div>
                    </motion.div>
                </div>
            </main>

            <motion.div
                className="toast-message"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 1 }}
            >
                Preview Mode • Features Limited
            </motion.div>
        </div>
    );
};

export default CompanioInterface;
