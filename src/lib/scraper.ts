import * as cheerio from "cheerio";

export async function scrapeWebsite(url: string) {
  try {
    // Validate URL structure one more time
    try {
      new URL(url);
    } catch {
      throw new Error("The URL entered is invalid. Please enter a complete URL starting with https://");
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 0 } // Ensure we don't get cached 404s
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("The website could not be found (404). Please check the URL and try again.");
      }
      throw new Error(`The website could not be reached (Status: ${response.status}). Please ensure the URL is correct and public.`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Comprehensive Metadata Extraction
    const title = $("title").text();
    const metaTags: Record<string, string> = {};
    $("meta").each((i, el) => {
      const name = $(el).attr("name") || $(el).attr("property") || $(el).attr("itemprop");
      const content = $(el).attr("content");
      if (name && content) metaTags[name] = content;
    });

    // Content Hierarchy
    const headings = {
      h1: $("h1").map((i, el) => $(el).text().trim()).get(),
      h2: $("h2").map((i, el) => $(el).text().trim()).get(),
      h3: $("h3").map((i, el) => $(el).text().trim()).get(),
    };

    // Semantic Analysis
    const semanticElements = {
      header: $("header").length > 0,
      footer: $("footer").length > 0,
      main: $("main").length > 0,
      nav: $("nav").length > 0,
      sectionCount: $("section").length,
      articleCount: $("article").length,
    };

    // Technical Assets
    const scripts = $("script").map((i, el) => ({
      src: $(el).attr("src"),
      async: $(el).attr("async") !== undefined,
      defer: $(el).attr("defer") !== undefined,
      type: $(el).attr("type"),
    })).get();

    const stylesheets = $('link[rel="stylesheet"]').map((i, el) => $(el).attr("href")).get();

    // Design & UI Patterns (via classes)
    const allClassNames = $("*").map((i, el) => $(el).attr("class")).get().join(" ");
    const designPatterns = {
      isFlex: allClassNames.includes("flex"),
      isGrid: allClassNames.includes("grid"),
      hasAnimations: allClassNames.includes("animate") || html.includes("gsap") || html.includes("framer"),
      isModern: allClassNames.includes("rounded-") || allClassNames.includes("shadow-"),
    };

    // Accessibility
    const accessibility = {
      ariaLabels: $("[aria-label]").length,
      roles: $("[role]").length,
      altTagsMissing: $("img:not([alt])").length,
      inputLabelsMissing: $("input:not([id]), label:not([for])").length,
    };

    // Conversion Elements
    const conversion = {
      buttons: $("button, .btn, [class*='button']").map((i, el) => $(el).text().trim()).get().slice(0, 10),
      forms: $("form").length,
      inputs: $("input, select, textarea").length,
    };

    return {
      url,
      title,
      metaTags,
      headings,
      semanticElements,
      scripts,
      stylesheets,
      designPatterns,
      accessibility,
      conversion,
      textPreview: $("body").text().replace(/\s\s+/g, ' ').substring(0, 5000), // Cleaned body text
      html: html.substring(0, 25000), // Maximize HTML context
    };
  } catch (error: any) {
    console.error("Scraping error:", error);
    if (error.code === 'ENOTFOUND' || error.message?.includes('fetch failed')) {
      throw new Error("Could not connect to the website. Please check if the URL exists and is entered correctly.");
    }
    throw error;
  }
}
