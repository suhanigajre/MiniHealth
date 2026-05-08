const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// GET /api/patient/dashboard/:id
router.get(
  "/dashboard/:id",
  authenticate,
  authorizeRoles("patient", "admin"),
  async (req, res) => {
    const patientId = Number(req.params.id);

    // patient can access only own dashboard
    if (req.user.role === "patient" && req.user.id !== patientId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can access only your own dashboard",
      });
    }

    try {
      const [appointments] = await db.query(
        "SELECT COUNT(*) AS count FROM appointments WHERE patient_id = ?",
        [patientId]
      );

      const [prescriptions] = await db.query(
        "SELECT COUNT(*) AS count FROM prescriptions WHERE patient_id = ?",
        [patientId]
      );

      const [records] = await db.query(
       "SELECT COUNT(*) AS count FROM health_records WHERE patient_id = ?",
        [patientId]
   );

      res.json({
        success: true,
        appointments: appointments[0].count,
        prescriptions: prescriptions[0].count,
        records: records[0].count,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;