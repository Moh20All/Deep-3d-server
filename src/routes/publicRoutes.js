const express = require('express');
const router = express.Router();
const {
    getMainPage,
    getServerStatus
} = require('../controllers/publicController');

// GET / - Main page
router.get('/', getMainPage);

// GET /status - Server status
router.get('/status', getServerStatus);

module.exports = router;
