const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Index is already created by unique: true

module.exports = mongoose.model('Category', categorySchema);
