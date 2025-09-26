const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./src/config/database');

// Import routes
const routes = require('./src/routes');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
connectDB();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow frontend and MadrassaPlay backend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));
app.use('/libs', express.static('node_modules'));

// Use routes
app.use('/', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 3D Model Serving Platform running on http://localhost:${PORT}`);
    console.log('📊 API endpoints: /api/* (teacher), /admin/* (admin), /view/* (students)');
    console.log('📁 Static files served from /public');
    console.log('🔧 Organized structure: routes, controllers, models, middleware');
    console.log('Press Ctrl+C to stop the server');
});

