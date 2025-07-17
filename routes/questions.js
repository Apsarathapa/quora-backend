console.log('questions.js routes loaded');
const express = require('express');
const router = express.Router();
const Question = require('../models/questions');

// Validation function
function validateQuestion({ title, detail, author }) {
 if (!title || title.trim().length < 5) {
   return 'Title is required and must be at least 5 characters.';
 }
 if (!detail || detail.trim().length < 10) {
   return 'Detail is required and must be at least 10 characters.';
 }
 if (!author || author.trim().length < 2) {
   return 'Author is required and must be at least 2 characters.';
 }
 return null;
}

// GET all questions
router.get('/', async (req, res) => {
 try {
   const questions = await Question.find();
   res.status(200).json(questions);
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
});

// POST route to add a question
router.post('/', async (req, res) => {
 try {
   const { title, detail, author } = req.body;
   const question = new Question({ title, detail, author });
   const saved = await question.save();
   res.status(201).json(saved);
 } catch (error) {
   res.status(400).json({ message: error.message });
 }
});

// POST /ask route
router.post('/ask', async (req, res) => {
 console.log('POST /ask hit');
 console.log('Request body:', req.body);
 
 const { title, detail, author } = req.body;
 
 try {
   const validationError = validateQuestion({ title, detail, author });
   
   if (validationError) {
     console.log('Validation failed:', validationError);
     return res.status(400).json({ error: validationError });
   }
   
   console.log('Creating question...');
   const question = new Question({ title, detail, author });
   
   const savedQuestion = await question.save();
   console.log('Question saved successfully');
   
   res.status(201).json({ message: 'Question submitted successfully!', question: savedQuestion });
 } catch (err) {
   console.error('Error saving question:', err.message);
   res.status(500).json({ error: 'Server error. Please try again later.' });
 }
});

// Debug route
router.post('/debug', (req, res) => {
 res.json({ status: 'Route works!' });
});

module.exports = router;



// console.log('questions.js routes loaded');
// const express = require('express');
// const router = express.Router();
// const Question = require('../models/questions'); // ADD THIS LINE - Import the Question model

// // ADDED THIS VALIDATION FUNCTION
// function validateQuestion({ title, detail, author }) {
//   if (!title || title.trim().length < 5) {
//     return 'Title is required and must be at least 5 characters.';
//   }
//   if (!detail || detail.trim().length < 10) {
//     return 'Detail is required and must be at least 10 characters.';
//   }
//   if (!author || author.trim().length < 2) {
//     return 'Author is required and must be at least 2 characters.';
//   }
//   return null; // No errors
// }

// // GET all questions
// router.get('/', async (req, res) => {
//   try {
//     const questions = await Question.find();
//     res.status(200).json(questions);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // POST route to add a question
// router.post('/', async (req, res) => {
//   try {
//     const { title, description, tags } = req.body;
//     const question = new Question({ title, description: details, author });
//     const saved = await question.save();
//     res.status(201).json(saved);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });


// // POST /questions/ask
// router.post('/ask', async (req, res) => {
//   console.log('🚀 === POST /ask endpoint hit ===');
//   console.log('📦 Request body:', req.body);
//   console.log('📋 Headers:', req.headers);
  
//   const { title, detail, author } = req.body;
  
//   console.log('🔍 Extracted data:', { title, detail, author });
//   console.log('✅ validateQuestion function exists:', typeof validateQuestion);
  
//   try {
//     // Use validation function
//     const validationError = validateQuestion({ title, detail, author });
//     console.log('📝 Validation result:', validationError);
    
//     if (validationError) {
//       console.log('❌ Validation failed:', validationError);
//       return res.status(400).json({ error: validationError });
//     }
    
//     console.log('✅ Validation passed, creating question...');
//     console.log('💾 Question model available:', !!Question);
    
//     // If valid, proceed to save question
//     const question = new Question({ title, detail, author });
//     console.log('📄 Question object created:', question);

//     const savedQuestion = await question.save();
//     console.log('🎉 Question saved successfully:', savedQuestion);
    
//     res.status(201).json({ message: 'Question submitted successfully!', question: savedQuestion });
//   } catch (err) {
//     console.error('❌ DETAILED ERROR:');
//     console.error('Error name:', err.name);
//     console.error('Error message:', err.message);
//     console.error('Stack trace:', err.stack);
//     console.error('Full error object:', err);
    
//     res.status(500).json({ error: 'Server error. Please try again later.' });
//   }
// });



// // router.post('/ask', async (req, res) => {
// //   const { title, detail, author } = req.body;

// //   if (!title || title.trim().length < 5) {
// //     return res.status(400).json({ error: 'Title is required and must be at least 5 characters.' });
// //   }

// //   if (!detail || detail.trim().length < 10) {
// //     return res.status(400).json({ error: 'Detail is required and must be at least 10 characters.' });
// //   }

// //   if (!author || author.trim() === "") {
// //     return res.status(400).json({ error: 'Author is required.' });
// //   }

// //   // If valid, save to DB
// //   try {
// //     const question = new Question({ title, detail, author });
// //     const saved = await question.save();
// //     res.status(201).json(saved);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to save question.' });
// //   }
// // });


// // Add this route for testing
// router.post('/simple-test', (req, res) => {
//   console.log('Simple test route hit');
//   console.log('Body:', req.body);
//   res.json({ message: 'Simple test works', data: req.body });
// });

// // Optional test route
// router.post('/debug', (req, res) => {
//   res.json({ status: 'Route works!' });
// });

// module.exports = router;






