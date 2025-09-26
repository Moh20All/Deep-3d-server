const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
    getModels,
    getModelById,
    generateShareLink
} = require('../controllers/teacherController');

// All teacher routes require JWT authentication
router.use(authenticateUser);

// GET /api/models - Get all available models
router.get('/models', getModels);

// GET /api/models/:id - Get specific model data
router.get('/models/:id', getModelById);

// POST /api/models/:id/share - Generate shareable link for students
router.post('/models/:id/share', generateShareLink);

module.exports = router;