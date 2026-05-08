const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate } = require("../middleware/auth");

// GET /api/insights
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const [appointments] = await db.query(
      "SELECT COUNT(*) AS total FROM appointments WHERE patient_id = ?",
      [userId]
    );

    const [prescriptions] = await db.query(
      "SELECT COUNT(*) AS total FROM prescriptions WHERE patient_id = ?",
      [userId]
    );

    const [records] = await db.query(
      "SELECT COUNT(*) AS total FROM records WHERE patient_id = ?",
      [userId]
    );

    res.json({
      success: true,
      insights: {
        totalAppointments: appointments[0].total,
        totalPrescriptions: prescriptions[0].total,
        totalRecords: records[0].total,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;