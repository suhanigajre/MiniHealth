// backend/routes/doctor.js
const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/auth"); // your JWT middleware

const router = express.Router();

// ✅ Get patients assigned to the logged-in doctor
router.get("/patients", verifyToken, async (req, res) => {
  try {
    // make sure only doctors can access
    if (req.user.role !== "doctor") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const doctorId = req.user.id;

    // Example table structure: appointments(patient_id, doctor_id)
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.email, p.age, p.condition
       FROM patients p
       JOIN appointments a ON p.id = a.patient_id
       WHERE a.doctor_id = ?`,
      [doctorId]
    );

    res.json({ success: true, patients: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
