const express = require('express');
const router = express.Router();
const { generateTutorFeedback } = require('../providers/llm');
const { initSSE, sendSSE, closeSSE } = require('../utils/sse');

// POST /api/tutor/feedback - Get AI tutor feedback with streaming
router.post('/feedback', async (req, res) => {
  const { question, answer, context } = req.body;
  
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }

  // Initialize SSE connection
  const sseId = initSSE(res);
  
  try {
    // Stream AI feedback
    await generateTutorFeedback({ question, answer, context }, (chunk) => {
      sendSSE(sseId, 'feedback', chunk);
    });
    
    // Send completion signal
    sendSSE(sseId, 'done', { message: 'Feedback complete' });
    closeSSE(sseId);
  } catch (error) {
    console.error('Tutor feedback error:', error);
    sendSSE(sseId, 'error', { message: 'Failed to generate feedback' });
    closeSSE(sseId);
  }
});

module.exports = router;
