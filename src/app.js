require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');             // DB connection
const authRoutes = require('./routes/auth'); // Auth routes
const authMiddleware = require('./middleware/auth');
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Mini Health API - Step 1 ready' });
});

// Test DB connection
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS now');
    res.json({ success: true, time: rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Routes
app.use('/auth', authRoutes);
const appointmentRoutes = require('./routes/appointments');
app.use('/appointments', appointmentRoutes);
const prescriptionRoutes = require('./routes/prescriptions');
app.use('/prescriptions', prescriptionRoutes);
const messageRoutes = require('./routes/messages');
app.use('/messages', messageRoutes);
const doctorRoutes = require("./routes/doctor");
app.use("/doctor", doctorRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
const recordsRoutes = require('./routes/records');
app.use('/records', recordsRoutes);
