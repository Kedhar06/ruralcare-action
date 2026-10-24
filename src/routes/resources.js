const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const { category, search, lang } = req.query;

    let sql = 'SELECT * FROM resources WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      const term = `%${search.trim()}%`;
      sql += ' AND (title_en LIKE ? OR title_te LIKE ? OR summary_en LIKE ? OR summary_te LIKE ? OR content_en LIKE ? OR content_te LIKE ?)';
      params.push(term, term, term, term, term, term);
    }

    sql += ' ORDER BY id ASC';

    const resources = db.query(sql, params);

    res.json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const resource = db.queryOne('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found.' });
    }

    res.json({
      success: true,
      resource,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

