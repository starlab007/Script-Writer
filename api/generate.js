import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client with API key from .env.local
const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, // Add CLAUDE_API_KEY to your env file
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, tone, length } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const prompt = `Write a ${length || "10mins"} YouTube script on: "${title}". 
Tone: ${tone || "engaging, storytelling"}.
Include a strong hook, context, tension, climax, and outro. Use immersive narration with big paragraphs.`;

    const response = await client.messages.create({
      model: 'claude-3-sonnet-20240229', // Or claude-3-opus for higher quality
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt },
      ],
    });

    res.status(200).json({ script: response.content[0].text });
  } catch (err) {
    console.error(err);

    // Handle Anthropic quota or rate limit errors
    if (err.status === 429) {
      res.status(429).json({ error: '❌ API quota exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: '❌ Failed to generate script.' });
    }
  }
}
