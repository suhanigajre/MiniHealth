const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// GET health records of a specific patient
router.get("/:patientId", auth, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const patientId = req.params.patientId;

    // Check if this doctor is assigned to the patient
    const [relation] = await pool.query(
      "SELECT * FROM doctor_patient WHERE doctor_id = ? AND patient_id = ?",
      [doctorId, patientId]
    );

    if (relation.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this patient"
      });
    }

    // Fetch medical records
    const [records] = await pool.query(
      "SELECT * FROM health_records WHERE patient_id = ? ORDER BY recorded_at DESC",
      [patientId]
    );

    res.json({
      success: true,
      records
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
