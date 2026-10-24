const express = require('express');
const { z } = require('zod');
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');
const { checkAppointmentAccess } = require('../middleware/ownership');
const { validate } = require('../middleware/validate');
const logger = require('../utils/logger');

const router = express.Router();

const createAppointmentSchema = z.object({
  patient_id: z.number().int().positive().optional(), // Allowed for health workers booking for a patient
  facility_id: z.number().int().positive(),
  doctor_id: z.number().int().positive().optional().nullable(),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  time_slot: z.enum(['morning', 'afternoon', 'evening']),
  reason: z.string().min(3, 'Please provide the reason for appointment').max(300),
  priority: z.enum(['routine', 'urgent', 'followup']).default('routine'),
  notes: z.string().max(500).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  doctor_id: z.number().int().positive().optional().nullable(),
  notes: z.string().max(500).optional(),
});

// Helper to generate OPD token
function generateToken(facilityId, dateStr) {
  const cleanDate = dateStr.replace(/-/g, '');
  const prefix = facilityId === 1 ? 'KD' : facilityId === 2 ? 'AT' : facilityId === 3 ? 'DH' : 'RC';
  const countRow = db.queryOne(
    'SELECT COUNT(*) as count FROM appointments WHERE facility_id = ? AND appointment_date = ?',
    [facilityId, dateStr]
  );
  const nextNum = String((countRow ? countRow.count : 0) + 1).padStart(3, '0');
  return `OPD-${prefix}-${cleanDate}-${nextNum}`;
}

// Create Appointment
router.post('/', authenticate, validate({ body: createAppointmentSchema }), (req, res, next) => {
  try {
    const data = req.body;
    let targetPatientId = req.user.id;

    // If health worker, they can book for another patient
    if (req.user.role === 'health_worker') {
      if (data.patient_id) {
        targetPatientId = data.patient_id;
      }
    }

    // Verify facility exists
    const facility = db.queryOne('SELECT id, name FROM facilities WHERE id = ?', [data.facility_id]);
    if (!facility) {
      return res.status(404).json({ success: false, error: 'Healthcare facility not found.' });
    }

    const tokenNumber = generateToken(data.facility_id, data.appointment_date);

    const initialStatus = req.user.role === 'health_worker' ? 'confirmed' : 'pending';

    const result = db.execute(`
      INSERT INTO appointments (
        patient_id, facility_id, doctor_id, appointment_date, time_slot,
        reason, priority, status, token_number, notes, created_by_user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      targetPatientId,
      data.facility_id,
      data.doctor_id || null,
      data.appointment_date,
      data.time_slot,
      data.reason,
      data.priority,
      initialStatus,
      tokenNumber,
      data.notes || null,
      req.user.id,
    ]);

    const appointment = db.queryOne(`
      SELECT a.*, f.name as facility_name, f.phone as facility_phone, d.name as doctor_name
      FROM appointments a
      JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [result.lastInsertRowid]);

    // Send notification to patient
    db.execute(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'appointment', '#appointments')
    `, [
      targetPatientId,
      'New Appointment Scheduled',
      `Your appointment at ${facility.name} on ${data.appointment_date} (${data.time_slot}) is ${initialStatus}. Token: ${tokenNumber}.`
    ]);

    logger.audit(req.user.id, 'BOOK_APPOINTMENT', 'appointments', appointment.id);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      appointment,
    });
  } catch (err) {
    next(err);
  }
});

// List Appointments
router.get('/', authenticate, (req, res, next) => {
  try {
    const { status, facility_id, date, patient_id } = req.query;

    let sql = `
      SELECT a.*, 
             f.name as facility_name, f.phone as facility_phone, f.mandal as facility_mandal,
             d.name as doctor_name, d.specialty as doctor_specialty,
             p.name as patient_name, p.phone as patient_phone, p.village as patient_village, p.abha_id as patient_abha
      FROM appointments a
      JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      JOIN users p ON a.patient_id = p.id
      WHERE 1=1
    `;
    const params = [];

    // Access control:
    if (req.user.role === 'patient') {
      sql += ' AND a.patient_id = ?';
      params.push(req.user.id);
    } else if (patient_id) {
      // Health worker querying specific patient
      sql += ' AND a.patient_id = ?';
      params.push(patient_id);
    }

    if (status && status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    if (facility_id) {
      sql += ' AND a.facility_id = ?';
      params.push(facility_id);
    }

    if (date) {
      sql += ' AND a.appointment_date = ?';
      params.push(date);
    }

    sql += ' ORDER BY a.appointment_date DESC, a.created_at DESC';

    const appointments = db.query(sql, params);

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (err) {
    next(err);
  }
});

// Single Appointment Details
router.get('/:id', authenticate, checkAppointmentAccess, (req, res, next) => {
  try {
    const appointment = db.queryOne(`
      SELECT a.*, 
             f.name as facility_name, f.phone as facility_phone, f.address as facility_address,
             d.name as doctor_name, d.specialty as doctor_specialty,
             p.name as patient_name, p.phone as patient_phone, p.village as patient_village, p.abha_id as patient_abha
      FROM appointments a
      JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      JOIN users p ON a.patient_id = p.id
      WHERE a.id = ?
    `, [req.params.id]);

    res.json({
      success: true,
      appointment,
    });
  } catch (err) {
    next(err);
  }
});

// Update Appointment Status (Health Workers / Admins)
router.patch('/:id/status', authenticate, validate({ body: updateStatusSchema }), (req, res, next) => {
  try {
    if (req.user.role !== 'health_worker' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only healthcare workers can update appointment status or assign clinical staff.',
      });
    }

    const { status, doctor_id, notes } = req.body;
    const appointmentId = req.params.id;

    const existing = db.queryOne('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Appointment not found.' });
    }

    db.execute(`
      UPDATE appointments
      SET status = ?,
          doctor_id = COALESCE(?, doctor_id),
          notes = COALESCE(?, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, doctor_id !== undefined ? doctor_id : null, notes !== undefined ? notes : null, appointmentId]);

    const updated = db.queryOne(`
      SELECT a.*, f.name as facility_name, d.name as doctor_name
      FROM appointments a
      JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [appointmentId]);

    // Notify patient of status update
    db.execute(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'appointment', '#appointments')
    `, [
      existing.patient_id,
      `Appointment ${status.toUpperCase()}`,
      `Your appointment status has been updated to "${status}". Token: ${existing.token_number}.`
    ]);

    logger.audit(req.user.id, `UPDATE_APPOINTMENT_STATUS_${status}`, 'appointments', appointmentId);

    res.json({
      success: true,
      message: `Appointment successfully marked as ${status}.`,
      appointment: updated,
    });
  } catch (err) {
    next(err);
  }
});

// Patient Self-Cancellation
router.post('/:id/cancel', authenticate, checkAppointmentAccess, (req, res, next) => {
  try {
    const { reason } = req.body || {};
    const appointment = req.appointment;

    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel an appointment that has already been completed.',
      });
    }

    db.execute(`
      UPDATE appointments
      SET status = 'cancelled',
          notes = CASE WHEN notes IS NULL THEN ? ELSE notes || ' | Cancellation Reason: ' || ? END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [`Cancelled by patient: ${reason || 'Not specified'}`, reason || 'Not specified', appointment.id]);

    logger.audit(req.user.id, 'CANCEL_APPOINTMENT', 'appointments', appointment.id);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully.',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

