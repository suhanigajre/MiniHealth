const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, authorizeRoles } = require("../middleware/auth");

/* 🩺 Create appointment (PATIENT only) */
router.post(
  "/",
  authenticate,
  authorizeRoles("patient"),
  async (req, res) => {
    try {
      const { doctor_id, appointment_date, notes } = req.body;
      const patient_id = req.user.id;

      if (!doctor_id || !appointment_date) {
        return res.status(400).json({
          success: false,
          message: "Doctor and appointment date are required",
        });
      }

      const [result] = await db.query(
        `INSERT INTO appointments 
         (doctor_id, patient_id, appointment_date, notes)
         VALUES (?, ?, ?, ?)`,
        [doctor_id, patient_id, appointment_date, notes || null]
      );

      res.status(201).json({
        success: true,
        appointmentId: result.insertId,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/* 📅 Get my appointments (PATIENT or DOCTOR) */
router.get(
  "/",
  authenticate,
  async (req, res) => {
    try {
      const { id, role } = req.user;

      let query;
      if (role === "doctor") {
        query = `
          SELECT a.*, u.name AS patient_name
          FROM appointments a
          JOIN users u ON u.id = a.patient_id
          WHERE a.doctor_id = ?
          ORDER BY appointment_date DESC
        `;
      } else {
        query = `
          SELECT a.*, u.name AS doctor_name
          FROM appointments a
          JOIN users u ON u.id = a.doctor_id
          WHERE a.patient_id = ?
          ORDER BY appointment_date DESC
        `;
      }

      const [rows] = await db.query(query, [id]);

      res.json({ success: true, appointments: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;
