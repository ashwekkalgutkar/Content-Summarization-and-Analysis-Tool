const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { analyzeText } = require('./controllers/aiController');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });
app.post('/analyze', upload.single('file'), analyzeText);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});