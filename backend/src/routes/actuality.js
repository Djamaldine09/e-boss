const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { dbManager } = require('../db/connect');

let tableReadyPromise = null;

const ensurePostsTable = async () => {
  if (!tableReadyPromise) {
    tableReadyPromise = dbManager.connection.execute(`
      CREATE TABLE IF NOT EXISTS actuality_posts (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        images JSON NULL,
        likes INT UNSIGNED NOT NULL DEFAULT 0,
        comments INT UNSIGNED NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_actuality_posts_created_at (created_at),
        KEY idx_actuality_posts_user_id (user_id),
        CONSTRAINT fk_actuality_posts_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  try {
    await tableReadyPromise;
  } catch (error) {
    tableReadyPromise = null;
    throw error;
  }
};

const authenticate = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    );

    const [users] = await dbManager.connection.execute(
      'SELECT id, first_name, last_name, email, profile_photo FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.id]
    );

    if (users.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return null;
    }

    return users[0];
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Invalid token' });
      return null;
    }

    throw error;
  }
};

const serializePost = (post) => {
  let images = [];

  if (Array.isArray(post.images)) {
    images = post.images;
  } else if (typeof post.images === 'string' && post.images.trim()) {
    try {
      const parsed = JSON.parse(post.images);
      images = Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      images = [];
    }
  }

  return {
    id: Number(post.id),
    userId: Number(post.user_id),
    authorId: Number(post.user_id),
    author: [post.first_name, post.last_name].filter(Boolean).join(' ') || post.email,
    authorEmail: post.email,
    avatar: [post.first_name, post.last_name]
      .filter(Boolean)
      .map((value) => value.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2) || 'US',
    profilePhoto: post.profile_photo || null,
    content: post.content,
    images,
    likes: Number(post.likes || 0),
    comments: Number(post.comments || 0),
    createdAt: post.created_at
  };
};

// GET /api/actuality/posts
router.get('/posts', async (req, res) => {
  try {
    await ensurePostsTable();

    const currentUser = await authenticate(req, res);
    if (!currentUser) return;

    const [posts] = await dbManager.connection.execute(`
      SELECT
        p.id,
        p.user_id,
        p.content,
        p.images,
        p.likes,
        p.comments,
        p.created_at,
        u.first_name,
        u.last_name,
        u.email,
        u.profile_photo
      FROM actuality_posts p
      INNER JOIN users u ON u.id = p.user_id
      WHERE u.is_active = TRUE
      ORDER BY p.created_at DESC, p.id DESC
    `);

    res.json({
      posts: posts.map(serializePost),
      currentUserId: Number(currentUser.id)
    });
  } catch (error) {
    console.error('Get actuality posts error:', error);
    res.status(500).json({ error: 'Failed to load actuality posts' });
  }
});

// POST /api/actuality/posts
router.post('/posts', async (req, res) => {
  try {
    await ensurePostsTable();

    const currentUser = await authenticate(req, res);
    if (!currentUser) return;

    const { content, images } = req.body || {};
    const normalizedContent = typeof content === 'string' ? content.trim() : '';
    const normalizedImages = Array.isArray(images) ? images : [];

    if (!normalizedContent && normalizedImages.length === 0) {
      return res.status(400).json({ error: 'Veuillez ajouter du texte ou une image' });
    }

    if (normalizedImages.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 images par publication' });
    }

    const [result] = await dbManager.connection.execute(
      'INSERT INTO actuality_posts (user_id, content, images) VALUES (?, ?, ?)',
      [currentUser.id, normalizedContent, JSON.stringify(normalizedImages)]
    );

    const [rows] = await dbManager.connection.execute(`
      SELECT
        p.id,
        p.user_id,
        p.content,
        p.images,
        p.likes,
        p.comments,
        p.created_at,
        u.first_name,
        u.last_name,
        u.email,
        u.profile_photo
      FROM actuality_posts p
      INNER JOIN users u ON u.id = p.user_id
      WHERE p.id = ?
      LIMIT 1
    `, [result.insertId]);

    res.status(201).json({ post: serializePost(rows[0]) });
  } catch (error) {
    console.error('Create actuality post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// DELETE /api/actuality/posts/:id
router.delete('/posts/:id', async (req, res) => {
  try {
    await ensurePostsTable();

    const currentUser = await authenticate(req, res);
    if (!currentUser) return;

    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ error: 'Invalid post id' });
    }

    const [result] = await dbManager.connection.execute(
      'DELETE FROM actuality_posts WHERE id = ? AND user_id = ?',
      [postId, currentUser.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found or not owned by current user' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete actuality post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
