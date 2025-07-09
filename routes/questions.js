console.log('questions.js routes loaded'); 

// routes/questions.js
const express = require('express');
const router = express.Router();
const Question = require('../models/questions');

// GET all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SEARCH questions
// router.get('/search', async (req, res) => {
//   const query = req.query.q || '';
//   console.log("Search endpoint hit. Query:", query);
//   try {
//     const questions = await Question.find({
//       title: { $regex: query, $options: 'i' }
//     });
//     res.status(200).json(questions);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// POST route to add a question
router.post('/', async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const question = new Question({ title, description, tags });
    const saved = await question.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
