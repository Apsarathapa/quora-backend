// testserver.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // to parse JSON body

// Test route
app.get('/test', (req, res) => {
  res.send('Test route works!');
});

// POST route
app.post('/questions', (req, res) => {
  console.log('Received POST /questions:', req.body);
  res.status(201).json({ message: 'Received question', data: req.body });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

