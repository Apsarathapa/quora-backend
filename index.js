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
app.put('/question/:id', async (req, res) => {
  // Log incoming request for debugging - helps track what requests are being made
  console.log('🔄 PUT route hit with ID:', req.params.id);
  console.log('📝 Update data:', req.body);
  
  try {
    const questionId = req.params.id; // Extract ID from URL parameter
    const { title, detail, author } = req.body; // Destructure expected fields from request body
    
    // VALIDATION: Check if required fields are present
    // This prevents updating with empty/missing data
    if (!title || !detail || !author) {
      return res.status(400).json({ 
        error: "Title, detail, and author are required" 
      });
    }
    
    // VALIDATION: Check field lengths using same rules as your POST routes
    // Ensures data quality and consistency across your app
    if (title.trim().length < 5) {
      return res.status(400).json({ 
        error: "Title must be at least 5 characters" 
      });
    }
    
    if (detail.trim().length < 10) {
      return res.status(400).json({ 
        error: "Detail must be at least 10 characters" 
      });
    }
    
    if (author.trim().length < 2) {
      return res.status(400).json({ 
        error: "Author must be at least 2 characters" 
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

// FUNCTION: Delete a question with confirmation
// Handles the delete button click with user confirmation
async function deleteQuestion(questionId) {
  // CONFIRMATION: Ask user to confirm before deleting
  // This prevents accidental deletions
  const confirmed = confirm("Are you sure you want to delete this question? This action cannot be undone.");
  
  if (!confirmed) {
    // User clicked "Cancel" - do nothing
    return;
  }
  
  try {
    // LOADING STATE: Show user that deletion is in progress
    const deleteBtn = event.target;
    const originalText = deleteBtn.textContent;
    deleteBtn.textContent = "Deleting...";
    deleteBtn.disabled = true;
    
    // API CALL: Send DELETE request to backend
    const response = await fetch(`http://localhost:3000/question/${questionId}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // SUCCESS: Question was deleted successfully
      alert("Question deleted successfully!");
      
      // RELOAD: Refresh the questions list to show updated data
      loadRealQuestions();
    } else {
      // ERROR: Backend returned an error
      alert(`Error deleting question: ${data.error}`);
      
      // Restore button state
      deleteBtn.textContent = originalText;
      deleteBtn.disabled = false;
    }
  } catch (error) {
    // NETWORK ERROR: Could not reach the server
    console.error('Error deleting question:', error);
    alert('Network error: Unable to delete question');
    
    // Restore button state
    const deleteBtn = event.target;
    deleteBtn.textContent = "🗑️ Delete";
    deleteBtn.disabled = false;
  }
}

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