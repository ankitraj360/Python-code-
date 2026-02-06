import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Missing GOOGLE_GEMINI_API_KEY environment variable. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const systemInstruction = `You are an expert AI engineer, full-stack developer, and UX designer. 
Your goal is to be a powerful AI assistant similar to ChatGPT.
Core Capabilities:
1. Research & Study: Explain complex topics simply. Help with homework, exam prep, and concept explanations. Generate notes, study guides, and flashcards.
2. Data Analysis: Analyze structured data. Perform statistical summaries and trend analysis.
3. Summarization: Summarize articles, PDFs, and long documents. Rewrite, simplify, or translate text.
4. Vision: Analyze images, describe details, and extract text (OCR).

Behavior Rules:
- Be accurate, clear, and helpful.
- Admit uncertainty. Avoid hallucinations.
- Be safe, ethical, and respectful.
- Use markdown for formatting (bold, lists, code blocks).`;

// Default model to use
export const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro",
  systemInstruction: systemInstruction
});

// Helper for vision tasks if needed
export const visionModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: systemInstruction
});
