import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Invalid URL provided." }, { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ error: "API Key not configured." }, { status: 500 });
    }

    // 1. Fetch the website content
    const response = await fetch(url);
    const html = await response.text();

    // 2. Basic content extraction (Title and Meta)
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : "";
    
    const metaDescMatch = html.match(/<meta name="description" content="(.*?)"/i);
    const description = metaDescMatch ? metaDescMatch[1] : "";

    // Strip scripts and styles for cleaner content
    const cleanBody = html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
      .replace(/<[^>]*>?/gm, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 10000); // Limit to 10k chars for the prompt

    // 3. Prompt Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Analyze the following website content and create a highly detailed, structured AI prompt.
      The goal of the generated prompt is to allow another AI to either:
      1. Act as an expert in the domain of this website.
      2. Replicate the tone, style, and core information of this brand.

      WEBSITE DATA:
      Title: ${title}
      Description: ${description}
      Content Snippet: ${cleanBody}

      REQUIREMENTS FOR THE GENERATED PROMPT:
      - Include a "Role" section.
      - Include a "Context" section explaining what the website is about.
      - Include "Style Guidelines" based on the writing style found.
      - Include "Key Knowledge Points" extracted from the content.
      - The final output should be ONLY the generated prompt, ready to copy-paste.
    `;

    const result = await model.generateContent(prompt);
    const distilledPrompt = result.response.text();

    return NextResponse.json({ prompt: distilledPrompt });
  } catch (error: any) {
    console.error("Distillation error:", error);
    return NextResponse.json({ error: "Failed to distill website content." }, { status: 500 });
  }
}
