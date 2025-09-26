const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 100
    },
    description: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 500
    },
    filePath: { 
        type: String, 
        required: true 
    },
    thumbnailPath: { 
        type: String,
        default: null
    },
    uploadedBy: { 
        type: String, 
        required: true 
    },
    fileSize: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // New fields for categories and tags
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }]
}, {
    timestamps: true
});

// Index for better query performance
modelSchema.index({ name: 'text', description: 'text' });
modelSchema.index({ uploadedBy: 1 });
modelSchema.index({ isActive: 1 });
modelSchema.index({ category: 1 });
modelSchema.index({ tags: 1 });

// Virtual for file URL
modelSchema.virtual('fileUrl').get(function() {
    // Normalize path separators and extract filename
    const normalizedPath = this.filePath.replace(/\\/g, '/');
    const filename = normalizedPath.split('/').pop();
    
    // Use direct URL construction to avoid config issues
    return `http://localhost:3001/uploads/models/${filename}`;
});

// Virtual for thumbnail URL
modelSchema.virtual('thumbnailUrl').get(function() {
    if (this.thumbnailPath) {
        // Normalize path separators and extract filename
        const normalizedPath = this.thumbnailPath.replace(/\\/g, '/');
        const filename = normalizedPath.split('/').pop();
        return `http://localhost:3001/uploads/thumbnails/${filename}`;
    }
    return null;
});

// Ensure virtual fields are serialized
modelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Model', modelSchema);