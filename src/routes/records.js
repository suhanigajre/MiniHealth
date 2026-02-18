const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, authorizeRoles } = require("../middleware/auth");

/* 🧾 Get health records of a specific patient (DOCTOR only) */
router.get(
  "/:patientId",
  authenticate,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const doctorId = req.user.id;
      const patientId = req.params.patientId;

      // Check doctor–patient relationship
      const [relation] = await db.query(
        `SELECT 1 
         FROM doctor_patient 
         WHERE doctor_id = ? AND patient_id = ?`,
        [doctorId, patientId]
      );

      if (relation.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to view this patient's records",
        });
      }

      // Fetch medical records
      const [records] = await db.query(
        `SELECT * 
         FROM health_records 
         WHERE patient_id = ? 
         ORDER BY recorded_at DESC`,
        [patientId]
      );

      res.json({
        success: true,
        records,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;
