import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/scraper";
import { analyzeWebsite } from "@/lib/openai";
import { z } from "zod";

const AnalyzeSchema = z.object({
  url: z.string().url("Please enter a valid website URL (e.g., https://example.com)"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = AnalyzeSchema.parse(body);
    console.log(`[SiteScope AI] Starting analysis for: ${url}`);

    // Step 2: Fetch HTML and metadata
    console.log(`[SiteScope AI] Scraping website content...`);
    const siteData = await scrapeWebsite(url);
    console.log(`[SiteScope AI] Scraped successfully. Title: "${siteData.title}"`);

    // Step 3: Send to OpenAI for analysis
    console.log(`[SiteScope AI] Sending data to OpenRouter (Gemini Flash) for audit...`);
    const analysis = await analyzeWebsite(siteData);
    
    // Safety check for dashboard
    if (!analysis.scores) {
      console.warn("[SiteScope AI] Analysis missing scores, applying fallback structure");
      analysis.scores = {
        technical: 50,
        seo: 50,
        content: 50,
        ux: 50,
        conversion: 50
      };
    }

    console.log(`[SiteScope AI] Analysis complete for ${url}`);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    
    let errorMessage = "Failed to analyze website";
    
    if (error instanceof z.ZodError) {
      errorMessage = error.errors[0]?.message || "Invalid input";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
