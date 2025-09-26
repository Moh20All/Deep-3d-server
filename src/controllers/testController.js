// GET /test/token - Test token validation (for debugging)
const testToken = (req, res) => {
    res.json({
        success: true,
        message: 'Token is valid!',
        user: req.user,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    testToken
};
