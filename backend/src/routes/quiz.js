const express = require('express');
const router = express.Router();
const { generateQuizQuestions } = require('../providers/llm');

// POST /api/quiz/generate - Generate quiz questions using AI
router.post('/generate', async (req, res) => {
  const { topic, difficulty = 'medium', questionCount = 5, language = 'fr' } = req.body;
  
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const quiz = await generateQuizQuestions({
      topic,
      difficulty,
      questionCount,
      language
    });
    res.json(quiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz questions' });
  }
});

// POST /api/quiz/validate - Validate quiz answers
router.post('/validate', async (req, res) => {
  const { questions, answers } = req.body;
  
  if (!questions || !answers || questions.length !== answers.length) {
    return res.status(400).json({ error: 'Questions and answers arrays are required and must be the same length' });
  }

  try {
    const results = await generateQuizQuestions({
      questions,
      answers,
      mode: 'validation'
    });
    res.json(results);
  } catch (error) {
    console.error('Quiz validation error:', error);
    res.status(500).json({ error: 'Failed to validate quiz answers' });
  }
});

module.exports = router;
