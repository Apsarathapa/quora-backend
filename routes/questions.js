console.log('questions.js routes loaded');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
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

// GET single question by ID
router.get('/:id', async (req, res) => {
  // Log the request parameter ID to console
  console.log('GET /question/:id hit with ID:', req.params.id);
  
  try {
    const questionId = req.params.id;
    
    // Check for invalid/missing ID
    if (!questionId) {
      console.log('❌ No ID provided');
      return res.status(400).json({ error: 'Question ID is required' });
    }
    
    // Check if ID is a valid MongoDB ObjectId format
    if (!questionId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('❌ Invalid ID format:', questionId);
      return res.status(400).json({ error: 'Invalid question ID format' });
    }
    
    // Find question by ID
    const question = await Question.findById(questionId);
    
    // Check if question was found
    if (!question) {
      console.log('❌ Question not found with ID:', questionId);
      return res.status(404).json({ error: 'Question not found' });
    }
    
    // Success - return the question
    console.log('✅ Question found:', question.title);
    res.status(200).json(question);
    
  } catch (error) {
    // Handle any other errors (database errors, etc.)
    console.error('❌ Server error in GET /question/:id:', error.message);
    res.status(500).json({ error: 'Server error while fetching question' });
  }
});


// Debug route
router.post('/debug', (req, res) => {
 res.json({ status: 'Route works!' });
});

module.exports = router;

