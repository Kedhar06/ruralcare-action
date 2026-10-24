const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const { facility_id, specialty, search } = req.query;

    let sql = `
      SELECT d.*, f.name as facility_name, f.mandal as facility_mandal, f.type as facility_type
      FROM doctors d
      JOIN facilities f ON d.facility_id = f.id
      WHERE d.is_active = 1
    `;
    const params = [];

    if (facility_id) {
      sql += ' AND d.facility_id = ?';
      params.push(facility_id);
    }

    if (specialty) {
      sql += ' AND d.specialty LIKE ?';
      params.push(`%${specialty}%`);
    }

    if (search) {
      const term = `%${search.trim()}%`;
      sql += ' AND (d.name LIKE ? OR d.specialty LIKE ? OR f.name LIKE ?)';
      params.push(term, term, term);
    }

    sql += ' ORDER BY d.name ASC';

    const doctors = db.query(sql, params);

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const doctor = db.queryOne(`
      SELECT d.*, f.name as facility_name, f.address as facility_address, f.phone as facility_phone
      FROM doctors d
      JOIN facilities f ON d.facility_id = f.id
      WHERE d.id = ?
    `, [req.params.id]);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found.',
      });
    }

    res.json({
      success: true,
      doctor,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

