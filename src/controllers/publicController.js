// GET / - Main page
const getMainPage = (req, res) => {
    res.sendFile(require('path').join(__dirname, '../../public/index.html'));
};

// GET /status - Server status
const getServerStatus = (req, res) => {
    res.json({
        status: 'running',
        service: '3D Model Serving Platform',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
};

module.exports = {
    getMainPage,
    getServerStatus
};
