const express = require('express');
const router = express.Router();
const { factCheckClaim } = require('../providers/factcheck');

// POST /api/fact-check - Verify claim using Google Fact Check API
router.post('/', async (req, res) => {
  const { claim, language = 'fr' } = req.body;
  
  if (!claim) {
    return res.status(400).json({ error: 'Claim is required' });
  }

  try {
    const result = await factCheckClaim(claim, language);
    res.json(result);
  } catch (error) {
    console.error('Fact check error:', error);
    res.status(500).json({ error: 'Failed to verify claim' });
  }
});

// GET /api/fact-check/search - Search for fact checks
router.get('/search', async (req, res) => {
  const { query, language = 'fr' } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const results = await factCheckClaim(query, language, true);
    res.json(results);
  } catch (error) {
    console.error('Fact check search error:', error);
    res.status(500).json({ error: 'Failed to search fact checks' });
  }
});

module.exports = router;
