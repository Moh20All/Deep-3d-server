const express = require('express');
const router = express.Router();
const { validateShareToken } = require('../middleware/auth');
const {
    getViewerPage,
    getModelFile,
    getModelInfo
} = require('../controllers/studentController');

// GET /view/:id - Student viewer page with token validation
router.get('/view/:id', getViewerPage);

// GET /api/view/:id/model - Get model file for viewer (with token validation)
router.get('/api/view/:id/model', validateShareToken, getModelFile);

// GET /api/view/:id/info - Get model info for viewer (with token validation)
router.get('/api/view/:id/info', validateShareToken, getModelInfo);

module.exports = router;
