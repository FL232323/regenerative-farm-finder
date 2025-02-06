import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a farm name'],
    trim: true,
  },
  location: {
    type: pointSchema,
    required: true,
    index: '2dsphere'
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
  businessType: {
    type: [String],
    enum: ['Farm', 'Grocery Store', 'Farmers Market', 'Restaurant', 'Pickup Location'],
    default: ['Farm']
  },
  practices: [{
    type: String,
    enum: ['Organic', 'Biodynamic', 'Permaculture', 'Regenerative', 'Other'],
  }],
  deliveryOptions: {
    localPickup: {
      type: Boolean,
      default: false
    },
    delivery: {
      type: Boolean,
      default: false
    },
    deliveryRange: {
      type: Number,
      min: 0
    },
    pickupDetails: String,
    deliveryDetails: String
  },
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

const Farm = mongoose.models.Farm || mongoose.model('Farm', farmSchema);

export default Farm;