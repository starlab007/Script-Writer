import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, tone, length } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const prompt = `Write a ${length || "10mins"} YouTube script on: "${title}". Tone: ${
      tone || "engaging, storytelling"
    }. Include hook, context, tension, climax, outro.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional YouTube scriptwriter." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    res.status(200).json({ script: response.choices[0].message.content });
  } catch (err) {
    console.error(err);

    // Handle OpenAI quota or rate limit errors
    if (err.code === "insufficient_quota" || err.status === 429) {
      res.status(429).json({ error: "❌ API quota exceeded. Please try again later." });
    } else {
      res.status(500).json({ error: "❌ Failed to generate script." });
    }
  }
}
