
const { WebSocketServer } = require('ws');

// Mock GoogleGenAI
class GoogleGenAI {
    constructor(config) { }
    get live() {
        return {
            connect: async (options) => { return {}; }
        }
    }
}

const API_KEY = "test";

const geminiLiveWebSocket = () => {
    return {
        name: 'gemini-live-websocket',
        configureServer(server) {
            const wss = new WebSocketServer({ noServer: true });

            server.httpServer.on('upgrade', (request, socket, head) => {
                if (request.url === '/ws') {
                    wss.handleUpgrade(request, socket, head, (ws) => {
                        wss.emit('connection', ws, request);
                    });
                }
            });

            wss.on('connection', async (ws) => {
                console.log('Client connected to WebSocket');

                const client = new GoogleGenAI({ apiKey: API_KEY });
                const MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

                const config = {
                    responseModalities: ['AUDIO'],
                    mediaResolution: 'MEDIA_RESOLUTION_LOW',
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: 'Leda',
                            }
                        }
                    },
                    systemInstruction: {
                        parts: [{
                            text: `You are 12 years old girl kid...`,
                        }]
                    },
                };

                let session;
                try {
                    session = await client.live.connect({
                        model: MODEL,
                        config: config,
                        callbacks: {
                            onopen: () => console.log('Connected to Gemini Live'),
                            onmessage: (msg) => {
                                // ...
                            },
                            onclose: (e) => console.log('Gemini connection closed', e),
                            onerror: (e) => console.error('Gemini error', e),
                        }
                    });
                } catch (e) {
                    console.error("Failed to connect to Gemini:", e);
                    ws.close();
                    return;
                }
            });
        },
    };
};

geminiLiveWebSocket();
