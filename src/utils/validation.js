// Validation helpers
const validateModelData = (data) => {
    const errors = [];
    
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Name is required');
    }
    
    if (data.name && data.name.length > 100) {
        errors.push('Name must be less than 100 characters');
    }
    
    if (!data.description || data.description.trim().length === 0) {
        errors.push('Description is required');
    }
    
    if (data.description && data.description.length > 500) {
        errors.push('Description must be less than 500 characters');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

const validateFileUpload = (file) => {
    const errors = [];
    
    if (!file) {
        errors.push('No file provided');
        return { isValid: false, errors };
    }
    
    const allowedTypes = ['model/gltf-binary'];
    const allowedExtensions = ['.glb'];
    
    if (!allowedTypes.includes(file.mimetype) && !allowedExtensions.some(ext => file.originalname.endsWith(ext))) {
        errors.push('Only .glb files are allowed');
    }
    
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        errors.push('File size must be less than 50MB');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateModelData,
    validateFileUpload
};
