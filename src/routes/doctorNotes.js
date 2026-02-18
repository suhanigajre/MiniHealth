const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, authorizeRoles } = require("../middleware/auth");

/* 📝 Add doctor note (DOCTOR only) */
router.post(
  "/",
  authenticate,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const { note } = req.body;

      if (!note) {
        return res.status(400).json({
          success: false,
          message: "Note is required",
        });
      }

      await db.query(
        `INSERT INTO doctor_notes (doctor_id, note)
         VALUES (?, ?)`,
        [req.user.id, note]
      );

      res.status(201).json({
        success: true,
        message: "Doctor note added successfully",
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
