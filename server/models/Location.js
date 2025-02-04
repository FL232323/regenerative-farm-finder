const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['farm', 'store', 'restaurant'],
    index: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    }
  },
  certifications: [{
    type: String,
    enum: ['Organic', 'Regenerative', 'Biodynamic', 'Other']
  }],
  products: [{
    name: String,
    category: String,
    seasonal: Boolean
  }],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  description: String,
  images: [String],
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Create geospatial index for location queries
locationSchema.index({ coordinates: '2dsphere' });

// Add timestamps
locationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Location', locationSchema);