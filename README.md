# M.A.R.K – Neural Intelligence Kernel

M.A.R.K is a high-performance, professional AI assistant built with a futuristic 3D interface and a resilient neural backend. Designed for researchers, developers, and power users, it provides expert-level synthesis powered by the latest large language models.

![M.A.R.K Banner](https://img.shields.io/badge/Neural-Kernel-6366f1?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Operational-emerald?style=for-the-badge)

## 🚀 Key Features

### 1. Immersive 3D Experience
- **Neural Particle Field**: A dynamic, interactive 3D background powered by **Three.js** and **React Three Fiber**.
- **Futuristic HUD UI**: A sleek, glassmorphism-based interface designed for maximum professional focus.
- **Cinematic Animations**: Smooth, physics-based transitions and reveal animations via **Framer Motion**.

### 2. Intelligent Neural Backend
- **Resilient Model Routing**: Automatically cycles through high-performance free models on OpenRouter (Qwen 3, Gemma 3, etc.) to ensure 100% uptime.
- **Self-Healing Fallbacks**: Automatically detects rate limits (429) or provider errors and switches to the next available "neural node."
- **Expert Context**: Specifically tuned for research, data analysis, and technical briefing.

### 3. Advanced Interactions
- **Voice Intelligence**: Native speech-to-text integration for hands-free commanding.
- **Biometric Aesthetic**: Secure-link status indicators and timestamped, verified kernel logs.
- **Responsive Design**: Fully optimized for desktop workstations and mobile neural links.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org) (App Router)
- **3D Rendering**: [Three.js](https://threejs.org), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **AI Integration**: [OpenRouter API](https://openrouter.ai) (OpenAI SDK)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) & [Lucide Icons](https://lucide.dev)

## ⚡️ Getting Started

### 1. Clone & Install
```bash
git clone <repository-url>
cd M.A.R.K
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
OPENROUTER_API_KEY=your_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to initialize the kernel.

## 📁 Project Structure

- `src/app`: Application routes (Home & Chat).
- `src/components`: UI components (ChatInput, ChatMessage, Scene3D).
- `src/lib`: Core AI configuration and logic.
- `src/app/api/chat`: Resilient backend routing with model fallback logic.

## 📜 License
© 2026 M.A.R.K Neural Systems • All Rights Reserved.