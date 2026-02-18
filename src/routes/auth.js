const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, dob } = req.body;

    // Normalize role safely
    let role = req.body.role
      ? req.body.role.toLowerCase().trim()
      : "patient";

    const allowedRoles = ["patient", "doctor"];
    const userRole = allowedRoles.includes(role)
      ? role
      : "patient";

    // Validate required fields
    if (!name || !email || !password || !phone || !dob) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, role, phone, dob)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, userRole, phone, dob]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId,
      role: userRole,
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


/* ================= LOGIN ================= */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      const [rows] = await pool.query(
        "SELECT id, name, email, password, role FROM users WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const user = rows[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not defined");
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      res.json({
        success: true,
        token,
        role: user.role,
        name: user.name,
        email: user.email,
      });

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;
