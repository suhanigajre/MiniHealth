const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// 💊 Create Prescription (Doctor Only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, error: 'Only doctors can create prescriptions.' });
    }

    const { patient_id, appointment_id, medication, dosage, instructions } = req.body;

    const [result] = await db.query(
      `INSERT INTO prescriptions (doctor_id, patient_id, appointment_id, medication, dosage, instructions)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, patient_id, appointment_id, medication, dosage, instructions]
    );

    res.json({ success: true, prescriptionId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📜 Get Prescriptions (Patient or Doctor)
router.get('/', auth, async (req, res) => {
  try {
    const { role, id } = req.user;
    let query = '';
    let params = [];

    if (role === 'doctor') {
      query = `SELECT * FROM prescriptions WHERE doctor_id = ? ORDER BY created_at DESC`;
      params = [id];
    } else {
      query = `SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY created_at DESC`;
      params = [id];
    }

    const [rows] = await db.query(query, params);
    res.json({ success: true, prescriptions: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
router.post("/", auth, async (req, res) => {
  const { patient_id, medication, dosage, instructions } = req.body;

  await pool.query(`
    INSERT INTO prescriptions
    (doctor_id, patient_id, medication, dosage, instructions)
    VALUES (?, ?, ?, ?, ?)
  `, [req.user.id, patient_id, medication, dosage, instructions]);

  res.json({ success: true });
});
