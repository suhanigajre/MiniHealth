router.post("/", auth, async (req, res) => {
  const { note } = req.body;
  await pool.query(
    "INSERT INTO doctor_notes (doctor_id, note) VALUES (?, ?)",
    [req.user.id, note]
  );
  res.json({ success: true });
});
