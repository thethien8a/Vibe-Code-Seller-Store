import { PRODUCTS } from "../constants";

type GeminiRequestBody = {
  userQuery?: string;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
    status?: string;
    code?: number;
  };
};

function buildPrompt(userQuery: string): string {
  const productContext = PRODUCTS.map(
    (p) => `- ${p.name} (${p.category}): ${p.price} VND. Description: ${p.description}`
  ).join("\n");

  return `
    You are Boxie, a cute and helpful AI shopping assistant for "Boxie Gift", a gift shop for students and Gen Z.
    User Query: "${userQuery}"
    
    Our Product Catalog:
    ${productContext}
    
    Rules:
    1. Recommend 1-3 specific products from our catalog that match the user's query.
    2. Be super cute, enthusiastic, and use emojis (🌸, 🎁, ✨).
    3. If the user asks for something we don't have, politely suggest the closest alternative or a "Custom Gift Box".
    4. Keep the response short (under 100 words).
    5. Mention prices in 'k' (e.g. 150k) to sound local.
  `;
}

function safeJsonParse(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function extractTextFromGeminiResponse(data: GeminiGenerateContentResponse): string | undefined {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return undefined;
  const text = parts.map((p) => p?.text || "").join("").trim();
  return text || undefined;
}

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    return;
  }

  const body: GeminiRequestBody | undefined =
    typeof req.body === "string" ? (safeJsonParse(req.body) as GeminiRequestBody | undefined) : req.body;

  const userQuery = body?.userQuery?.trim();
  if (!userQuery) {
    res.status(400).json({ error: "userQuery is required" });
    return;
  }

  try {
    // Avoid SDK/runtime issues on serverless by calling the Gemini REST API directly.
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: buildPrompt(userQuery) }],
            },
          ],
        }),
      }
    );

    const data = (await geminiResponse.json()) as GeminiGenerateContentResponse;

    if (!geminiResponse.ok) {
      console.error("Gemini Error:", data?.error || data);
      res.status(geminiResponse.status).json({
        error:
          data?.error?.message ||
          data?.error?.status ||
          "Gemini request failed",
      });
      return;
    }

    res.status(200).json({
      text:
        extractTextFromGeminiResponse(data) ||
        "Oops, I got distracted by a butterfly! Can you ask again? 🦋",
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini request failed" });
  }
}

