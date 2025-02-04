import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a farm name'],
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  description: {
    type: String,
    required: [true, 'Please provide a farm description'],
  },
  practices: [{
    type: String,
    enum: ['Organic', 'Biodynamic', 'Permaculture', 'Regenerative', 'Other'],
  }],
  website: String,
  phone: String,
  email: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a geospatial index on the location field
farmSchema.index({ location: '2dsphere' });

// Prevent mongoose from creating a model multiple times during hot reloading
const Farm = mongoose.models.Farm || mongoose.model('Farm', farmSchema);

export default Farm;
