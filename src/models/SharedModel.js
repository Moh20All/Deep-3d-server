const mongoose = require('mongoose');

const sharedModelSchema = new mongoose.Schema({
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    required: true
  },
  authKey: {
    type: String,
    unique: true
  },
  sharedBy: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Default to 30 days from now
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  accessCount: {
    type: Number,
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: null
  },
  shareUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Generate auth key before saving
sharedModelSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate a secure random auth key
    this.authKey = require('crypto').randomBytes(32).toString('hex');
    this.shareUrl = `${process.env.MODEL_BASE_URL || 'http://localhost:3001'}/api/shared/view/${this.authKey}`;
  }
  next();
});

// Virtual for checking if share is expired
sharedModelSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Virtual for checking if share is valid
sharedModelSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired;
});

// Index for efficient queries
sharedModelSchema.index({ authKey: 1 });
sharedModelSchema.index({ modelId: 1 });
sharedModelSchema.index({ sharedBy: 1 });
sharedModelSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('SharedModel', sharedModelSchema);
