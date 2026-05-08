require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const db = require("./db");

const app = express();

// Routes
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const prescriptionRoutes = require("./routes/prescriptions");
const messageRoutes = require("./routes/messages");
const doctorRoutes = require("./routes/doctor");
const recordsRoutes = require("./routes/records");
const assignRoutes = require("./routes/assign");
const patientRoutes = require("./routes/patient");
const doctorNotesRoutes = require("./routes/doctorNotes");
const emergencyRoutes = require("./routes/emergency");
const insightsRoutes = require("./routes/insights");

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Mini Health API running" });
});

// DB test
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS now");
    res.json({ success: true, time: rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", assignRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/records", recordsRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor-notes", doctorNotesRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/insights", insightsRoutes);

// Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});