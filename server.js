const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// ensure images folder exists
const imageDir = path.join(__dirname, 'images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

// upload route
app.post('/upload', (req, res) => {
  try {
    const base64Data = req.body.img.replace(/^data:image\/jpeg;base64,/, "");
    const fileName = `${Date.now()}.jpg`;
    const filePath = path.join(imageDir, fileName);

    fs.writeFileSync(filePath, base64Data, 'base64');

    console.log("📸 Image saved:", fileName);

    res.send({ status: 'saved' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving image");
  }
});

// health check (important for deployment)
app.get('/health', (req, res) => {
  res.send("OK");
});

// PORT fix for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});