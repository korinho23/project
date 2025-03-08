// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint az Ollama-val való kommunikációhoz
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    
    // Ollama API hívás (alapértelmezetten a localhost:11434-en fut)
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'llama2', // vagy más modell, amit telepítettél
        prompt: prompt,
        stream: false
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Ollama:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint a kép elemzéshez
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageData, model } = req.body;
    
    // Ollama API hívás képanalizáláshoz
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'llava', // Multimodális modell képekhez
        prompt: "Analyze this image and suggest a Stable Diffusion prompt that would create a similar image. Include composition, lighting, colors, and style details.",
        images: [imageData.replace(/^data:image\/\w+;base64,/, '')], // Base64 képadat
        stream: false
      }),
    });

    const data = await response.json();
    
    // Eredmény feldolgozása
    const analysisResult = {
      composition: "Based on AI analysis",
      lighting: "Based on AI analysis",
      colors: "Based on AI analysis", 
      style: "Based on AI analysis",
      suggestedPrompt: data.response || "No suggestion available"
    };
    
    res.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint a modellek lekérdezéséhez
app.get('/api/models', async (req, res) => {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});