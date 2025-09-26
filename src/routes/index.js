const express = require('express');
const router = express.Router();

// Import route modules
const teacherRoutes = require('./teacherRoutes');
const adminRoutes = require('./adminRoutes');
const studentRoutes = require('./studentRoutes');
const publicRoutes = require('./publicRoutes');
const testRoutes = require('./testRoutes');
const categoryRoutes = require('./categoryRoutes');
const tagRoutes = require('./tagRoutes');
const shareRoutes = require('./shareRoutes');

// Mount routes
router.use('/api/shared', shareRoutes); // /api/shared/* -> share routes (public)
router.use('/api', teacherRoutes);      // /api/* -> teacher routes
router.use('/admin', adminRoutes);      // /admin/* -> admin routes
router.use('/admin/categories', categoryRoutes); // /admin/categories/* -> category routes
router.use('/admin/tags', tagRoutes);   // /admin/tags/* -> tag routes
router.use('/', studentRoutes);         // /view/* -> student routes
router.use('/', publicRoutes);          // /, /status -> public routes
router.use('/test', testRoutes);        // /test/* -> test routes

module.exports = router;