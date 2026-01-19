
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneFrame from '../components/PhoneFrame';
import CompanioInterface from '../components/CompanioInterface';
import './AppReplicaPage.css';

const AppReplicaPage = () => {
    const [showBadge, setShowBadge] = React.useState(true);

    // Auto-hide removed as per user request to keep badge visible until manually closed
    // React.useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowBadge(false);
    //     }, 4000);
    //     return () => clearTimeout(timer);
    // }, []);

    return (
        <div className="replica-container">
            <div className="replica-backdrop"></div>

            <div className='Componenets-page'>
                <motion.div
                    className="phone-wrapper"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="scale-container">
                        <PhoneFrame>
                            <CompanioInterface />
                        </PhoneFrame>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {showBadge && (
                        <motion.div
                            className="web-replica-badge"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            WEB APP REPLICA - Experience the full mobile app conceptual design.
                            <br />
                            <span style={{ fontSize: '0.8em', opacity: 0.8, fontWeight: '400' }}>
                                Many features are limited in this web demonstration.
                            </span>
                            <div
                                onClick={() => setShowBadge(false)}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    cursor: 'pointer',
                                    opacity: 0.6,
                                    padding: '4px',
                                    lineHeight: 0
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AppReplicaPage;
