const express = require('express');
const { z } = require('zod');
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');

const router = express.Router();

// List facilities with filters and search
router.get('/', (req, res, next) => {
  try {
    const { type, search, emergency, mandal } = req.query;

    let sql = 'SELECT * FROM facilities WHERE 1=1';
    const params = [];

    if (type && type !== 'all') {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (emergency === '1' || emergency === 'true') {
      sql += ' AND emergency_24x7 = 1';
    }

    if (mandal) {
      sql += ' AND mandal LIKE ?';
      params.push(`%${mandal}%`);
    }

    if (search) {
      const term = `%${search.trim()}%`;
      sql += ` AND (
        name LIKE ? OR 
        name_te LIKE ? OR 
        village LIKE ? OR 
        mandal LIKE ? OR 
        district LIKE ? OR 
        pincode LIKE ? OR
        address LIKE ?
      )`;
      params.push(term, term, term, term, term, term, term);
    }

    sql += ' ORDER BY distance_km ASC, name ASC';

    const facilities = db.query(sql, params);

    res.json({
      success: true,
      count: facilities.length,
      facilities,
    });
  } catch (err) {
    next(err);
  }
});

// Facility Details with Doctors
router.get('/:id', (req, res, next) => {
  try {
    const facility = db.queryOne('SELECT * FROM facilities WHERE id = ?', [req.params.id]);
    if (!facility) {
      return res.status(404).json({
        success: false,
        error: 'Facility not found.',
      });
    }

    const doctors = db.query('SELECT * FROM doctors WHERE facility_id = ? AND is_active = 1', [facility.id]);

    res.json({
      success: true,
      facility: {
        ...facility,
        doctors,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

