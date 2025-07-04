const express = require('express');
const cors = require('cors'); // <-- import cors
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const extractText = require('./services/extract');
const parseWithGemini = require('./services/parser');
const connectToMongo=require('./db')

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // <-- enable CORS for all origins

app.use(express.json());
connectToMongo();
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const originalName = req.file.originalname;

    const extractedText = await extractText(filePath, originalName);
    fs.unlink(filePath, () => {});

    const parsedData = await parseWithGemini(extractedText);

    res.json({ parsedData });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


app.use('/api/auth',require('./routes/auth'))