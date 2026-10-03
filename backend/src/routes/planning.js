const express = require('express');
const router = express.Router();
const { generatePlanning } = require('../providers/llm');

// POST /api/planning/generate - Generate AI-powered planning
router.post('/generate', async (req, res) => {
  const { 
    subject, 
    duration, 
    objectives, 
    level = 'intermediate',
    language = 'fr',
    preferences = {}
  } = req.body;
  
  if (!subject || !duration || !objectives) {
    return res.status(400).json({ 
      error: 'Subject, duration, and objectives are required' 
    });
  }

  try {
    const planning = await generatePlanning({
      subject,
      duration,
      objectives,
      level,
      language,
      preferences
    });
    res.json(planning);
  } catch (error) {
    console.error('Planning generation error:', error);
    res.status(500).json({ error: 'Failed to generate planning' });
  }
});

// POST /api/planning/optimize - Optimize existing planning
router.post('/optimize', async (req, res) => {
  const { planning, constraints = {}, goals = [] } = req.body;
  
  if (!planning) {
    return res.status(400).json({ error: 'Planning is required' });
  }

  try {
    const optimized = await generatePlanning({
      existingPlanning: planning,
      constraints,
      goals,
      mode: 'optimize'
    });
    res.json(optimized);
  } catch (error) {
    console.error('Planning optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize planning' });
  }
});

module.exports = router;
