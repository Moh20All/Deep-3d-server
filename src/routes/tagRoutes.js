const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
    createTag,
    getTags,
    updateTag,
    deleteTag
} = require('../controllers/tagController');

// All tag routes require JWT authentication
router.use(authenticateUser);

// POST /admin/tags - Create new tag
router.post('/', createTag);

// GET /admin/tags - Get all tags
router.get('/', getTags);

// PUT /admin/tags/:id - Update tag
router.put('/:id', updateTag);

// DELETE /admin/tags/:id - Delete tag
router.delete('/:id', deleteTag);

module.exports = router;
