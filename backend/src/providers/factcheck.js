const axios = require('axios');

/**
 * Google Fact Check API integration
 */
const factCheckApi = axios.create({
  baseURL: 'https://factchecktools.googleapis.com/v1alpha1',
  params: {
    key: process.env.GOOGLE_FACT_CHECK_API_KEY,
  },
});

/**
 * Fact check a claim using Google Fact Check API
 */
async function factCheckClaim(claim, language = 'fr', searchOnly = false) {
  try {
    if (searchOnly) {
      // Search for existing fact checks
      const response = await factCheckApi.get('/claims:search', {
        params: {
          query: claim,
          languageCode: language,
          pageSize: 10,
        },
      });
      
      return {
        success: true,
        results: response.data.claims || [],
        total: response.data.claims?.length || 0,
      };
    } else {
      // Create a new fact check request
      const response = await factCheckApi.post('/claims', {
        claim: claim,
        languageCode: language,
      });
      
      return {
        success: true,
        claimId: response.data.claim?.id,
        status: 'submitted',
        message: 'Fact check request submitted successfully',
      };
    }
  } catch (error) {
    console.error('Google Fact Check API error:', error.response?.data || error.message);
    
    // Fallback to mock response for development
    return {
      success: false,
      error: 'API unavailable',
      fallback: {
        claim,
        status: 'unverified',
        recommendation: 'Please verify this claim manually using reliable sources.',
        sources: [
          'https://reuters.com',
          'https://apnews.com',
          'https://bbc.com/factcheck'
        ]
      }
    };
  }
}

/**
 * Get fact check results by ID
 */
async function getFactCheckResults(claimId) {
  try {
    const response = await factCheckApi.get(`/claims/${claimId}`);
    
    return {
      success: true,
      results: response.data,
    };
  } catch (error) {
    console.error('Get fact check results error:', error.response?.data || error.message);
    throw new Error('Failed to retrieve fact check results');
  }
}

/**
 * Search for fact checks by publisher
 */
async function searchFactChecksByPublisher(publisherName, language = 'fr') {
  try {
    const response = await factCheckApi.get('/claims:search', {
      params: {
        publisherName: publisherName,
        languageCode: language,
        pageSize: 20,
      },
    });
    
    return {
      success: true,
      results: response.data.claims || [],
      total: response.data.claims?.length || 0,
    };
  } catch (error) {
    console.error('Publisher search error:', error.response?.data || error.message);
    throw new Error('Failed to search fact checks by publisher');
  }
}

module.exports = {
  factCheckClaim,
  getFactCheckResults,
  searchFactChecksByPublisher,
};
