const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, authorizeRoles } = require("../middleware/auth");

/* 💊 Create Prescription (DOCTOR only) */
router.post(
  "/",
  authenticate,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const {
        patient_id,
        appointment_id,
        medication,
        dosage,
        instructions,
      } = req.body;

      if (!patient_id || !medication || !dosage) {
        return res.status(400).json({
          success: false,
          message: "Patient, medication and dosage are required",
        });
      }

      const [result] = await db.query(
        `INSERT INTO prescriptions 
         (doctor_id, patient_id, appointment_id, medication, dosage, instructions)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          patient_id,
          appointment_id || null,
          medication,
          dosage,
          instructions || null,
        ]
      );

      res.status(201).json({
        success: true,
        prescriptionId: result.insertId,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/* 📜 Get Prescriptions (PATIENT or DOCTOR) */
router.get(
  "/",
  authenticate,
  async (req, res) => {
    try {
      const { id, role } = req.user;

      let query;
      if (role === "doctor") {
        query = `
          SELECT p.*, u.name AS patient_name
          FROM prescriptions p
          JOIN users u ON u.id = p.patient_id
          WHERE p.doctor_id = ?
          ORDER BY p.created_at DESC
        `;
      } else {
        query = `
          SELECT p.*, u.name AS doctor_name
          FROM prescriptions p
          JOIN users u ON u.id = p.doctor_id
          WHERE p.patient_id = ?
          ORDER BY p.created_at DESC
        `;
      }

      const [rows] = await db.query(query, [id]);

      res.json({ success: true, prescriptions: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;
