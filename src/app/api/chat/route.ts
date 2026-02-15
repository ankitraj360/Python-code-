import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey ? new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "SiteScope AI Chatbot",
  }
}) : null;

export async function POST(req: NextRequest) {
  try {
    const { messages, analysisContext } = await req.json();

    if (!openai) {
      return NextResponse.json({ 
        role: 'assistant', 
        content: "I'm sorry, I'm in demo mode because no API key was provided. I can't answer specific questions about the website right now." 
      });
    }

    const models = [
      "google/gemini-2.0-flash-lite-preview-02-05",
      "google/gemini-2.0-flash-exp",
      "deepseek/deepseek-chat",
      "meta-llama/llama-3.1-8b-instruct"
    ];

    let lastError = null;
    for (const model of models) {
      try {
        const response = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: "system",
              content: `You are SiteScope AI's Expert Assistant. You have access to a detailed website analysis report. 
              Your goal is to answer the user's questions based on this analysis. Be helpful, professional, and technical.
              
              Here is the analysis data:
              ${JSON.stringify(analysisContext)}
              
              If the user asks something not covered by the analysis, use your general knowledge but clarify if you are making an educated guess based on the available data.`
            },
            ...messages
          ],
        });

        if (response.choices[0]?.message) {
          return NextResponse.json(response.choices[0].message);
        }
      } catch (error: any) {
        console.error(`[Chat API] Error with model ${model}:`, error.message);
        lastError = error;
        continue;
      }
    }

    throw lastError || new Error("All chat models failed");
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { role: 'assistant', content: "I'm sorry, I encountered an error while processing your request. Please try again later." },
      { status: 500 }
    );
  }
}
