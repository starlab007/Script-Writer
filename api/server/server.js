import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Generate YouTube script
app.post("/api/generate", async (req, res) => {
  const { title, tone, length } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional YouTube scriptwriter." },
        { 
          role: "user", 
          content: `Write a ${length} YouTube script on: "${title}". Tone: ${tone || "engaging, storytelling"}. Include hook, context, tension, climax, outro.` 
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    res.json({ script: response.choices[0].message.content });

  } catch (err) {
    console.error(err);

    // Handle quota / rate limit errors
    if (err.code === 'insufficient_quota' || err.status === 429) {
      res.status(429).json({ error: "API quota exceeded. Please try again later." });
    } else {
      res.status(500).json({ error: "Failed to generate script." });
    }
  }
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
