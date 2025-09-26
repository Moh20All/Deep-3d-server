const Model = require('../models/Model');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const fs = require('fs');

// GET /admin/info - Get admin info
const getAdminInfo = (req, res) => {
    res.json({
        success: true,
        message: 'Admin access requires JWT authentication',
        instructions: {
            header: 'Authorization',
            description: 'Include your JWT token in the Authorization header',
            example: 'Authorization: Bearer your_jwt_token_here'
        }
    });
};

// POST /admin/models - Upload new model
const uploadModel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No model file provided' 
            });
        }

        const { name, description, categoryId, tagIds } = req.body;
        
        // Get file size
        const stats = fs.statSync(req.file.path);
        const fileSizeInBytes = stats.size;
        
        // Parse tag IDs
        const tags = tagIds ? tagIds.split(',').map(id => id.trim()) : [];
        
        const model = new Model({
            name,
            description,
            filePath: req.file.path,
            fileSize: fileSizeInBytes,
            uploadedBy: req.user.userId,
            category: categoryId || null,
            tags: tags
        });

        await model.save();
        
        // Populate category and tags
        await model.populate('category tags');
        
        res.status(201).json({
            success: true,
            data: model,
            message: 'Model uploaded successfully'
        });
    } catch (error) {
        // Clean up uploaded file if model creation fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        console.error('Model upload error:', error);
        
        // Handle specific validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                error: 'Validation failed',
                details: errors
            });
        }
        
        res.status(500).json({ 
            success: false, 
            error: 'Failed to upload model' 
        });
    }
};

// PUT /admin/models/:id - Update model information
const updateModel = async (req, res) => {
    try {
        const { name, description, categoryId, tagIds } = req.body;
        
        // Parse tag IDs
        const tags = tagIds ? tagIds.split(',').map(id => id.trim()) : [];
        
        const model = await Model.findByIdAndUpdate(
            req.params.id,
            { 
                name, 
                description, 
                category: categoryId || null,
                tags: tags,
                updatedAt: new Date() 
            },
            { new: true, runValidators: true }
        );
        
        if (!model) {
            return res.status(404).json({ 
                success: false, 
                error: 'Model not found' 
            });
        }
        
        // Populate category and tags
        await model.populate('category tags');
        
        res.json({
            success: true,
            data: model,
            message: 'Model updated successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update model' 
        });
    }
};

// DELETE /admin/models/:id - Delete model
const deleteModel = async (req, res) => {
    try {
        const model = await Model.findByIdAndDelete(req.params.id);
        
        if (!model) {
            return res.status(404).json({ 
                success: false, 
                error: 'Model not found' 
            });
        }
        
        // Delete the file from filesystem
        if (fs.existsSync(model.filePath)) {
            fs.unlinkSync(model.filePath);
        }
        
        // Delete thumbnail if exists
        if (model.thumbnailPath && fs.existsSync(model.thumbnailPath)) {
            fs.unlinkSync(model.thumbnailPath);
        }
        
        res.json({
            success: true,
            message: 'Model deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete model' 
        });
    }
};

// GET /admin/models - Get all models
const getAllModels = async (req, res) => {
    try {
        const { category, tag } = req.query;
        
        let filter = {};
        
        // Add category filter
        if (category) {
            filter.category = category;
        }
        
        // Add tag filter
        if (tag) {
            filter.tags = tag;
        }
        
        const models = await Model.find(filter)
            .populate('category', 'name description')
            .populate('tags', 'name')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: models,
            count: models.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch models' 
        });
    }
};

module.exports = {
    getAdminInfo,
    uploadModel,
    updateModel,
    deleteModel,
    getAllModels
};