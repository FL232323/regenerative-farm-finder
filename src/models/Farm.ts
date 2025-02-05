import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a farm name'],
    trim: true,
  },
  businessType: {
    type: [String],
    required: true,
    enum: ['Restaurant', 'Grocery Store', 'Farmers Market', 'Farm Store', 'Co-op Pickup', 'Farm'],
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
  },
  description: {
    type: String,
    required: [true, 'Please provide a farm description'],
  },
  products: [{
    category: String,
    items: [{
      name: String,
      availability: {
        type: String,
        enum: ['Year-round', 'Seasonal', 'Limited'],
        default: 'Year-round'
      }
    }]
  }],
  operatingHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    open: String,
    close: String,
  }],
  scheduledTimes: [{
    day: String,
    time: String,
    notes: String,
  }],
  shippingOptions: {
    offersShipping: {
      type: Boolean,
      default: false
    },
    radius: Number,
    minimumOrder: Number,
    shippingNotes: String
  },
  practices: [{
    type: String,
    enum: ['Regenerative', 'Organic', 'Biodynamic', 'Grass-fed', 'Pastured'],
  }],
  contact: {
    phone: String,
    email: String,
    website: String,
  },
  images: [{
    url: String,
    caption: String
  }],
});

// Create a geospatial index on the location field
farmSchema.index({ location: '2dsphere' });

// Prevent mongoose from creating a model multiple times during hot reloading
const Farm = mongoose.models.Farm || mongoose.model('Farm', farmSchema);

export default Farm;