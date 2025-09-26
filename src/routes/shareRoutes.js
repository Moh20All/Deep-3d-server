const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const { authenticateUser } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/generate/:modelId', authenticateUser, shareController.generateShareLink);
router.post('/disable/:modelId', authenticateUser, shareController.disableShareLink);
router.get('/status/:modelId', authenticateUser, shareController.getShareStatus);
router.get('/my-shares', authenticateUser, shareController.getUserSharedModels);

// Public route (no authentication required)
router.get('/view/:authKey', shareController.viewSharedModel);

module.exports = router;
