console.log('This is the REAL index.js being run');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors({ //Allow frontend to talk to backend
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'null' // for file:// protocol if needed
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json()); // Needed to parse JSON body


app.get('/ping', (req, res) => {
  res.send('Server is alive!');
});


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB error:', err));


const Question = require('./models/questions.js');
const questionRoutes = require('./routes/questions')
console.log('Question:', Question);
app.use('/questions', questionRoutes);


//Adding search routes in Express
app.get('/search', async (req, res) => {
  const query = req.query.q || '';
  try {
    const questions = await Question.find({
      title: { $regex: query, $options: 'i' }
    });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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


app.get('/searchtest', (req, res) => {
  res.send('Search test route works!');
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});




// // //xx Sample POST route for testing
// // app.post('/questions', async (req, res) => {
// //   try {
// //     const question = new Question(req.body);
// //     const saved = await question.save();
// //     res.status(201).json(saved);
// //   } catch (e) {
// //     res.status(400).json({ message: e.message });
// //   }
// // });