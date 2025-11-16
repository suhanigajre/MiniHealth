const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /records → patient adds a health record
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ success: false, message: 'Only patients can add records' });
    }

    const { systolic, diastolic, sugar_level, heart_rate, weight, notes } = req.body;

    const [result] = await db.query(
      `INSERT INTO health_records 
       (patient_id, systolic, diastolic, sugar_level, heart_rate, weight, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, systolic, diastolic, sugar_level, heart_rate, weight, notes]
    );

    res.json({ success: true, recordId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /records → patient views their own records
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ success: false, message: 'Only patients can view their records' });
    }

    const [rows] = await db.query(
      `SELECT * FROM health_records WHERE patient_id = ? ORDER BY recorded_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, records: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
