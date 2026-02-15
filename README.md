# Companio

Companio is an AI-powered companion designed to provide company and assistance, particularly suited for the elderly or those feeling lonely. It features a voice-interactive persona of a 12-year-old grandchild, "Leda", who engages in empathetic conversations, tells stories, and helps with daily tasks.

## Features

- **Real-time Voice Interaction**: Powered by Google's Gemini Multimodal Live API for natural, low-latency voice conversations.
- **Empathetic Persona**: "Leda", a caring 12-year-old character who loves stories, cares about health (reminding to take vitamins), and engages in lighthearted chat.
- **Useful Tools**:
  - **Set Alarms**: "Wake me up at 7 AM."
  - **Set Reminders**: "Remind me to take my medicine at 8 PM."
  - **Todo List**: "Add 'buy apples' to my list."
- **Visual Feedback**: Real-time audio visualizer and card-based UI for tool interactions.

## Technology Stack

- **Frontend**: React, Vite, TailwindCSS (inferred), Framer Motion
- **Backend**: Node.js, Express, WebSocket (`ws`)
- **AI**: Google Gemini Multimodal Live API
- **Tools**: ESLint for code quality

## Prerequisites

- Node.js (v18 or higher recommended)
- A Google Cloud Project with the Gemini API enabled.
- An API Key for Gemini.

> [!WARNING]
> **Security Note**: This project currently uses an API key directly in `server.js`. For production or public deployment, **NEVER** commit your API keys. Use environment variables (e.g., `.env` file) instead.

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/utxdev/Companio.git
    cd Companio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Usage

1.  **Start the Development Server**:
     This will start both the backend server (port 3000) and the Vite frontend (usually port 5173).
    ```bash
    npm run dev
    # OR manually:
    # node server.js &
    # npm run dev
    ```

2.  **Access the Application**:
    Open your browser and navigate to the URL provided by Vite (e.g., `http://localhost:5173`).

3.  **Interact**:
    - Click "Start" or the microphone icon to begin the session.
    - Speak to Leda. Try asking her to tell a story or set a reminder.

## Project Structure

- `server.js`: Express server dealing with WebSocket connections and interfacing with the Gemini Live API. Defines tools (alarm, reminder, todo) and system instructions.
- `src/App.jsx`: Main React application component handling routing.
- `src/components/`: Reusable UI components.
- `src/pages/`: Application pages (LandingPage, AppReplicaPage).
- `public/`: Static assets.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
