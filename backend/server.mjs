import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/ask", async (req, res) => {
  const { query } = req.body;

  try {
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: query,
        stream: false,
      }),
    });

    const data = await ollamaResponse.json();
    res.json({ response: data.response });
  } catch (error) {
    console.error("Ollama error:", error);
    res.status(500).json({ error: "AI processing failed." });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend is running at http://localhost:${port}`);
});
