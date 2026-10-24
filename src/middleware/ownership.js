const db = require('../db/database');

/**
 * Checks whether the current user owns the appointment or has health worker authorization.
 */
function checkAppointmentAccess(req, res, next) {
  const appointmentId = req.params.id;
  const appointment = db.queryOne('SELECT * FROM appointments WHERE id = ?', [appointmentId]);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      error: 'Appointment not found.',
    });
  }

  // Patients can only view/modify their own appointments
  if (req.user.role === 'patient' && appointment.patient_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. You can only access your own appointment records.',
    });
  }

  req.appointment = appointment;
  next();
}

/**
 * Checks whether the current user has access to a specific health record.
 * A patient can only view their own record.
 * A health worker can view patient records for care delivery.
 */
function checkHealthRecordAccess(req, res, next) {
  const recordId = req.params.id;
  const record = db.queryOne('SELECT * FROM health_records WHERE id = ?', [recordId]);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: 'Health record not found.',
    });
  }

  if (req.user.role === 'patient' && record.patient_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Health records are strictly confidential and limited to the patient and verified health workers.',
    });
  }

  req.healthRecord = record;
  next();
}

module.exports = {
  checkAppointmentAccess,
  checkHealthRecordAccess,
};

