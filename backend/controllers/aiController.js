const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = 5000;

const upload = multer({ dest: 'uploads/' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
app.use(cors());
app.use(express.json());

app.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Summarize the following text:\n\n${fileContent}`,
      max_tokens: 1000,
    });

    res.json({ summary: completion.data.choices[0].text });
  } catch (error) {
    console.error('Error analyzing text:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
