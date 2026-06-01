# 🎬 Cinematic AI Prompt Workbench

A full-stack, developer-first workspace for AI Prompt Engineers and Digital Artists. This tool allows users to track, version, and orchestrate high-fidelity generative AI workflows without losing the lineage of their prompt iterations.

## ✨ Features
* **Smart Branching:** Duplicate a prompt and tweak it without losing the original.
* **Lineage Tracking:** A visual timeline modal that maps out the exact evolutionary tree of your prompt variations.
* **One-Click Copy:** Ready-to-paste configurations for Midjourney, DALL-E, and Stable Diffusion.
* **Premium Glassmorphism UI:** Built with Tailwind CSS v4, featuring dynamic ambient lighting and responsive design.

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS v4, Lucide Icons, React-Hot-Toast
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ORM)

## 🚀 Local Setup

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/ai-prompt-workbench.git
cd ai-prompt-workbench
\`\`\`

### 2. Setup the Backend
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` folder and add:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/promptDB
\`\`\`
Start the server:
\`\`\`bash
node server.js
\`\`\`

### 3. Setup the Frontend
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Navigate to `http://localhost:5173` in your browser.