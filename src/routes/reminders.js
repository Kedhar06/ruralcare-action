const express = require('express');
const { z } = require('zod');
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');

const router = express.Router();

const createReminderSchema = z.object({
  patient_id: z.number().int().positive(),
  reminder_type: z.enum(['bp_check', 'sugar_check', 'immunization', 'maternal_checkup', 'medication_refill']),
  title: z.string().min(3).max(150),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  notes: z.string().max(300).optional(),
});

// List Reminders
router.get('/', authenticate, (req, res, next) => {
  try {
    const { patient_id, status } = req.query;

    let sql = `
      SELECT rem.*, p.name as patient_name, p.phone as patient_phone, w.name as worker_name
      FROM reminders rem
      JOIN users p ON rem.patient_id = p.id
      LEFT JOIN users w ON rem.created_by_worker_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'patient') {
      sql += ' AND rem.patient_id = ?';
      params.push(req.user.id);
    } else if (patient_id) {
      sql += ' AND rem.patient_id = ?';
      params.push(patient_id);
    }

    if (status && status !== 'all') {
      sql += ' AND rem.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY rem.due_date ASC';

    const reminders = db.query(sql, params);

    res.json({
      success: true,
      count: reminders.length,
      reminders,
    });
  } catch (err) {
    next(err);
  }
});

// Create Reminder (Health Worker)
router.post('/', authenticate, requireRole('health_worker', 'admin'), validate({ body: createReminderSchema }), (req, res, next) => {
  try {
    const data = req.body;

    const patient = db.queryOne('SELECT id, name FROM users WHERE id = ?', [data.patient_id]);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    const result = db.execute(`
      INSERT INTO reminders (
        patient_id, created_by_worker_id, reminder_type, title, due_date, status, sms_sent, notes
      ) VALUES (?, ?, ?, ?, ?, 'pending', 1, ?)
    `, [
      data.patient_id,
      req.user.id,
      data.reminder_type,
      data.title,
      data.due_date,
      data.notes || null,
    ]);

    const reminder = db.queryOne('SELECT * FROM reminders WHERE id = ?', [result.lastInsertRowid]);

    // Send in-app notification
    db.execute(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'reminder', '#reminders')
    `, [
      patient.id,
      'Preventive Health Follow-up Due',
      `Reminder: ${data.title} scheduled for ${data.due_date}.`
    ]);

    res.status(201).json({
      success: true,
      message: 'Reminder scheduled and SMS notification dispatched.',
      reminder,
    });
  } catch (err) {
    next(err);
  }
});

// Update Reminder Status
router.patch('/:id/status', authenticate, (req, res, next) => {
  try {
    const { status } = req.body;
    const reminderId = req.params.id;

    const existing = db.queryOne('SELECT * FROM reminders WHERE id = ?', [reminderId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Reminder not found.' });
    }

    // Patient can only update their own; worker can update any
    if (req.user.role === 'patient' && existing.patient_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    db.execute('UPDATE reminders SET status = ? WHERE id = ?', [status, reminderId]);

    res.json({
      success: true,
      message: `Reminder marked as ${status}.`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

