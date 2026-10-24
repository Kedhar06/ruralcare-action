const express = require('express');
const { z } = require('zod');
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const logger = require('../utils/logger');

const router = express.Router();

const createReferralSchema = z.object({
  patient_id: z.number().int().positive(),
  from_facility_id: z.number().int().positive(),
  to_facility_id: z.number().int().positive(),
  reason: z.string().min(5, 'Clinical reason for referral is required').max(500),
  priority: z.enum(['routine', 'urgent', 'emergency']).default('routine'),
  aarogyasri_case: z.boolean().default(true),
  transport_required: z.boolean().default(false),
  transport_type: z.enum(['ambulance_108', 'public_transport', 'self']).optional(),
  clinical_summary: z.string().max(1000).optional(),
});

function generateReferralCode() {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `REF-${year}-RC-${randomSuffix}`;
}

// List Referrals
router.get('/', authenticate, (req, res, next) => {
  try {
    const { status, patient_id } = req.query;

    let sql = `
      SELECT ref.*,
             p.name as patient_name, p.phone as patient_phone, p.age as patient_age, p.village as patient_village, p.abha_id as patient_abha,
             w.name as worker_name,
             f1.name as from_facility_name, f1.mandal as from_facility_mandal,
             f2.name as to_facility_name, f2.mandal as to_facility_mandal, f2.phone as to_facility_phone
      FROM referrals ref
      JOIN users p ON ref.patient_id = p.id
      JOIN users w ON ref.referring_worker_id = w.id
      JOIN facilities f1 ON ref.from_facility_id = f1.id
      JOIN facilities f2 ON ref.to_facility_id = f2.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'patient') {
      sql += ' AND ref.patient_id = ?';
      params.push(req.user.id);
    } else if (patient_id) {
      sql += ' AND ref.patient_id = ?';
      params.push(patient_id);
    }

    if (status && status !== 'all') {
      sql += ' AND ref.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY ref.created_at DESC';

    const referrals = db.query(sql, params);

    res.json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (err) {
    next(err);
  }
});

// Create Referral Slip (Health Worker only)
router.post('/', authenticate, requireRole('health_worker', 'admin'), validate({ body: createReferralSchema }), (req, res, next) => {
  try {
    const data = req.body;
    const referralCode = generateReferralCode();

    const patient = db.queryOne('SELECT id, name FROM users WHERE id = ?', [data.patient_id]);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    const toFacility = db.queryOne('SELECT id, name FROM facilities WHERE id = ?', [data.to_facility_id]);
    if (!toFacility) {
      return res.status(404).json({ success: false, error: 'Destination healthcare facility not found.' });
    }

    const result = db.execute(`
      INSERT INTO referrals (
        referral_code, patient_id, referring_worker_id, from_facility_id,
        to_facility_id, reason, priority, aarogyasri_case,
        transport_required, transport_type, status, clinical_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'issued', ?)
    `, [
      referralCode,
      data.patient_id,
      req.user.id,
      data.from_facility_id,
      data.to_facility_id,
      data.reason,
      data.priority,
      data.aarogyasri_case ? 1 : 0,
      data.transport_required ? 1 : 0,
      data.transport_type || null,
      data.clinical_summary || null,
    ]);

    const referral = db.queryOne('SELECT * FROM referrals WHERE id = ?', [result.lastInsertRowid]);

    // Send patient notification
    db.execute(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'referral', '#referrals')
    `, [
      patient.id,
      'Hospital Referral Slip Issued',
      `You have been referred to ${toFacility.name} (Code: ${referralCode}) under ${data.aarogyasri_case ? 'Aarogyasri Scheme' : 'Government Care'}.`
    ]);

    logger.audit(req.user.id, 'CREATE_REFERRAL', 'referrals', referral.id);

    res.status(201).json({
      success: true,
      message: 'Referral slip generated successfully.',
      referral,
    });
  } catch (err) {
    next(err);
  }
});

// Update Referral Status
router.patch('/:id/status', authenticate, requireRole('health_worker', 'admin'), (req, res, next) => {
  try {
    const { status, action_notes } = req.body;
    const referralId = req.params.id;

    const existing = db.queryOne('SELECT * FROM referrals WHERE id = ?', [referralId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Referral not found.' });
    }

    db.execute(`
      UPDATE referrals
      SET status = ?, action_notes = COALESCE(?, action_notes), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, action_notes || null, referralId]);

    res.json({
      success: true,
      message: `Referral status updated to ${status}.`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

