const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const upload = require('../config/upload');
const {
    getAdminInfo,
    uploadModel,
    updateModel,
    deleteModel,
    getAllModels
} = require('../controllers/adminController');

// GET /admin/info - Get admin info (public)
router.get('/info', getAdminInfo);

// All other admin routes require JWT authentication
router.use(authenticateUser);

// GET /admin/models - Get all models
router.get('/models', getAllModels);

// POST /admin/models - Upload new model
router.post('/models', upload.single('modelFile'), uploadModel);

// PUT /admin/models/:id - Update model information
router.put('/models/:id', updateModel);

// DELETE /admin/models/:id - Delete model
router.delete('/models/:id', deleteModel);

module.exports = router;