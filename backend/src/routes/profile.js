const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { dbManager } = require('../db/connect');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/profiles');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Seuls les fichiers JPEG, PNG et GIF sont autorisés'), false);
  }
});

const getUserId = (req, res) => {
  const id = Number(req.user?.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(401).json({ error: 'Utilisateur non authentifié' });
    return null;
  }
  return id;
};

const parseJsonArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
};

const PROFILE_SELECT = `SELECT
  id,
  first_name AS firstName,
  last_name AS lastName,
  email,
  phone,
  bio,
  location,
  website,
  github,
  linkedin,
  twitter,
  profile_photo,
  skills,
  languages,
  education,
  experience,
  created_at,
  updated_at
FROM users
WHERE id = ?`;

const normalizeProfile = (user) => ({
  ...user,
  skills: parseJsonArray(user.skills),
  languages: parseJsonArray(user.languages),
  education: parseJsonArray(user.education),
  experience: parseJsonArray(user.experience)
});

router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;
    const [results] = await dbManager.connection.execute(PROFILE_SELECT, [userId]);
    if (results.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(normalizeProfile(results[0]));
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/', async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;
    const {
      firstName, lastName, email, phone, bio, location, website,
      github, linkedin, twitter, skills, languages, education, experience
    } = req.body;

    await dbManager.connection.execute(
      `UPDATE users SET
        first_name = ?,
        last_name = ?,
        email = ?,
        phone = ?,
        bio = ?,
        location = ?,
        website = ?,
        github = ?,
        linkedin = ?,
        twitter = ?,
        skills = ?,
        languages = ?,
        education = ?,
        experience = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        firstName, lastName, email, phone || null, bio || null, location || null,
        website || null, github || null, linkedin || null, twitter || null,
        JSON.stringify(skills || []),
        JSON.stringify(languages || []),
        JSON.stringify(education || []),
        JSON.stringify(experience || []),
        userId
      ]
    );

    const [users] = await dbManager.connection.execute(PROFILE_SELECT, [userId]);
    if (users.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json({
      message: 'Profil mis à jour avec succès',
      user: normalizeProfile(users[0])
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier fourni' });

    const photoPath = `/uploads/profiles/${req.file.filename}`;
    const userId = getUserId(req, res);
    if (!userId) return;

    await dbManager.connection.execute(
      'UPDATE users SET profile_photo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [photoPath, userId]
    );

    res.json({
      message: 'Photo de profil mise à jour avec succès',
      photoPath
    });
  } catch (error) {
    console.error("Erreur lors de l'upload de la photo:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/photo', async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const [rows] = await dbManager.connection.execute(
      'SELECT profile_photo FROM users WHERE id = ?',
      [userId]
    );

    const storedPath = rows[0]?.profile_photo;
    if (storedPath) {
      const localPath = path.join(__dirname, '../../', storedPath.replace(/^\/+/, ''));
      if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    }

    await dbManager.connection.execute(
      'UPDATE users SET profile_photo = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );

    res.json({ message: 'Photo de profil supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
