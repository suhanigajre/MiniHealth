const express = require("express");
const router = express.Router();
const db = require("../db");

// Assign patient
router.post("/assign", async (req, res) => {
  const { doctorId, patientId } = req.body;

  try {
    await db.query(
      "INSERT INTO doctor_patients (doctor_id, patient_id) VALUES (?, ?)",
      [doctorId, patientId]
    );

    res.json({ message: "Patient assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get patients for doctor
router.get("/doctor/:id/patients", async (req, res) => {
  const doctorId = req.params.id;

  try {
    const [patients] = await db.query(`
      SELECT users.id, users.name, users.email
      FROM doctor_patients
      JOIN users ON users.id = doctor_patients.patient_id
      WHERE doctor_patients.doctor_id = ?
    `, [doctorId]);

    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;  // ✅ THIS LINE IS REQUIRED
