const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = 5000;

// Configure multer to save uploads in the correct directory
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

// Initialize OpenAI API client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

app.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the file path
    const filePath = path.join(__dirname, '../uploads', req.file.filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const completion = await openai.completions.create({
      model: 'gpt-3.5-turbo',  
      prompt: `Summarize the following text:\n\n${fileContent}`,
      max_tokens: 1000
    });

    res.json({ summary: completion.choices[0].text });
  } catch (error) {
    console.error('Error analyzing text:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
