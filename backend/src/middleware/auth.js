const jwt = require('jsonwebtoken');

/**
 * Simple authentication middleware (MVP)
 */
function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Allow anonymous access for legacy/public routes only when no token is sent.
  // When a token is present, always validate it so protected routes can identify
  // the real signed-in account even when AUTH_REQUIRED is disabled.
  if (!token) {
    if (process.env.AUTH_REQUIRED !== 'true') {
      req.user = { id: null, role: 'guest' };
      return next();
    }
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

/**
 * Generate JWT token (for development/testing)
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '24h' }
  );
}

/**
 * Optional: Role-based access control
 */
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }
    next();
  };
}

module.exports = {
  authMiddleware,
  generateToken,
  requireRole,
};
