import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Add your Groq API key in .env.local
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, tone, length } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const prompt = `Write a ${length || "10mins"} YouTube script on: "${title}". 
Tone: ${tone || "engaging, storytelling"}.
Include a strong hook, context, tension, climax, and outro. Use immersive narration with big paragraphs.`;

    // Groq API call
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192", // or another Groq-supported model
      messages: [
        { role: "system", content: "You are an expert YouTube script writer." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const script = completion.choices[0]?.message?.content || "";

    res.status(200).json({ script });
  } catch (err) {
    console.error("Groq API error:", err);

    if (err.status === 429) {
      res.status(429).json({ error: "❌ API quota exceeded. Please try again later." });
    } else {
      res.status(500).json({ error: "❌ Failed to generate script." });
    }
  }
}
