const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, authorizeRoles } = require("../middleware/auth");

/* 👨‍⚕️ Get patients assigned to logged-in doctor */
router.get(
  "/patients",
  authenticate,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const doctorId = req.user.id;

      const [patients] = await db.query(
        `
        SELECT u.id, u.name, u.email, u.phone, u.dob
        FROM users u
        JOIN doctor_patient dp ON dp.patient_id = u.id
        WHERE dp.doctor_id = ?
        `,
        [doctorId]
      );

      res.json({
        success: true,
        patients,
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
