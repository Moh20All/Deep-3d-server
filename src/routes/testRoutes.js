const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { testToken } = require('../controllers/testController');

// Test route for token validation
router.get('/token', authenticateUser, testToken);

module.exports = router;