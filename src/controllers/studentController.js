const Model = require('../models/Model');
const path = require('path');

// GET /view/:id - Student viewer page with token validation
const getViewerPage = async (req, res) => {
    try {
        const { token } = req.query;
        const modelId = req.params.id;
        
        if (!token) {
            return res.status(401).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1>Access Denied</h1>
                        <p>No access token provided.</p>
                    </body>
                </html>
            `);
        }
        
        // Get model data to verify it exists
        const model = await Model.findById(modelId);
        if (!model) {
            return res.status(404).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1>Model Not Found</h1>
                        <p>The requested 3D model could not be found.</p>
                    </body>
                </html>
            `);
        }
        
        // Serve the 3D viewer page
        res.sendFile(path.join(__dirname, '../../public/viewer.html'));
        
    } catch (error) {
        res.status(401).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1>Access Denied</h1>
                    <p>Invalid or expired access token.</p>
                </body>
            </html>
        `);
    }
};

// GET /api/view/:id/model - Get model file for viewer (with token validation)
const getModelFile = async (req, res) => {
    try {
        const model = await Model.findById(req.params.id);
        
        if (!model) {
            return res.status(404).json({ 
                success: false,
                error: 'Model not found' 
            });
        }
        
        // Check if file exists
        if (!require('fs').existsSync(model.filePath)) {
            return res.status(404).json({ 
                success: false,
                error: 'Model file not found' 
            });
        }
        
        // Serve the model file
        res.sendFile(path.join(__dirname, '../../', model.filePath));
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Failed to serve model file' 
        });
    }
};

// GET /api/view/:id/info - Get model info for viewer
const getModelInfo = async (req, res) => {
    try {
        const model = await Model.findById(req.params.id);
        
        if (!model) {
            return res.status(404).json({ 
                success: false,
                error: 'Model not found' 
            });
        }
        
        res.json({
            success: true,
            data: {
                name: model.name,
                description: model.description,
                fileSize: model.fileSize,
                createdAt: model.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch model info' 
        });
    }
};

module.exports = {
    getViewerPage,
    getModelFile,
    getModelInfo
};
