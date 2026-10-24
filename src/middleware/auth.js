const { verifyToken } = require('../utils/jwt');
const db = require('../db/database');

function authenticate(req, res, next) {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to access this resource.',
    });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session token. Please sign in again.',
    });
  }

  const user = db.queryOne(
    'SELECT id, role, worker_type, name, email, phone, gender, age, abha_id, village, mandal, district, sub_center FROM users WHERE id = ?',
    [decoded.id]
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'User account not found or has been disabled.',
    });
  }

  req.user = user;
  next();
}

function optionalAuth(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'];
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded && decoded.id) {
      const user = db.queryOne(
        'SELECT id, role, worker_type, name, email, phone, gender, age, abha_id, village, mandal, district, sub_center FROM users WHERE id = ?',
        [decoded.id]
      );
      if (user) {
        req.user = user;
      }
    }
  }

  next();
}

module.exports = {
  authenticate,
  optionalAuth,
};

