const express = require('express');
const multer = require('multer');
const { analyzeText } = require('../controllers/aiController');
const uploadMiddleware = require('../middleware/uploadmiddleware');

const router = express.Router();

router.post('/summarize', uploadMiddleware.single('file'), analyzeText);

module.exports = router;
