const Model = require('../models/Model');
const jwt = require('jsonwebtoken');

// GET /api/models - Get all available models
const getModels = async (req, res) => {
    try {
        console.log('🔍 [DEBUG] getModels called');
        console.log('🔍 [DEBUG] Query params:', req.query);
        console.log('🔍 [DEBUG] User info:', req.user);
        
        const { category, tag } = req.query;
        
        let filter = { isActive: true };
        console.log('🔍 [DEBUG] Initial filter:', filter);
        
        // Add category filter
        if (category) {
            filter.category = category;
            console.log('🔍 [DEBUG] Added category filter:', category);
        }
        
        // Add tag filter
        if (tag) {
            filter.tags = tag;
            console.log('🔍 [DEBUG] Added tag filter:', tag);
        }
        
        console.log('🔍 [DEBUG] Final filter:', filter);
        
        const models = await Model.find(filter, 'name description filePath thumbnailPath createdAt category tags')
            .populate('category', 'name description')
            .populate('tags', 'name')
            .sort({ createdAt: -1 });
        
        console.log('🔍 [DEBUG] Found models:', models.length);
        console.log('🔍 [DEBUG] Models data:', models);
        
        res.json({
            success: true,
            data: models,
            count: models.length
        });
    } catch (error) {
        console.error('❌ [ERROR] getModels error:', error);
        console.error('❌ [ERROR] Error message:', error.message);
        console.error('❌ [ERROR] Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch models' 
        });
    }
};

// GET /api/models/:id - Get specific model data
const getModelById = async (req, res) => {
    try {
        const model = await Model.findById(req.params.id)
            .populate('category', 'name description')
            .populate('tags', 'name');
        
        if (!model) {
            return res.status(404).json({ 
                success: false, 
                error: 'Model not found' 
            });
        }
        
        res.json({
            success: true,
            data: model
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch model' 
        });
    }
};

// POST /api/models/:id/share - Generate shareable link for students
const generateShareLink = async (req, res) => {
    try {
        const model = await Model.findById(req.params.id)
            .populate('category', 'name')
            .populate('tags', 'name');
        
        if (!model) {
            return res.status(404).json({ 
                success: false, 
                error: 'Model not found' 
            });
        }

        // Generate temporary token for this specific model
        const shareToken = jwt.sign(
            { 
                modelId: model._id,
                type: 'share',
                teacherId: req.user.userId 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const shareUrl = `${req.protocol}://${req.get('host')}/view/${model._id}?token=${shareToken}`;
        
        res.json({
            success: true,
            data: {
                shareUrl,
                expiresIn: '24h',
                modelName: model.name,
                modelId: model._id,
                category: model.category,
                tags: model.tags
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate share link' 
        });
    }
};

module.exports = {
    getModels,
    getModelById,
    generateShareLink
};