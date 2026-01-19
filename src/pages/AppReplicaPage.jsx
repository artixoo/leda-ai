
import React from 'react';
import { motion } from 'framer-motion';
import PhoneFrame from '../components/PhoneFrame';
import CompanioInterface from '../components/CompanioInterface';
import './AppReplicaPage.css';

const AppReplicaPage = () => {
    return (
        <div className="replica-container">
            <div className="replica-backdrop"></div>

            <motion.div
                className="phone-wrapper"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <PhoneFrame>
                    <CompanioInterface />
                </PhoneFrame>
            </motion.div>

            <motion.div
                className="web-replica-badge"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                WEB APP REPLICA - Experience the full mobile app conceptual design.
                <br />
                <span style={{ fontSize: '0.8em', opacity: 0.8, fontWeight: '400' }}>
                    Many features are limited in this web demonstration.
                </span>
            </motion.div>
        </div>
    );
};

export default AppReplicaPage;
