const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// 🩺 Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctor_id, appointment_date, notes } = req.body;
    const patient_id = req.user.id; // from JWT token

    const [result] = await db.query(
      'INSERT INTO appointments (doctor_id, patient_id, appointment_date, notes) VALUES (?, ?, ?, ?)',
      [doctor_id, patient_id, appointment_date, notes]
    );

    res.json({ success: true, appointmentId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📅 Get my appointments (for both roles)
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query;
    if (role === 'doctor') {
      query = 'SELECT * FROM appointments WHERE doctor_id = ? ORDER BY appointment_date DESC';
    } else {
      query = 'SELECT * FROM appointments WHERE patient_id = ? ORDER BY appointment_date DESC';
    }

    const [rows] = await db.query(query, [userId]);
    res.json({ success: true, appointments: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
router.get("/doctor", auth, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT a.*, u.name AS patient_name
    FROM appointments a
    JOIN users u ON u.id = a.patient_id
    WHERE a.doctor_id = ?
    ORDER BY appointment_date
  `, [req.user.id]);

  res.json({ success: true, appointments: rows });
});

