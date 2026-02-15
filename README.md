# SiteScope AI - Advanced Website Intelligence & Strategic Audit

SiteScope AI is a futuristic, AI-driven website auditor that provides high-dimensional technical and strategic insights. It moves beyond basic metrics to analyze websites through a framework of **10 distinct signal categories**, delivering hyper-accurate growth and conversion probabilities.

## 🚀 Features

- **10-Signal Framework:** Analyzes Structural, Technical, SEO, Content, Conversion, Security, and Competitive signals.
- **Llama 3.1 8B Powered:** Specifically optimized for the `meta-llama/llama-3.1-8b-instruct` model for high-conviction audits.
- **3D Immersive UI:** Built with React Three Fiber and Three.js for a cutting-edge visual experience.
- **Intelligent Web Scraping:** Comprehensive metadata and technical asset extraction using Cheerio.
- **Robust JSON Analysis:** Advanced multi-step parsing and auto-repair logic to handle high-dimensional AI outputs.
- **Strategic Growth Probabilities:** Predicts Ranking Improvement and Conversion Lift probabilities (0-100%).
- **Interactive Signal Dashboard:** Modern data visualization using Radar Charts and Score Metrics (0-100%).
- **Dark-Blue AI Assistant:** Integrated chatbot for deep-diving into analysis reports.

## 🛠️ Tech Stack

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation:** [Framer Motion 12](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/)
- **3D Graphics:** [Three.js](https://threejs.org/), [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- **AI Integration:** [OpenRouter](https://openrouter.ai/) (Llama 3.1 8B Instruct)
- **Scraping:** [Cheerio](https://cheerio.js.org/)

## 📋 Analysis Framework (Signals)

The system evaluates websites across 10 core dimensions:
1. **Structural:** Page hierarchy, link graph, and crawl budget.
2. **Technical:** Core Web Vitals (LCP, CLS, INP), TTFB, and asset optimization.
3. **SEO:** HTML signals, keyword presence, and schema completeness.
4. **Content Intelligence:** Semantic relevance, search intent, and E-E-A-T.
5. **User Behavior:** Engagement and exit probabilities.
6. **Conversion:** CTA visibility, social proof, and funnel friction.
7. **Authority:** Domain and backlink velocity (competitive gap).
8. **Security:** HTTPS, security headers, and trust markers.
9. **Competitive Gap:** Authority, UX, and Speed gaps against competitors.
10. **Growth Probabilities:** Calculated likelihood of SEO and Conversion success.

## 🚦 Getting Started

### Installation

1. **Clone and Install:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file:
   ```env
   OPENAI_API_KEY=your_openrouter_api_key_here
   ```

3. **Run Development:**
   ```bash
   npm run dev
   ```

## 🧠 Project Structure

```text
src/
├── app/
│   ├── api/analyze/      # High-dimensional signal processing
│   ├── api/chat/         # AI Assistant endpoint with model fallback
│   └── dashboard/        # Signal-based visualization dashboard
├── components/
│   ├── three/            # 3D Scene (Scene, FloatingCube)
│   └── ui/               # Chatbot (Navy Theme), RadarChart (Signal Sync)
├── lib/
│   ├── openai.ts         # Robust JSON parsing & Signal framework logic
│   └── signals.md        # Reference documentation for audit signals
```

## 📄 License

This project is licensed under the MIT License.
