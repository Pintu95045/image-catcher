const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

const imageDir = path.join(__dirname, 'images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

app.post('/upload', (req, res) => {
  try {
    const base64Data = req.body.img.replace(/^data:image\/jpeg;base64,/, "");
    const fileName = `${Date.now()}.jpg`;
    const filePath = path.join(imageDir, fileName);

    fs.writeFileSync(filePath, base64Data, 'base64');

    console.log("📸 Saved:", fileName);

    res.send({ status: 'saved' });
  } catch (err) {
    res.status(500).send("Error");
  }
});

app.get('/health', (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));