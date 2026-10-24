const express = require('express');
const { z } = require('zod');
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { checkHealthRecordAccess } = require('../middleware/ownership');
const { validate } = require('../middleware/validate');
const { calculateTriageStatus } = require('../utils/triage');
const logger = require('../utils/logger');

const router = express.Router();

const createRecordSchema = z.object({
  patient_id: z.number().int().positive(),
  record_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD').default(() => new Date().toISOString().split('T')[0]),
  visit_type: z.enum(['door_to_door', 'opd', 'teleconsult']).default('door_to_door'),
  systolic_bp: z.number().int().min(50).max(300).optional().nullable(),
  diastolic_bp: z.number().int().min(30).max(200).optional().nullable(),
  blood_glucose: z.number().min(20).max(600).optional().nullable(),
  glucose_type: z.enum(['fasting', 'random', 'postprandial']).optional().nullable(),
  heart_rate: z.number().int().min(30).max(250).optional().nullable(),
  spo2: z.number().int().min(50).max(100).optional().nullable(),
  temperature_f: z.number().min(85).max(110).optional().nullable(),
  weight_kg: z.number().min(1).max(300).optional().nullable(),
  diagnosis: z.string().max(500).optional().nullable(),
  prescription: z.string().max(1000).optional().nullable(),
  allergies: z.string().max(300).optional().nullable(),
  clinical_notes: z.string().max(1000).optional().nullable(),
});

// List health records (Patients see their own; Workers can filter by patient)
router.get('/', authenticate, (req, res, next) => {
  try {
    const { patient_id, triage_status, limit = 50 } = req.query;

    let sql = `
      SELECT r.*, 
             p.name as patient_name, p.phone as patient_phone, p.age as patient_age, p.gender as patient_gender, p.village as patient_village, p.abha_id as patient_abha,
             w.name as worker_name, w.worker_type as worker_type
      FROM health_records r
      JOIN users p ON r.patient_id = p.id
      LEFT JOIN users w ON r.recorded_by_worker_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'patient') {
      sql += ' AND r.patient_id = ?';
      params.push(req.user.id);
    } else if (patient_id) {
      sql += ' AND r.patient_id = ?';
      params.push(patient_id);
    }

    if (triage_status && triage_status !== 'all') {
      sql += ' AND r.triage_status = ?';
      params.push(triage_status);
    }

    sql += ' ORDER BY r.record_date DESC, r.created_at DESC LIMIT ?';
    params.push(Number(limit));

    const records = db.query(sql, params);

    res.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (err) {
    next(err);
  }
});

// Get registered patients list for Health Worker Door-to-Door tracking
router.get('/patients', authenticate, requireRole('health_worker', 'admin'), (req, res, next) => {
  try {
    const { search, mandal } = req.query;

    let sql = `
      SELECT u.id, u.name, u.phone, u.email, u.gender, u.age, u.village, u.mandal, u.sub_center, u.abha_id, u.emergency_contact,
             (SELECT COUNT(*) FROM health_records hr WHERE hr.patient_id = u.id) as total_records,
             (SELECT hr.triage_status FROM health_records hr WHERE hr.patient_id = u.id ORDER BY hr.record_date DESC LIMIT 1) as last_triage_status,
             (SELECT hr.record_date FROM health_records hr WHERE hr.patient_id = u.id ORDER BY hr.record_date DESC LIMIT 1) as last_visit_date,
             (SELECT hr.systolic_bp FROM health_records hr WHERE hr.patient_id = u.id ORDER BY hr.record_date DESC LIMIT 1) as last_sys_bp,
             (SELECT hr.diastolic_bp FROM health_records hr WHERE hr.patient_id = u.id ORDER BY hr.record_date DESC LIMIT 1) as last_dia_bp,
             (SELECT hr.blood_glucose FROM health_records hr WHERE hr.patient_id = u.id ORDER BY hr.record_date DESC LIMIT 1) as last_glucose
      FROM users u
      WHERE u.role = 'patient'
    `;
    const params = [];

    if (mandal) {
      sql += ' AND u.mandal LIKE ?';
      params.push(`%${mandal}%`);
    }

    if (search) {
      const term = `%${search.trim()}%`;
      sql += ' AND (u.name LIKE ? OR u.phone LIKE ? OR u.village LIKE ? OR u.abha_id LIKE ?)';
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY u.name ASC';

    const patients = db.query(sql, params);

    res.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (err) {
    next(err);
  }
});

// Single Health Record Details
router.get('/:id', authenticate, checkHealthRecordAccess, (req, res, next) => {
  try {
    const record = db.queryOne(`
      SELECT r.*, 
             p.name as patient_name, p.phone as patient_phone, p.age as patient_age, p.gender as patient_gender, p.village as patient_village, p.abha_id as patient_abha,
             w.name as worker_name, w.worker_type as worker_type
      FROM health_records r
      JOIN users p ON r.patient_id = p.id
      LEFT JOIN users w ON r.recorded_by_worker_id = w.id
      WHERE r.id = ?
    `, [req.params.id]);

    res.json({
      success: true,
      record,
    });
  } catch (err) {
    next(err);
  }
});

// Create Health Record (Health Workers / Medical Officers)
router.post('/', authenticate, requireRole('health_worker', 'admin'), validate({ body: createRecordSchema }), (req, res, next) => {
  try {
    const data = req.body;

    const patient = db.queryOne("SELECT id, name, phone FROM users WHERE id = ? AND role = 'patient'", [data.patient_id]);
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found or invalid patient ID.',
      });
    }

    // Compute Clinical Triage Status
    const triageResult = calculateTriageStatus({
      systolic_bp: data.systolic_bp,
      diastolic_bp: data.diastolic_bp,
      blood_glucose: data.blood_glucose,
      glucose_type: data.glucose_type,
      heart_rate: data.heart_rate,
      spo2: data.spo2,
      temperature_f: data.temperature_f,
    });

    const result = db.execute(`
      INSERT INTO health_records (
        patient_id, recorded_by_worker_id, record_date, visit_type,
        systolic_bp, diastolic_bp, blood_glucose, glucose_type,
        heart_rate, spo2, temperature_f, weight_kg, triage_status,
        diagnosis, prescription, allergies, clinical_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.patient_id,
      req.user.id,
      data.record_date,
      data.visit_type,
      data.systolic_bp || null,
      data.diastolic_bp || null,
      data.blood_glucose || null,
      data.glucose_type || null,
      data.heart_rate || null,
      data.spo2 || null,
      data.temperature_f || null,
      data.weight_kg || null,
      triageResult.status,
      data.diagnosis || null,
      data.prescription || null,
      data.allergies || null,
      data.clinical_notes || null,
    ]);

    const record = db.queryOne(`
      SELECT r.*, p.name as patient_name, w.name as worker_name
      FROM health_records r
      JOIN users p ON r.patient_id = p.id
      LEFT JOIN users w ON r.recorded_by_worker_id = w.id
      WHERE r.id = ?
    `, [result.lastInsertRowid]);

    // Send notification to patient
    db.execute(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'record', '#records')
    `, [
      patient.id,
      'New Health Record Added',
      `Health check recorded on ${data.record_date} by ${req.user.name}. Triage status: ${triageResult.status.toUpperCase()}.`
    ]);

    // If urgent triage status, alert both patient and worker
    if (triageResult.status === 'urgent') {
      const urgentReasons = triageResult.flags.map(f => f.reason).join('; ');
      db.execute(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, ?, ?, 'system', '#records')
      `, [
        patient.id,
        'URGENT CLINICAL ALERT',
        `Your vitals indicate urgent attention: ${urgentReasons}. Please consult Kalyandurg CHC or call 104/108 immediately.`
      ]);
    }

    logger.audit(req.user.id, 'ADD_HEALTH_RECORD', 'health_records', record.id);

    res.status(201).json({
      success: true,
      message: 'Health record recorded successfully.',
      record,
      triage: triageResult,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
