require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const rateLimit = require('./middleware/rateLimit'); // Temporairement désactivé
const { dbManager } = require('./db/connect');

// Import routes
const authRoutes = require('./routes/auth');
const tutorRoutes = require('./routes/tutor');
const factcheckRoutes = require('./routes/factcheck');
const quizRoutes = require('./routes/quiz');
const planningRoutes = require('./routes/planning');
const dashboardRoutes = require('./routes/dashboard');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(rateLimit); // Temporairement désactivé

// Database connection
dbManager.connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    console.log('Running without database - some features may be limited');
  });

// Upload endpoint
const multer = require('multer');
const { uploadBuffer, isConfigured: isCloudinaryConfigured } = require('./services/cloudinary');

// Configuration de multer : les fichiers restent en mémoire puis sont envoyés
// directement vers Cloudinary. Rien n'est conservé sur le disque Render.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  }
});

// Endpoint d'upload vers Cloudinary
app.post('/api/upload', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        error: 'Le stockage Cloudinary n\'est pas configuré sur le serveur'
      });
    }

    const uploaded = await Promise.all(
      req.files.map((file) => uploadBuffer(file.buffer, {
        public_id: undefined,
        context: {
          original_name: file.originalname,
        },
      }))
    );

    const urls = uploaded.map((result, index) => ({
      url: result.secure_url,
      secure_url: result.secure_url,
      filename: result.public_id,
      public_id: result.public_id,
      originalname: req.files[index].originalname,
      size: req.files[index].size,
    }));

    res.json({ urls });
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'upload vers Cloudinary',
      details: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/fact-check', factcheckRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbManager.isConnected() ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await dbManager.disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
