const Tag = require('../models/Tag');

// POST /admin/tags - Create new tag
const createTag = async (req, res) => {
    try {
        const { name } = req.body;
        
        const tag = new Tag({ name });
        await tag.save();
        
        res.status(201).json({
            success: true,
            data: tag,
            message: 'Tag created successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: 'Tag name already exists'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to create tag'
            });
        }
    }
};

// GET /admin/tags - Get all tags
const getTags = async (req, res) => {
    try {
        const tags = await Tag.find({})
            .sort({ name: 1 });
        
        res.json({
            success: true,
            data: tags,
            count: tags.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tags'
        });
    }
};

// PUT /admin/tags/:id - Update tag
const updateTag = async (req, res) => {
    try {
        const { name } = req.body;
        
        const tag = await Tag.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );
        
        if (!tag) {
            return res.status(404).json({
                success: false,
                error: 'Tag not found'
            });
        }
        
        res.json({
            success: true,
            data: tag,
            message: 'Tag updated successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: 'Tag name already exists'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to update tag'
            });
        }
    }
};

// DELETE /admin/tags/:id - Delete tag
const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        
        if (!tag) {
            return res.status(404).json({
                success: false,
                error: 'Tag not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Tag deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete tag'
        });
    }
};

module.exports = {
    createTag,
    getTags,
    updateTag,
    deleteTag
};
