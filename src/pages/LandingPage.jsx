
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const teamMembers = [
    "Utkarsh Pratham", "Divyanshu Rai", "Yuyutshu Parashar", "Yashika Siwach", "Aryan Bhardwaj"
];

const LandingPage = () => {
    return (
        <div className="landing-container">
            <nav className="navbar">
                <div className="logo">Xaenithra</div>
                <div className="links">
                    <a href="#team">Team</a>
                </div>
            </nav>

            <header className="hero">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Companio
                </motion.h1>
                <motion.p
                    className="slogan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    A voice that cares when you need it most.
                </motion.p>

                <motion.div
                    className="hero-video-container"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <video className="hero-video" autoPlay loop muted playsInline>
                        <source src="/assets/igstory.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <Link to="/app" className="cta-button">
                        Experience Companio
                    </Link>
                </motion.div>
            </header>

            <section id="team" className="team-section">
                <h2>Team Xaenithra</h2>
                <div className="team-grid">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            className="team-card"
                            key={member}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="avatar-placeholder">{member[0]}</div>
                            <h3>{member}</h3>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
