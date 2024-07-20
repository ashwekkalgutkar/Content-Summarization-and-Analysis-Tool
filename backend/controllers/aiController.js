const { OpenAIApi, ChatCompletionRequestMessage } = require('openai');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = 5000;

const upload = multer({ dest: 'uploads/' });

// Initialize OpenAIApi directly with the API key
const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Use createChatCompletion for the latest API
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Summarize the following text:\n\n${fileContent}` }],
      max_tokens: 1000,
    });

    res.json({ summary: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('Error analyzing text:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
