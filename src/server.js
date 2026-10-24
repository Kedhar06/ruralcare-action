const path = require('node:path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const db = require('./db/database');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const facilitiesRoutes = require('./routes/facilities');
const doctorsRoutes = require('./routes/doctors');
const appointmentsRoutes = require('./routes/appointments');
const healthRecordsRoutes = require('./routes/healthRecords');
const referralsRoutes = require('./routes/referrals');
const remindersRoutes = require('./routes/reminders');
const resourcesRoutes = require('./routes/resources');
const notificationsRoutes = require('./routes/notifications');
const aiRoutes = require('./routes/ai');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static files (frontend)
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// System Health Check
app.get('/api/health', (req, res) => {
  try {
    const dbCheck = db.queryOne('SELECT 1 as alive');
    res.json({
      status: 'ok',
      service: 'RuralCare Action Platform',
      version: '2.0.0',
      database: dbCheck && dbCheck.alive === 1 ? 'connected' : 'degraded',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: err.message,
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/health-records', healthRecordsRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/ai', aiRoutes);

// Fallback to index.html for client-side navigation
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(publicDir, 'index.html'));
  }
  next();
});

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server if executed directly
if (require.main === module) {
  // Ensure database initialized and seeded
  db.initSchema();
  const seed = require('./db/seed');
  seed();

  const server = app.listen(config.port, () => {
    logger.info(`RuralCare Action platform running on http://localhost:${config.port} in ${config.env} mode`);
  });

  const shutdown = () => {
    logger.info('Gracefully shutting down RuralCare server...');
    server.close(() => {
      db.close();
      logger.info('Server closed. Database disconnected.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = app;
