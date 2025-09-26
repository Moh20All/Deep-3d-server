const jwt = require('jsonwebtoken');

// JWT Middleware for All Authentication (No Role Checking)
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('🔍 Auth middleware - Token received:', token ? 'Yes' : 'No');
    console.log('🔍 Auth middleware - JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    if (!token) {
        console.log('❌ No token provided');
        return res.status(401).json({ 
            success: false,
            error: 'Access denied. No token provided.' 
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ JWT decoded successfully:', decoded);
        
        // MadrassaPlay tokens have 'id' field, not 'userId'
        const userId = decoded.id;
        
        if (!userId) {
            console.log('❌ No user ID in token');
            return res.status(401).json({ 
                success: false,
                error: 'Invalid token format. Missing user ID.' 
            });
        }
        
        // Just set user info - no role checking
        req.user = { 
            userId: userId, 
            role: 'user' // Generic role since frontend controls access
        };
        console.log('✅ User authenticated:', req.user);
        next();
        
    } catch (error) {
        console.log('❌ JWT verification error:', error.message);
        res.status(401).json({ 
            success: false,
            error: 'Invalid token.' 
        });
    }
};

// Middleware to validate share tokens for student access
const validateShareToken = (req, res, next) => {
    const { token } = req.query;
    const modelId = req.params.id;
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'No access token provided' 
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.type !== 'share' || decoded.modelId !== modelId) {
            return res.status(403).json({ 
                success: false,
                error: 'Invalid or expired access token' 
            });
        }
        
        req.shareToken = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false,
            error: 'Invalid or expired access token' 
        });
    }
};

module.exports = {
    authenticateUser,
    validateShareToken
};