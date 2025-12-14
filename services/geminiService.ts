type GeminiApiResponse = {
  text?: string;
  error?: string;
};

export const getGiftRecommendation = async (
  userQuery: string
): Promise<string> => {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userQuery }),
    });

    const contentType = response.headers.get("content-type") || "";
    const data: GeminiApiResponse = contentType.includes("application/json")
      ? await response.json()
      : { error: await response.text() };

    if (!response.ok) {
      if (response.status === 404) {
        return "Chat backend chưa chạy. Nếu bạn đang dev local, hãy chạy bằng `npx vercel dev` (hoặc deploy lên Vercel) để dùng AI chat.";
      }
      if (data?.error === "Missing GEMINI_API_KEY") {
        return "I'm sorry, my brain (API Key) is missing right now! Please try again later.";
      }
      return (
        data?.error ||
        "I'm having a little trouble connecting to the gift universe right now. 🌧️"
      );
    }

    return (
      data?.text || "Oops, I got distracted by a butterfly! Can you ask again? 🦋"
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting to the gift universe right now. 🌧️";
  }
};
