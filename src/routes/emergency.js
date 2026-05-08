const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate } = require("../middleware/auth");

// POST /api/emergency
router.post("/", authenticate, async (req, res) => {
  try {
    const { emergency_type, description, location } = req.body;

    if (!emergency_type || !description) {
      return res.status(400).json({
        success: false,
        message: "Emergency type and description are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO emergencies 
       (patient_id, emergency_type, description, location)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, emergency_type, description, location || null]
    );

    res.status(201).json({
      success: true,
      message: "Emergency request submitted",
      emergencyId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;