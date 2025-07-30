console.log('This is the REAL index.js being run');
const mongoose = require('mongoose');
console.log(' MONGODB_URI from environment:', process.env.MONGODB_URI);
console.log('Full connection string being used:', process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydatabase');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // instead of const PORT = 3000; process.env.PORT assigns the port dynamically
console.log('PORT from environment:', process.env.PORT);
console.log('Using PORT:', PORT);
app.use(cors({ //Allow frontend to talk to backend
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3009',
    'http://localhost:60200',
    'http://localhost:50931',
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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydatabase')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB error:', err));


const Question = require('./models/questions.js');
const questionRoutes = require('./routes/questions')
console.log('Question:', Question);
app.use('/questions', questionRoutes);

// Direct DELETE route for testing
app.delete('/question/:id', async (req, res) => {
  console.log('🗑️ Direct DELETE route hit with ID:', req.params.id);
  try {
    const result = await Question.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json({ message: "Deleted!", deletedQuestion: result });
  } catch (e) {
    console.error('Delete error:', e);
    res.status(400).json({ error: "Invalid ID or server error" });
  }
});

// Test DELETE route
app.delete('/test-delete', (req, res) => {
  console.log('🧪 Test DELETE route hit');
  res.json({ message: 'DELETE method is working!' });
});

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

// PUT route for updating questions
// app.put('/question/:id', async (req, res) => {
//   // Log incoming request for debugging - helps track what requests are being made
//   console.log('🔄 PUT route hit with ID:', req.params.id);
//   console.log('📝 Update data:', req.body);
  
//   try {
//     const questionId = req.params.id; // Extract ID from URL parameter
//     const { title, detail, author } = req.body; // Destructure expected fields from request body
    
//     // VALIDATION: Check if required fields are present
//     // This prevents updating with empty/missing data
//     if (!title || !detail || !author) {
//       return res.status(400).json({ 
//         error: "Title, detail, and author are required" 
//       });
//     }
    
//     // VALIDATION: Check field lengths using same rules as your POST routes
//     // Ensures data quality and consistency across your app
//     if (title.trim().length < 5) {
//       return res.status(400).json({ 
//         error: "Title must be at least 5 characters" 
//       });
//     }
    
//     if (detail.trim().length < 10) {
//       return res.status(400).json({ 
//         error: "Detail must be at least 10 characters" 
//       });
//     }
    
//     if (author.trim().length < 2) {
//       return res.status(400).json({ 
//         error: "Author must be at least 2 characters" 
//       });
//     }

app.post('/questions/ask', async (req, res) => {
  console.log('POST /ask hit');
  console.log('Request body:', req.body);
  
  const { title, detail, author, category, tags, email, anonymous } = req.body;
  
  try {
    const validationError = validateQuestion({ title, detail, author });
    
    if (validationError) {
      console.log('Validation failed:', validationError);
      return res.status(400).json({ error: validationError });
    }
    
    console.log('Creating question...');
    
    // Convert tags string to array if provided
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    const question = new Question({ 
      title, 
      detail, 
      author: anonymous ? 'Anonymous' : author,
      category,
      tags: tagsArray
    });
    
    const savedQuestion = await question.save();
    console.log('Question saved successfully');
    
    res.status(201).json({ message: 'Question submitted successfully!', question: savedQuestion });
  } catch (err) {
    console.error('Error saving question:', err.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});
    
// PUT route for updating questions
app.put('/question/:id', async (req, res) => {
  console.log('🔄 PUT route hit with ID:', req.params.id);
  console.log('📝 Update data:', req.body);
  
  try {
    const questionId = req.params.id;
    const { title, detail, author } = req.body;
    
    // Validate required fields
    if (!title || !detail || !author) {
      return res.status(400).json({ 
        error: "Title, detail, and author are required" 
      });
    }
    
    // UPDATE OPERATION: Use findByIdAndUpdate to modify the document
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId, // Which document to update (by ID)
      {
        // What fields to update - trim() removes extra whitespace
        title: title.trim(),
        detail: detail.trim(),
        author: author.trim(),
        updatedAt: new Date() // Add timestamp for when it was last modified
      },
      {
        new: true, // Return the UPDATED document (not the old one)
        runValidators: true // Run mongoose schema validators during update
      }
    );
    
    // CHECK IF DOCUMENT EXISTS: findByIdAndUpdate returns null if ID not found
    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }
    
    // SUCCESS: Log and return the updated question
    console.log('✅ Question updated successfully:', updatedQuestion.title);
    res.json({
      message: "Question updated successfully!",
      question: updatedQuestion
    });
    
  } catch (e) {
    // ERROR HANDLING: Different types of errors need different responses
    console.error('❌ Update error:', e);
    
    // MONGOOSE VALIDATION ERROR: Schema-level validation failed
    if (e.name === 'ValidationError') {
      return res.status(400).json({
        error: "Validation failed: " + Object.values(e.errors).map(err => err.message).join(', ')
      });
    }
    
    // INVALID OBJECTID ERROR: ID format is wrong (not 24-character hex)
    if (e.name === 'CastError') {
      return res.status(400).json({ error: "Invalid question ID format" });
    }
    
    // GENERIC SERVER ERROR: Database connection issues, etc.
    res.status(500).json({ error: "Server error while updating question" });
  }
});

// GET route for fetching individual question by ID
app.get('/question/:id', async (req, res) => {
  console.log('📖 GET route hit for question ID:', req.params.id);
  
  try {
    const questionId = req.params.id;
    
    // Find question by ID
    const question = await Question.findById(questionId);
    
    // Check if question exists
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    
    // Return the question data
    console.log('✅ Question found:', question.title);
    res.json(question);
    
  } catch (e) {
    console.error('❌ GET question error:', e);
    
    // Invalid ID format
    if (e.name === 'CastError') {
      return res.status(400).json({ error: "Invalid question ID format" });
    }
    
    // Server error
    res.status(500).json({ error: "Server error while fetching question" });
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