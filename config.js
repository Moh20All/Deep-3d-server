// 3D Model Serving Platform Configuration
module.exports = {
    // Server Configuration
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Database Configuration
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/3d-model-service',
    
    // JWT Configuration
    jwtSharedSecret: process.env.JWT_SHARED_SECRET || 'your_very_long_and_secure_shared_secret_key_here_change_this_in_production',
    jwtAdminSecret: process.env.JWT_ADMIN_SECRET || 'your_admin_specific_secret_key_here_change_this_in_production',
    jwtExpiresIn: '24h',
    
    // Admin API Key
    adminApiKey: process.env.ADMIN_API_KEY || 'admin_api_key_change_this_in_production',
    
    // File Upload Configuration
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800, // 50MB
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'glb,gltf').split(','),
    
    // CORS Configuration
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    
    // Model Base URL for file serving
    modelBaseUrl: process.env.MODEL_BASE_URL || 'http://localhost:3001',
    
    // Upload paths
    uploadPath: 'public/uploads',
    modelsPath: 'public/uploads/models',
    thumbnailsPath: 'public/uploads/thumbnails'
};
