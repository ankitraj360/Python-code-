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
    "google/gemini-2.0-flash-001",
    "meta-llama/llama-3.1-8b-instruct",
    "mistralai/mistral-7b-instruct"
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
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content || "{}";
      console.log(`[OpenRouter] Raw response from ${model}:`, content.substring(0, 500) + (content.length > 500 ? "..." : ""));
      
      // Step 1: Extract JSON more robustly
      let jsonString = content;
      const startIdx = content.indexOf('{');
      const endIdx = content.lastIndexOf('}');
      
      if (startIdx !== -1) {
        if (endIdx !== -1 && endIdx > startIdx) {
          jsonString = content.substring(startIdx, endIdx + 1);
        } else {
          // Truncated JSON - starts but doesn't end
          jsonString = content.substring(startIdx);
        }
      }

      // Step 2: Clean up common LLM artifacts
      jsonString = jsonString
        .replace(/```json\n?|\n?```/g, "") // Remove markdown blocks
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ") // Remove control characters
        .trim();
      
      // Step 3: Attempt to fix common issues before parsing
      const repairJSON = (str: string) => {
        let repaired = str;
        
        // Fix unescaped newlines inside strings
        repaired = repaired.replace(/(?<=: \".*)\n(?=.*\"[,\}])/g, "\\n");

        // Fix missing commas between properties (e.g., "key": "val" "next": "val")
        repaired = repaired.replace(/(?<=[0-9"\]\}])\s*\n?\s*"/g, ',\n"');
        
        // Fix missing closing braces if truncated
        let openBraces = (repaired.match(/\{/g) || []).length;
        let closeBraces = (repaired.match(/\}/g) || []).length;
        while (openBraces > closeBraces) {
          repaired += "}";
          closeBraces++;
        }

        // Fix missing closing brackets for arrays
        let openBackets = (repaired.match(/\[/g) || []).length;
        let closeBackets = (repaired.match(/\]/g) || []).length;
        while (openBackets > closeBackets) {
          repaired += "]";
          closeBackets++;
        }
        
        return repaired;
      };

      try {
        return JSON.parse(jsonString);
      } catch (e) {
        console.warn(`[OpenRouter] Standard JSON.parse failed, attempting repair...`);
        const repaired = repairJSON(jsonString);
        
        try {
          return JSON.parse(repaired);
        } catch (innerError) {
          console.error(`[OpenRouter] All JSON parsing attempts failed for ${model}`);
          // Try one last desperate attempt: find the last valid comma/brace and close it
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
      technical: 82,
      seo: 91,
      content: 78,
      ux: 85,
      conversion: 72,
      authority: 88
    },
    probabilities: {
      rankingImprovement: 0.85,
      conversionImprovement: 0.65
    },
    technicalDeepDive: {
      architecture: "Modern Next.js Architecture with Tailwind CSS and Framer Motion for high-performance interactions.",
      potentialBottlenecks: ["Large image assets", "Unused CSS in third-party libraries"],
      modernityScore: 92
    },
    improvements: [
      { priority: "High", task: "Optimize Hero Images", reason: "LCP is currently 2.4s, which is near the threshold.", impact: "Faster perceived load time" },
      { priority: "Medium", task: "Enhance Aria Labels", reason: "Some interactive elements lack clear labels for screen readers.", impact: "Improved accessibility" },
      { priority: "Low", task: "Minify Legacy Scripts", reason: "Small amount of dead code detected in polyfills.", impact: "Reduced bundle size" }
    ],
    founderSummary: "Your website demonstrates strong technical foundations and excellent SEO hygiene. Focus on tightening the conversion funnel and optimizing asset delivery to achieve top-tier performance scores.",
    startupReadinessScore: 84,
    quickWins: [
      "Compress main hero images using WebP",
      "Add missing alt tags to footer icons",
      "Update meta description for better CTR"
    ],
    longTermRoadmap: [
      "Implement automated A/B testing for CTA buttons",
      "Migration to edge-based image optimization",
      "Develop a more comprehensive content clusters strategy"
    ]
  };
}
