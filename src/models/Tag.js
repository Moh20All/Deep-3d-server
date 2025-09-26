const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50
    }
}, {
    timestamps: true
});

// Index is already created by unique: true

module.exports = mongoose.model('Tag', tagSchema);
