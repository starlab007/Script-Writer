import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, tone, length } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Build the prompt directly with the values sent from frontend
    const prompt = `Write a ${length} YouTube script on: "${title}".
Tone: ${tone}.
The script should include a strong hook, context, tension, climax, and outro with immersive narration and long, flowing paragraphs.
Important: Do NOT include any headings, section titles, timestamps, or labels. Write it as one continuous narrative with only plain paragraphs.`;

    const completion = await client.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are a professional YouTube script writer. Always output raw narrative paragraphs without any headings or timestamps.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
    });

    const script = completion.choices?.[0]?.message?.content || "";

    return res.status(200).json({ script });
  } catch (error) {
    console.error("Groq API Error:", error);
    return res.status(500).json({
      error: "Failed to generate script",
      details: error?.message || "Unknown error",
    });
  }
}
