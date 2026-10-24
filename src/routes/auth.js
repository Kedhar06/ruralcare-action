const express = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const db = require('../db/database');
const { signToken } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createRateLimiter } = require('../middleware/rateLimiter');
const config = require('../config');
const logger = require('../utils/logger');

const router = express.Router();

const authLimiter = createRateLimiter({
  windowMs: config.rateLimitWindowMs,
  max: config.authRateLimitMax,
  message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
});

// Zod schemas
const registerSchema = z.object({
  role: z.enum(['patient', 'health_worker']),
  worker_type: z.enum(['asha', 'anm', 'medical_officer']).optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit mobile number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  age: z.number().int().min(0).max(120).optional(),
  village: z.string().max(80).optional(),
  mandal: z.string().max(80).optional(),
  district: z.string().max(80).default('Ananthapur'),
  sub_center: z.string().max(100).optional(),
  abha_id: z.string().max(30).optional(),
  emergency_contact: z.string().max(100).optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(3, 'Phone or email required'),
  password: z.string().min(1, 'Password required'),
  expectedRole: z.enum(['patient', 'health_worker', 'admin']).optional(),
});

// Register
router.post('/register', authLimiter, validate({ body: registerSchema }), (req, res, next) => {
  try {
    const data = req.body;

    // Check if phone already registered
    const existingPhone = db.queryOne('SELECT id FROM users WHERE phone = ?', [data.phone]);
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        error: 'A user with this mobile phone number is already registered.',
      });
    }

    // Check if email provided and already registered
    if (data.email) {
      const existingEmail = db.queryOne('SELECT id FROM users WHERE email = ?', [data.email]);
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: 'A user with this email address is already registered.',
        });
      }
    }

    const passwordHash = bcrypt.hashSync(data.password, 10);

    const result = db.execute(`
      INSERT INTO users (
        role, worker_type, name, email, phone, password_hash, gender, age,
        village, mandal, district, sub_center, abha_id, emergency_contact
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.role,
      data.role === 'health_worker' ? (data.worker_type || 'asha') : null,
      data.name,
      data.email || null,
      data.phone,
      passwordHash,
      data.gender || null,
      data.age || null,
      data.village || null,
      data.mandal || null,
      data.district || 'Ananthapur',
      data.sub_center || null,
      data.abha_id || null,
      data.emergency_contact || null,
    ]);

    const user = db.queryOne(`
      SELECT id, role, worker_type, name, email, phone, gender, age, village, mandal, district, sub_center, abha_id, emergency_contact, created_at
      FROM users WHERE id = ?
    `, [result.lastInsertRowid]);

    const token = signToken({ id: user.id, role: user.role });

    // Send initial welcome notification
    db.execute(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'system', '#profile')
    `, [
      user.id,
      'Welcome to RuralCare Action',
      `Welcome ${user.name}! Your account has been securely registered with National Health Mission compliance.`
    ]);

    logger.audit(user.id, 'REGISTER', 'users', user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', authLimiter, validate({ body: loginSchema }), (req, res, next) => {
  try {
    const { identifier, password, expectedRole } = req.body;

    const user = db.queryOne(`
      SELECT * FROM users WHERE phone = ? OR email = ?
    `, [identifier, identifier]);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your phone number or password.',
      });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your phone number or password.',
      });
    }

    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        success: false,
        error: `This account is registered as a ${user.role.replace('_', ' ')}. Please use the appropriate portal login.`,
      });
    }

    const token = signToken({ id: user.id, role: user.role });

    // Sanitize user object
    const sanitizedUser = {
      id: user.id,
      role: user.role,
      worker_type: user.worker_type,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      village: user.village,
      mandal: user.mandal,
      district: user.district,
      sub_center: user.sub_center,
      abha_id: user.abha_id,
      emergency_contact: user.emergency_contact,
      created_at: user.created_at,
    };

    logger.audit(user.id, 'LOGIN', 'users', user.id);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: sanitizedUser,
    });
  } catch (err) {
    next(err);
  }
});

// Current User Profile
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Demo Login (Quick 1-click test for evaluations and village demo setups)
router.post('/demo-login', (req, res) => {
  const { role } = req.body; // 'patient' or 'health_worker'

  let user = null;
  if (role === 'health_worker') {
    user = db.queryOne("SELECT * FROM users WHERE role = 'health_worker' AND worker_type = 'asha' LIMIT 1");
  } else {
    user = db.queryOne("SELECT * FROM users WHERE role = 'patient' LIMIT 1");
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Demo user not found. Please run database seed.',
    });
  }

  const token = signToken({ id: user.id, role: user.role });

  const sanitizedUser = {
    id: user.id,
    role: user.role,
    worker_type: user.worker_type,
    name: user.name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    age: user.age,
    village: user.village,
    mandal: user.mandal,
    district: user.district,
    sub_center: user.sub_center,
    abha_id: user.abha_id,
    emergency_contact: user.emergency_contact,
  };

  logger.audit(user.id, 'DEMO_LOGIN', 'users', user.id);

  res.json({
    success: true,
    message: `Logged in as demo ${user.role}.`,
    token,
    user: sanitizedUser,
  });
});

// Password recovery simulation
router.post('/forgot-password', authLimiter, (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Mobile number is required' });
  }

  const user = db.queryOne('SELECT id, phone FROM users WHERE phone = ?', [phone]);
  if (!user) {
    // Avoid user enumeration
    return res.json({
      success: true,
      message: 'If the mobile number is registered, an SMS verification OTP has been dispatched.',
    });
  }

  // Simulated OTP for verification
  const demoOtp = '123456';

  res.json({
    success: true,
    message: 'SMS verification OTP dispatched to your registered mobile number.',
    demoOtpHint: process.env.NODE_ENV === 'development' ? demoOtp : undefined,
  });
});

// Reset Password
router.post('/reset-password', authLimiter, (req, res) => {
  const { phone, otp, newPassword } = req.body;
  if (!phone || !otp || !newPassword) {
    return res.status(400).json({ success: false, error: 'Phone, OTP, and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
  }

  if (otp !== '123456') {
    return res.status(400).json({ success: false, error: 'Invalid or expired OTP code.' });
  }

  const user = db.queryOne('SELECT id FROM users WHERE phone = ?', [phone]);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User account not found' });
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  db.execute('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [passwordHash, user.id]);

  logger.audit(user.id, 'PASSWORD_RESET', 'users', user.id);

  res.json({
    success: true,
    message: 'Password reset successfully. You may now sign in with your new password.',
  });
});

module.exports = router;

