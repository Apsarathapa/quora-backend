const express = require('express');
const app = express();
const PORT = 3000;

//For curl POST request
app.use(express.json()); // Middleware to parse JSON body

app.post('/submit', (req, res) => {
  const { name, message } = req.body;
  console.log('Received:', req.body); // Log to terminal
  res.send(`✅ Received message from ${name}: ${message}`);
});

// Home route
app.get('/', (req, res) => {
  res.send('Hello from the Quora Home Page!');
});

// About route
app.get('/about', (req, res) => {
  res.send('Welcome to the Quora About Page!');
});

// Contact route
app.get('/contact', (req, res) => {
  res.send('This is the Contact Page.');
});

// Services route
app.get('/services', (req, res) => {
  res.send('Here are our Services!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
