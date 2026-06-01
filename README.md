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

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (running locally or via Atlas)

### 2. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/oshada28nilendra-debug/ai-prompt-workbench.git
cd ai-prompt-workbench

```

### 3. Backend Setup

Navigate to the backend folder, install dependencies, and configure your environment:

```bash
cd backend
npm install

```

* Create a file named `.env` inside the `backend` folder.
* Add the following variables to that file:
```text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/promptDB

```



```
*   Start the server:
    ```bash
    node server.js

```

### 4. Frontend Setup

Open a **new** terminal window and run:

```bash
cd frontend
npm install
npm run dev

```

* Your application will be available at: `http://localhost:5173`

---

## 📄 License

This project is licensed under the MIT License.

---
