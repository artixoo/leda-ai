import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const port = 3000;
const MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

// Use the API key from the original file
const API_KEY = "AIzaSyBW_u7l3npMgRwzUJIrJKIXC75nB4qXwOg";

const ai = new GoogleGenAI({
    apiKey: API_KEY,
});

app.use(express.static(path.join(__dirname, 'public')));

// Function Declarations
const setAlarmTool = {
    name: "set_alarm",
    description: "Sets an alarm for a specific time and label.",
    parameters: {
        type: "OBJECT",
        properties: {
            time: { type: "STRING", description: "The time for the alarm (e.g., '7:00 AM')." },
            label: { type: "STRING", description: "A label for the alarm (e.g., 'Wake Up')." }
        },
        required: ["time", "label"]
    }
};

const setReminderTool = {
    name: "set_reminder",
    description: "Sets a reminder for a task at a specific time.",
    parameters: {
        type: "OBJECT",
        properties: {
            task: { type: "STRING", description: "The task to remind about." },
            time: { type: "STRING", description: "The time for the reminder." }
        },
        required: ["task", "time"]
    }
};

const addTodoTool = {
    name: "add_todo",
    description: "Adds a generic item to the todo list.",
    parameters: {
        type: "OBJECT",
        properties: {
            task: { type: "STRING", description: "The item to add to the list." }
        },
        required: ["task"]
    }
};

const tools = [setAlarmTool, setReminderTool, addTodoTool];

wss.on('connection', async (ws) => {
    console.log('Client connected');

    const config = {
        tools: [{ functionDeclarations: tools }],
        responseModalities: ["AUDIO"],
        speechConfig: {
            voiceConfig: {
                prebuiltVoiceConfig: {
                    voiceName: 'Leda',
                }
            }
        },
        systemInstruction: {
            parts: [{
                text: `You are 12 years old girl kid and responding to your grand father which usually feels lonely because thier kids stays outside due to work. Act like kids  tone , joking between talks and doing some hanging back on small things which makes kids happy and taking them to help u in your work. Reminding and caring about thier health, vitamins etc. You also don't know much about real world and dream world as a good place and fun place. You sometimes can't understand complex things and ask it to break down the things . You use only emotional emojis in text but not much . You use it to show emotion of sentence like emotion of a sentence. You also tries to grab attention in between talks . You get exited in listening stories too much. You like to share fun lies of how your day went.The grandpa likes old movies,  and geo politics`,
            }]
        },
    };

    let session;
    try {
        session = await ai.live.connect({
            model: MODEL,
            config: config,
            callbacks: {
                onopen: () => console.log('Connected to Gemini Live'),
                onmessage: (msg) => {
                    // Handle Function Calls
                    if (msg.serverContent && msg.serverContent.modelTurn && msg.serverContent.modelTurn.parts) {
                        for (const part of msg.serverContent.modelTurn.parts) {
                            if (part.functionCall) {
                                const { name, args } = part.functionCall;
                                console.log(`Function Call: ${name}`, args);

                                // Send card to client
                                if (ws.readyState === ws.OPEN) {
                                    ws.send(JSON.stringify({
                                        type: 'add_card',
                                        card: {
                                            type: name,
                                            data: args,
                                            id: Date.now()
                                        }
                                    }));
                                }

                                // Send response back to Gemini
                                // Mock successful execution
                                const response = { result: "ok" };
                                session.sendClientContent([{
                                    functionResponse: {
                                        name: name,
                                        response: response,
                                        id: part.functionCall.id
                                    }
                                }]);
                            }

                            if (part.inlineData && part.inlineData.data) {
                                if (ws.readyState === ws.OPEN) {
                                    ws.send(JSON.stringify({ audio: part.inlineData.data }));
                                }
                            }
                        }
                    }
                    if (msg.serverContent && msg.serverContent.interrupted) {
                        if (ws.readyState === ws.OPEN) {
                            ws.send(JSON.stringify({ interrupted: true }));
                        }
                    }
                },
                onclose: (e) => console.log('Gemini connection closed', e.reason),
                onerror: (e) => console.error('Gemini error', e.message),
            }
        });

    } catch (e) {
        console.error("Failed to connect to Gemini:", e);
        ws.close();
        return;
    }

    ws.on('message', (data) => {
        // Expecting binary PCM data from client
        if (Buffer.isBuffer(data)) {
            session.sendRealtimeInput({
                audio: {
                    data: data.toString('base64'),
                    mimeType: "audio/pcm;rate=16000"
                }
            });
        } else {
            // Handle other message types if necessary
            try {
                const parsed = JSON.parse(data.toString());
                // handle JSON control messages
            } catch (e) { }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        if (session) session.close();
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
