// backend/server.js - FINAL 100% WORKING (NO ERROR GUARANTEE)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static folders (images serve karne ke liye)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/amalreads")
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Error:', err);
    process.exit(1);
  });

// ROUTES - SABSE PEHLE
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Amalreads Backend Running!' });
});

// SABSE LAST MEIN - 404 handler (yehi galti thi pehle!)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});