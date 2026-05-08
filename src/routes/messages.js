const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate } = require("../middleware/auth");

// 👥 Get chat contacts + unread count
router.get("/contacts/list", authenticate, async (req, res) => {
  try {
    const { id, role } = req.user;

    let query;

    if (role === "doctor") {
      query = `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,

          (
            SELECT COUNT(*)
            FROM messages m
            WHERE m.sender_id = u.id
              AND m.receiver_id = ?
              AND m.is_read = FALSE
          ) AS unread_count

        FROM users u
        JOIN doctor_patient dp ON dp.patient_id = u.id
        WHERE dp.doctor_id = ?
      `;
    } else if (role === "patient") {
      query = `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,

          (
            SELECT COUNT(*)
            FROM messages m
            WHERE m.sender_id = u.id
              AND m.receiver_id = ?
              AND m.is_read = FALSE
          ) AS unread_count

        FROM users u
        JOIN doctor_patient dp ON dp.doctor_id = u.id
        WHERE dp.patient_id = ?
      `;
    } else {
      return res.status(403).json({
        success: false,
        message: "Only doctors and patients can access chat contacts",
      });
    }

    const [contacts] = await db.query(query, [id, id]);

    res.json({
      success: true,
      contacts,
    });
  } catch (err) {
    console.error("GET CONTACTS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error while loading contacts",
    });
  }
});

// 💬 Send message
router.post("/", authenticate, async (req, res) => {
  try {
    const { receiver_id, message } = req.body;

    if (!receiver_id || !message) {
      return res.status(400).json({
        success: false,
        message: "receiver_id and message are required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO messages 
      (sender_id, receiver_id, message)
      VALUES (?, ?, ?)
      `,
      [req.user.id, receiver_id, message]
    );

    res.status(201).json({
      success: true,
      messageId: result.insertId,
    });
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error while sending message",
    });
  }
});

// 📩 Get messages between users
router.get("/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    // mark incoming messages as read
    await db.query(
      `
      UPDATE messages
      SET is_read = TRUE
      WHERE sender_id = ?
        AND receiver_id = ?
        AND is_read = FALSE
      `,
      [userId, req.user.id]
    );

    const [rows] = await db.query(
      `
      SELECT *
      FROM messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY sent_at ASC
      `,
      [req.user.id, userId, userId, req.user.id]
    );

    res.json({
      success: true,
      messages: rows,
    });
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error while loading messages",
    });
  }
});

module.exports = router;