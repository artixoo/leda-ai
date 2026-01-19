import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CompanioInterface.css';

const PRESET_CARDS = [
    {
        id: 'med',
        icon: '💊',
        iconClass: 'pill',
        title: 'Medicine Time',
        subtitle: 'Heart pill • 9:00 AM',
        action: 'Mark Done',
        className: 'primary'
    },
    {
        id: 'news',
        icon: '📰',
        iconClass: 'news',
        title: 'Morning News',
        subtitle: 'Read me the headlines'
    },
    {
        id: 'help',
        icon: '🆘',
        iconClass: 'alert',
        title: 'Call Help',
        subtitle: 'Emergency Contact',
        className: 'emergency'
    }
];

const CompanioInterface = () => {
    const [isListening, setIsListening] = useState(false);
    const [statusText, setStatusText] = useState("Tap to talk");
    const [socket, setSocket] = useState(null);
    const [audioContext, setAudioContext] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [recorderProcessor, setRecorderProcessor] = useState(null);
    const [nextStartTime, setNextStartTime] = useState(0);
    const [cards, setCards] = useState(PRESET_CARDS);

    // Playback Logic
    const playAudio = (base64Data, currentContext, currentNextStartTime) => {
        if (!currentContext) return currentNextStartTime;

        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const pcmData = new Int16Array(bytes.buffer);

        const float32Data = new Float32Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
            float32Data[i] = pcmData[i] / 32768.0;
        }

        const buffer = currentContext.createBuffer(1, float32Data.length, 24000);
        buffer.getChannelData(0).set(float32Data);

        const source = currentContext.createBufferSource();
        source.buffer = buffer;
        source.connect(currentContext.destination);

        const now = currentContext.currentTime;
        const start = Math.max(now, currentNextStartTime);
        source.start(start);

        return start + buffer.duration;
    };

    const stopAudio = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
        if (recorderProcessor) {
            recorderProcessor.disconnect();
            setRecorderProcessor(null);
        }
        if (audioContext) {
            audioContext.close();
            setAudioContext(null);
        }
    };

    const toggleListening = async () => {
        if (isListening) {
            // Stop listening
            setIsListening(false);
            setStatusText("Tap to talk");
            if (socket) socket.close(1000, "User stopped");
            setSocket(null);
            stopAudio();
        } else {
            // Start listening
            setIsListening(true);
            setStatusText("Connecting...");

            // Use direct localhost:3000 for the standalone server
            const wsUrl = `ws://localhost:3000`;
            const newSocket = new WebSocket(wsUrl);

            setSocket(newSocket);

            newSocket.onopen = async () => {
                setStatusText("Listening...");
                try {
                    // Start Audio Input
                    const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                    setAudioContext(newAudioContext);
                    let currentNextStartTime = 0;

                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            sampleRate: 16000,
                            channelCount: 1,
                            echoCancellation: true,
                        }
                    });
                    setMediaStream(stream);

                    const inputSampleRate = stream.getAudioTracks()[0].getSettings().sampleRate || newAudioContext.sampleRate;
                    console.log("Input Sample Rate:", inputSampleRate);

                    const source = newAudioContext.createMediaStreamSource(stream);
                    const processor = newAudioContext.createScriptProcessor(2048, 1, 1);
                    setRecorderProcessor(processor);

                    processor.onaudioprocess = (e) => {
                        if (newSocket.readyState !== WebSocket.OPEN) return;

                        const inputData = e.inputBuffer.getChannelData(0);

                        // Downsample if needed (e.g. 48k -> 16k)
                        let pcmData;

                        if (inputSampleRate === 48000) {
                            // Downsample 48 -> 16 (1/3)
                            const downsampledLength = Math.floor(inputData.length / 3);
                            pcmData = new Int16Array(downsampledLength);
                            for (let i = 0; i < downsampledLength; i++) {
                                const val = inputData[i * 3];
                                pcmData[i] = Math.max(-1, Math.min(1, val)) * 32767;
                            }
                        } else {
                            // Pass through (might need more sophisticated resampling if not 48k or 16k)
                            pcmData = new Int16Array(inputData.length);
                            for (let i = 0; i < inputData.length; i++) {
                                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
                            }
                        }

                        newSocket.send(pcmData.buffer);
                    };

                    source.connect(processor);
                    processor.connect(newAudioContext.destination);

                    newSocket.onmessage = async (event) => {
                        try {
                            const data = JSON.parse(event.data);
                            if (data.audio) {
                                currentNextStartTime = playAudio(data.audio, newAudioContext, currentNextStartTime);
                            }
                            if (data.interrupted) {
                                console.log("Client: Interrupted");
                                currentNextStartTime = newAudioContext.currentTime;
                            }
                            if (data.type === 'add_card') {
                                const { type, data: args, id } = data.card;
                                let newCard = {
                                    id: id,
                                    title: '',
                                    subtitle: '',
                                    icon: '',
                                    borderStyle: {}
                                };

                                if (type === 'set_alarm') {
                                    newCard.title = 'Alarm Set';
                                    newCard.subtitle = `${args.label} at ${args.time}`;
                                    newCard.icon = '⏰';
                                    newCard.borderStyle = { borderLeft: '4px solid #FFAB91' };
                                } else if (type === 'set_reminder') {
                                    newCard.title = 'Reminder Set';
                                    newCard.subtitle = `${args.task} at ${args.time}`;
                                    newCard.icon = '📅';
                                    newCard.borderStyle = { borderLeft: '4px solid #81C784' };
                                } else if (type === 'add_todo') {
                                    newCard.title = 'To-Do Added';
                                    newCard.subtitle = args.task;
                                    newCard.icon = '📝';
                                    newCard.borderStyle = { borderLeft: '4px solid #64B5F6' };
                                }

                                setCards(prev => [newCard, ...prev]);
                            }
                        } catch (err) {
                            console.error("Error parsing message", err);
                        }
                    };

                } catch (e) {
                    console.error("Audio/Socket Error:", e);
                    setStatusText("Error accessing mic");
                    newSocket.close();
                    setIsListening(false);
                }
            };

            newSocket.onclose = () => {
                setStatusText("Tap to talk");
                setIsListening(false);
                stopAudio();
            };

            newSocket.onerror = (e) => {
                console.error("WebSocket Error:", e);
                setStatusText("Error");
            };
        }
    };

    const dismissCard = (id) => {
        setCards(prev => prev.filter(card => card.id !== id));
    };

    return (
        <div className="companio-ui">
            <header className="ui-header">
                <div className="greeting">Good Morning,</div>
                <div className="user-name">Grandpa</div>
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
                        <div style={{ display: 'flex', gap: '22px', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Left Eye */}
                            <motion.div
                                style={{
                                    width: '14px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white'
                                }}
                                animate={{
                                    scaleY: [1, 1, 0.1, 1, 1, 1, 1, 1], // Blink
                                    x: [0, -4, -4, 0, 4, 4, 0, 0],    // Look Left -> Right -> Center
                                    y: [0, 0, 0, -2, -2, 0, 0, 0]     // Slight upward look
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    times: [0, 0.1, 0.12, 0.15, 0.4, 0.5, 0.8, 1],
                                    ease: "easeInOut"
                                }}
                            />
                            {/* Right Eye */}
                            <motion.div
                                style={{
                                    width: '14px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white'
                                }}
                                animate={{
                                    scaleY: [1, 1, 0.1, 1, 1, 1, 1, 1], // Blink
                                    x: [0, -4, -4, 0, 4, 4, 0, 0],    // Look Left -> Right -> Center
                                    y: [0, 0, 0, -2, -2, 0, 0, 0]     // Slight upward look
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    times: [0, 0.1, 0.12, 0.15, 0.4, 0.5, 0.8, 1],
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                    </motion.div>
                    <p className="mic-label">
                        {statusText}
                    </p>
                </div>

                <div className="cards-scroll">
                    <AnimatePresence>
                        {cards.map((card) => (
                            <motion.div
                                key={card.id}
                                className={`feature-card ${card.className || ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => dismissCard(card.id)}
                                style={{
                                    cursor: 'pointer',
                                    ...card.borderStyle
                                }}
                            >
                                <div className={`card-icon ${card.iconClass || ''}`} style={!card.iconClass ? { fontSize: '1.5rem' } : {}}>
                                    {card.icon}
                                </div>
                                <div className="card-content">
                                    <h3>{card.title}</h3>
                                    <p>{card.subtitle}</p>
                                </div>
                                {card.action && <div className="card-action">{card.action}</div>}
                            </motion.div>
                        ))}
                    </AnimatePresence>
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
