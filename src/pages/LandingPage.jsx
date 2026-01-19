
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const teamMembers = [
    {
        name: "Utkarsh Pratham",
        role: "Team Leader & Cybersecurity Expert",
        desc: "Full Stack Developer fully immersed in Cybersecurity.",
        img: "/assets/team/utkarsh.png"
    },
    {
        name: "Divyanshu Rai",
        role: "OSINT & Security Researcher",
        desc: "Specializes in Open Source Intelligence and digital footprint analysis.",
        img: "/assets/team/divyanshu.jpg"
    },
    {
        name: "Yuyutshu Parashar",
        role: "Backend Developer",
        desc: "Expert in backend systems and Reverse Engineering.",
        img: "/assets/team/yuyutshu.jpg"
    },
    {
        name: "Yashika Siwach",
        role: "Marketing & Outreach",
        desc: "Driving growth and engagement. DSA Enthusiast.",
        img: "/assets/team/yashika.jpg"
    },
    {
        name: "Aryan Bhardwaj",
        role: "Frontend Developer",
        desc: "Web Exploitation specialist with solid frontend knowledge.",
        img: "/assets/team/aryan.jpg"
    }
];

const images = [
    "/assets/Gemini_Generated_Image_7nuf9o7nuf9o7nuf.png",
    "/assets/Gemini_Generated_Image_r2sfcmr2sfcmr2sf.png",
    "/assets/Gemini_Generated_Image_w2p1zbw2p1zbw2p1.png",
    "/assets/Gemini_Generated_Image_yw2h9yw2h9yw2h9y.png",
    "/assets/iitmdl.png",
    "/assets/1.png",
    "/assets/Gemini_Generated_Image_6phfz36phfz36phf.png"
];

const Showcase = () => {
    return (
        <div className="marquee-container">
            <h2 className='section-title'>Experience the Magic</h2>
            <div className="marquee-wrapper">
                <motion.div
                    className="marquee-track"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear"
                    }}
                >
                    {/* Render images multiple times for seamless loop */}
                    {[...images, ...images, ...images].map((img, i) => (
                        <div key={i} className="marquee-item">
                            <img src={img} alt={`Showcase ${i}`} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

const LandingPage = () => {
    return (
        <div className="landing-container">
            <nav className="navbar">
                <div className="logo">Xaenithra</div>
                <div className="links">
                    <Link to="/app" className="nav-cta">Access Prototype</Link>
                    <a href="#team" className="nav-cta">Team</a>
                </div>
            </nav>

            <header className="hero">
                <motion.h1
                    className='brand'
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
                    Your AI Companion. Always there, always caring.
                </motion.p>

                <motion.div
                    className="hero-video-container"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <video className="hero-video" autoPlay loop muted playsInline controls>
                        <source src="/assets/Hindi_Cute_Video_Generation.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <Link to="/app" className="cta-button">
                        Launch Prototype
                    </Link>
                </motion.div>
            </header>

            <Showcase />

            <section id="team" className="team-section">
                <h2 className='logo'>Team Xaenithra</h2>
                <div className="team-grid">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            className="team-card"
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="member-image-container">
                                <img src={member.img} alt={member.name} className="member-image" />
                            </div>
                            <h3>{member.name}</h3>
                            <p className="member-role">{member.role}</p>
                            <p className="member-desc">{member.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
