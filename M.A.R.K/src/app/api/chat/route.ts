import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/codespaces",
    "X-Title": "M.A.R.K AI",
  },
});

export async function POST(req: NextRequest) {
  try {
    const { messages, history } = await req.json();
    const systemPrompt = "You are M.A.R.K, a high-performance AI assistant. Provide concise, expert-level responses using markdown.";

    const apiMessages: any[] = [
      { role: "system", content: systemPrompt },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: messages[messages.length - 1].content }
    ];

    // Highly resilient model chain
    const models = [
      "qwen/qwen3-4b:free",
      "google/gemma-3-4b-it:free",     // Corrected ID
      "google/gemma-2-9b-it:free",      // Extremely stable
      "mistralai/mistral-7b-instruct:free",
      "openrouter/free"                 // Ultimate fallback
    ];

    let lastError = null;

    for (const model of models) {
      try {
        const response = await openai.chat.completions.create({
          model: model,
          messages: apiMessages,
          max_tokens: 2048, // Safer limit for various free models
          temperature: 0.7,
        });

        return NextResponse.json({
          role: "assistant",
          content: response.choices[0].message.content,
          modelUsed: model
        });
      } catch (error: any) {
        lastError = error;
        console.warn(`Neural Node [${model}] failed: ${error.status} - ${error.message}`);
        
        // Continue to next model for any provider or rate limit error
        if (error.status === 429 || error.status === 402 || error.status === 400 || error.status === 404 || error.status === 502) {
          continue;
        }
        break; 
      }
    }

    throw lastError;

  } catch (error: any) {
    console.error("OpenRouter API Final Error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "All neural nodes are currently congested. Re-initializing link... Please retry in a moment." },
      { status: 500 }
    );
  }
}
