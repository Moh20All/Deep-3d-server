const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// All category routes require JWT authentication
router.use(authenticateUser);

// POST /admin/categories - Create new category
router.post('/', createCategory);

// GET /admin/categories - Get all categories
router.get('/', getCategories);

// PUT /admin/categories/:id - Update category
router.put('/:id', updateCategory);

// DELETE /admin/categories/:id - Delete category
router.delete('/:id', deleteCategory);

module.exports = router;
