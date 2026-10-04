const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();
const { dbManager } = require('../db/connect');

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  let connection;

  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const pool = dbManager.connection;
    connection = await pool.getConnection();

    // Check if user already exists on the same connection that will run
    // the transaction, then release it immediately on the conflict path.
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Keep ALL writes in the same transaction/connection.
    await connection.beginTransaction();

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [result] = await connection.execute(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, level, preferences)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, passwordHash, 'student', 'beginner', '{}']
    );

    const token = jwt.sign(
      {
        id: result.insertId,
        email,
        role: 'student',
        firstName,
        lastName
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Store only a SHA-256 digest of the JWT in the database.
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // IMPORTANT: use the transaction connection here, not pool.execute().
    // pool.execute() could use another connection and wait for the uncommitted
    // users row, causing ER_LOCK_WAIT_TIMEOUT when session_tokens has a FK.
    await connection.execute(
      'INSERT INTO session_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [result.insertId, tokenHash, new Date(Date.now() + 24 * 60 * 60 * 1000)]
    );

    await connection.commit();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        role: 'student',
        level: 'beginner'
      }
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (_) {
        // Ignore rollback errors when no transaction is active.
      }
    }

    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user
    const pool = dbManager.connection;
    const [users] = await pool.execute(
      'SELECT id, first_name, last_name, email, password_hash, role, level FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Store only a SHA-256 digest of the JWT in the database.
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await pool.execute(
      'INSERT INTO session_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, tokenHash, new Date(Date.now() + 24 * 60 * 60 * 1000)]
    );

    // Update last login
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        level: user.level
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const pool = dbManager.connection;
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      await pool.execute(
        'UPDATE session_tokens SET is_active = FALSE WHERE token_hash = ?',
        [tokenHash]
      );
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    const pool = dbManager.connection;
    const [users] = await pool.execute(
      'SELECT id, first_name, last_name, email, role, level, preferences, profile_photo, created_at, last_login FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        level: user.level,
        preferences: user.preferences,
        profile_photo: user.profile_photo || null,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// PUT /api/auth/me - Update user profile
router.put('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const { firstName, lastName, level, preferences } = req.body;

    const pool = dbManager.connection;

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (firstName !== undefined) {
      updates.push('first_name = ?');
      values.push(firstName);
    }
    if (lastName !== undefined) {
      updates.push('last_name = ?');
      values.push(lastName);
    }
    if (level !== undefined) {
      updates.push('level = ?');
      values.push(level);
    }
    if (preferences !== undefined) {
      updates.push('preferences = ?');
      values.push(JSON.stringify(preferences));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(decoded.id);

    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated user info
    const [users] = await pool.execute(
      'SELECT id, first_name, last_name, email, role, level, preferences FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        level: user.level,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
