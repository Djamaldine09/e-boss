const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware by IP
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Stricter rate limiting for AI endpoints
 */
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 AI requests per windowMs
  message: {
    error: 'Too many AI requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Very strict rate limiting for expensive operations
 */
const strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: {
    error: 'Rate limit exceeded for this operation. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Apply rate limiting based on endpoint
 */
function customRateLimit(req, res, next) {
  // Apply stricter limits to AI endpoints
  if (req.path.includes('/api/tutor/') || req.path.includes('/api/quiz/generate')) {
    return aiRateLimiter(req, res, next);
  }
  
  // Apply strict limits to planning generation
  if (req.path.includes('/api/planning/generate')) {
    return strictRateLimiter(req, res, next);
  }
  
  // Default rate limiting for other endpoints
  return rateLimiter(req, res, next);
}

module.exports = customRateLimit;
