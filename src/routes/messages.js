const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// 💬 Send a message (doctor or patient)
router.post('/', auth, async (req, res) => {
  try {
    const { receiver_id, message } = req.body;

    if (!receiver_id || !message) {
      return res.status(400).json({ success: false, error: 'receiver_id and message are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
      [req.user.id, receiver_id, message]
    );

    res.json({ success: true, messageId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📩 Get messages between current user and another user
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
       ORDER BY sent_at ASC`,
      [req.user.id, userId, userId, req.user.id]
    );

    res.json({ success: true, messages: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
