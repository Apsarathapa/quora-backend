const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB error:', err));

// Use the routes
app.use('/questions', require('./routes/questions'));

// Route: POST /submit (example route for form submissions)
app.post('/submit', (req, res) => {
  const { name, message } = req.body;
  console.log('Received:', req.body);
  res.send(`Received message from ${name}: ${message}`);
});

// Simple GET routes for pages
app.get('/', (req, res) => {
  res.send('Hello from the Quora Home Page!');
});

app.get('/about', (req, res) => {
  res.send('Welcome to the Quora About Page!');
});

app.get('/contact', (req, res) => {
  res.send('This is the Contact Page.');
});

app.get('/services', (req, res) => {
  res.send('Here are our Services!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
