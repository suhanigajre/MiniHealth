const express = require("express");
const router = express.Router();
const db = require("../db");

// Get patient dashboard summary
router.get("/dashboard/:id", async (req, res) => {
  const patientId = req.params.id;

  try {
    // Appointments count
    const [appointments] = await db.query(
      "SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?",
      [patientId]
    );

    // Prescriptions count
    const [prescriptions] = await db.query(
      "SELECT COUNT(*) as count FROM prescriptions WHERE patient_id = ?",
      [patientId]
    );

    // Records count
    const [records] = await db.query(
      "SELECT COUNT(*) as count FROM records WHERE patient_id = ?",
      [patientId]
    );

    res.json({
      appointments: appointments[0].count,
      prescriptions: prescriptions[0].count,
      records: records[0].count
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;