import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey ? new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "SiteScope AI",
  }
}) : null;

export async function analyzeWebsite(data: any) {
  if (!openai) {
    console.warn("[OpenAI] API Key missing. Returning mock data.");
    return getMockAnalysis();
  }

  const models = [
    "meta-llama/llama-3.1-8b-instruct"
  ];

  let lastError = null;

  for (const model of models) {
    try {
      console.log(`[OpenRouter] Attempting analysis with ${model}...`);
        const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are an expert Website Auditor. Analyze the provided website data using the following high-dimensional signal framework:

            1. Structural: Page type, URL depth, link graph, crawl budget.
            2. Technical: LCP, CLS, INP, TTFB, bundle sizes, mobile performance.
            3. HTML/SEO: Hierarchy, keyword presence (Title/H1/First Para), schema, canonicals.
            4. Content Intelligence: Depth, semantic relevance, search intent, E-E-A-T indicators.
            5. Conversion: CTA visibility, social proof, funnel friction.
            6. Security/Trust: HTTPS, security headers, policy presence.

            Return a comprehensive report in EXCLUSIVELY JSON format.
            
            JSON structure:
            {
              "overallRating": number (1-10),
              "scores": { 
                "technical": number (0-100),
                "seo": number (0-100),
                "content": number (0-100),
                "ux": number (0-100),
                "conversion": number (0-100),
                "authority": number (0-100)
              },
              "pros": string[],
              "cons": string[],
              "mistakes": string[],
              "technicalDeepDive": { 
                "architecture": string, 
                "potentialBottlenecks": string[], 
                "modernityScore": number (0-100) 
              },
              "improvements": [ 
                { "priority": "High" | "Medium" | "Low", "task": string, "reason": string, "impact": string } 
              ],
              "probabilities": {
                "rankingImprovement": number (0-1),
                "conversionImprovement": number (0-1)
              },
              "founderSummary": string,
              "startupReadinessScore": number (0-100),
              "quickWins": string[],
              "longTermRoadmap": string[]
            }
            
            Important: Do not include any text, markdown, or commentary outside of the JSON object.`
          },
          {
            role: "user",
            content: `Analyze this data: ${JSON.stringify(data)}`
          }
        ],
      });

      const content = response.choices[0].message.content || "{}";
      console.log(`[OpenRouter] Raw response from ${model}:`, content.substring(0, 500) + (content.length > 500 ? "..." : ""));
      
      // Step 1: Extract anything that looks like a JSON object
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      let jsonString = jsonMatch ? jsonMatch[0] : content;

      // Step 2: Clean up common LLM artifacts
      jsonString = jsonString
        .replace(/```json\n?|\n?```/g, "") // Remove markdown blocks
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ") // Remove control characters that break JSON.parse
        .trim();
      
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        console.warn(`[OpenRouter] Standard JSON.parse failed, attempting aggressive repair...`);
        
        // Step 3: Aggressive repair for common Llama 8b issues
        // Fix unescaped newlines inside strings
        let repaired = jsonString.replace(/(?<=: \".*)\n(?=.*\"[,\}])/g, "\\n");
        
        try {
          return JSON.parse(repaired);
        } catch (innerError) {
          console.error(`[OpenRouter] All JSON parsing attempts failed for ${model}`);
          throw innerError;
        }
      }
    } catch (error: any) {
      console.error(`[OpenRouter] Error with model ${model}:`, error.message);
      lastError = error;
      continue; // Try next model
    }
  }

  throw lastError || new Error("All models failed");
}

function getMockAnalysis() {
  return {
    overallRating: 8.5,
    scores: {
      design: 8,
      performance: 7,
      seo: 9,
      accessibility: 8,
      conversion: 7
    },
    pros: ["Clean layout", "Fast initial load", "Mobile responsive"],
    cons: ["Low contrast in footer", "Missing alt tags on some images", "Vague CTA"],
    mistakes: ["Multiple H1 tags", "Non-descriptive link text"],
    improvements: [
      { priority: "High", task: "Improve CTA visibility" },
      { priority: "Medium", task: "Add aria-labels to buttons" }
    ],
    founderSummary: "A solid start with clear SEO potential, but needs better conversion optimization and accessibility fixes to truly scale.",
    startupReadinessScore: 78
  };
}
