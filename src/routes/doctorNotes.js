const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, authorizeRoles } = require("../middleware/auth");

/* GET /api/doctor-notes */
router.get(
  "/",
  authenticate,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const doctorId = req.user.id;

      const [notes] = await db.query(
        `
        SELECT dn.id, dn.note, dn.created_at, u.name AS patient_name
        FROM doctor_notes dn
        JOIN users u ON u.id = dn.patient_id
        WHERE dn.doctor_id = ?
        ORDER BY dn.created_at DESC
        `,
        [doctorId]
      );

      res.json({
        success: true,
        notes,
      });
    } catch (err) {
      console.error("GET DOCTOR NOTES ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Server error while loading notes",
      });
    }
  }
);

/* POST /api/doctor-notes */
router.post(
  "/",
  authenticate,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const { patient_id, note } = req.body;

      if (!patient_id || !note) {
        return res.status(400).json({
          success: false,
          message: "Patient and note are required",
        });
      }

      await db.query(
        `
        INSERT INTO doctor_notes (doctor_id, patient_id, note)
        VALUES (?, ?, ?)
        `,
        [req.user.id, patient_id, note]
      );

      res.status(201).json({
        success: true,
        message: "Doctor note added successfully",
      });
    } catch (err) {
      console.error("ADD DOCTOR NOTE ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Server error while saving note",
      });
    }
  }
);

module.exports = router;