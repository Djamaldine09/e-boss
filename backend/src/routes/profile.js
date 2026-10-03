const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configuration de multer pour l'upload des photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/profiles');
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers JPEG, PNG et GIF sont autorisés'), false);
    }
  }
});

// Helper pour obtenir l'ID utilisateur
const getUserId = (req) => {
  return req.user?.id || 1; // ID par défaut pour les tests
};

// GET /api/profile - Obtenir les informations du profil
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    
    const query = `
      SELECT id, firstName, lastName, email, phone, bio, location, website, 
             github, linkedin, twitter, profile_photo, skills, languages, 
             education, experience, created_at, updated_at
      FROM users 
      WHERE id = ?
    `;
    
    const [results] = await req.db.query(query, [userId]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    const user = results[0];
    
    // Parser les champs JSON
    user.skills = user.skills ? JSON.parse(user.skills) : [];
    user.languages = user.languages ? JSON.parse(user.languages) : [];
    user.education = user.education ? JSON.parse(user.education) : [];
    user.experience = user.experience ? JSON.parse(user.experience) : [];
    
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/profile - Mettre à jour les informations du profil
router.put('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const {
      firstName, lastName, email, phone, bio, location, website,
      github, linkedin, twitter, skills, languages, education, experience
    } = req.body;
    
    const query = `
      UPDATE users 
      SET firstName = ?, lastName = ?, email = ?, phone = ?, bio = ?, 
          location = ?, website = ?, github = ?, linkedin = ?, twitter = ?,
          skills = ?, languages = ?, education = ?, experience = ?, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await req.db.query(query, [
      firstName, lastName, email, phone, bio, location, website,
      github, linkedin, twitter,
      JSON.stringify(skills || []),
      JSON.stringify(languages || []),
      JSON.stringify(education || []),
      JSON.stringify(experience || []),
      userId
    ]);
    
    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/profile/photo - Uploader la photo de profil
router.post('/photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }
    
    const userId = getUserId(req);
    const photoPath = `/uploads/profiles/${req.file.filename}`;
    
    // Mettre à jour le chemin de la photo dans la base de données
    const query = `
      UPDATE users 
      SET profile_photo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await req.db.query(query, [photoPath, userId]);
    
    res.json({ 
      message: 'Photo de profil mise à jour avec succès',
      photoPath: photoPath 
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/profile/photo - Supprimer la photo de profil
router.delete('/photo', async (req, res) => {
  try {
    const userId = getUserId(req);
    
    // Récupérer le chemin de la photo actuelle
    const [userResults] = await req.db.query(
      'SELECT profile_photo FROM users WHERE id = ?', 
      [userId]
    );
    
    if (userResults.length > 0 && userResults[0].profile_photo) {
      const photoPath = path.join(__dirname, '../../', userResults[0].profile_photo);
      
      // Supprimer le fichier physique
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    // Mettre à jour la base de données
    await req.db.query(
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
