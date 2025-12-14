// Vercel Serverless Function: /api/gemini
// Kept as plain ESM JavaScript to avoid TS/ESM/CJS runtime mismatches on Vercel.

const PRODUCTS = [
  {
    id: "1",
    name: "Set 1 - Hộp quà 60k",
    price: 60000,
    category: "box",
    description:
      "Set quà 60k nhỏ gọn, có đủ thiệp và đồ xinh để tặng nhanh.",
  },
  {
    id: "2",
    name: "Set 2 - Hộp quà 80k",
    price: 80000,
    category: "box",
    description:
      "Set 80k với phụ kiện và snack xinh xắn, phù hợp tặng bạn bè.",
  },
  {
    id: "3",
    name: "Set 3 - Hộp quà 100k",
    price: 100000,
    category: "box",
    description: "Set 100k cân bằng đồ trang trí và bánh kẹo, tặng sinh nhật.",
  },
  {
    id: "4",
    name: "Set 4 - Hộp quà 120k",
    price: 120000,
    category: "box",
    description:
      "Set 120k đủ đầy hơn, thích hợp dịp đặc biệt mà vẫn tiết kiệm.",
  },
  {
    id: "5",
    name: "Hoa gấu bông",
    price: 15000,
    category: "bouquet",
    description: "Hoa hình gấu bông đáng yêu, phù hợp tặng người thương.",
  },
];

function buildPrompt(userQuery) {
  const productContext = PRODUCTS.map(
    (p) =>
      `- ${p.name} (${p.category}): ${p.price} VND. Description: ${p.description}`
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

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function safeJsonParse(value) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

async function getRequestBody(req) {
  if (req?.body != null) {
    return typeof req.body === "string" ? safeJsonParse(req.body) : req.body;
  }

  // Fallback: read the raw stream
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};

  const text = Buffer.concat(chunks).toString("utf8");
  return safeJsonParse(text) || {};
}

function extractTextFromGeminiResponse(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return undefined;
  const text = parts.map((p) => p?.text || "").join("").trim();
  return text || undefined;
}

export default async function handler(req, res) {
  try {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.end();
      return;
    }

    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method Not Allowed" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      sendJson(res, 500, { error: "Missing GEMINI_API_KEY" });
      return;
    }

    const body = await getRequestBody(req);
    const userQuery = (body?.userQuery || "").toString().trim();
    if (!userQuery) {
      sendJson(res, 400, { error: "userQuery is required" });
      return;
    }

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

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini Error:", data?.error || data);
      sendJson(res, geminiResponse.status, {
        error:
          data?.error?.message ||
          data?.error?.status ||
          "Gemini request failed",
      });
      return;
    }

    sendJson(res, 200, {
      text:
        extractTextFromGeminiResponse(data) ||
        "Oops, I got distracted by a butterfly! Can you ask again? 🦋",
    });
  } catch (error) {
    console.error("Gemini Function Crash:", error);
    sendJson(res, 500, { error: "Function crashed" });
  }
}

