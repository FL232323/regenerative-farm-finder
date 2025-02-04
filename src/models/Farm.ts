import mongoose from 'mongoose';

export interface IFarm extends mongoose.Document {
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  description?: string;
  practices?: string[];
  products?: string[];
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  imageUrl?: string;
}

const FarmSchema = new mongoose.Schema<IFarm>({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v: [number, number]) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    }
  },
  description: { 
    type: String, 
    trim: true 
  },
  practices: [{ 
    type: String, 
    trim: true 
  }],
  products: [{ 
    type: String, 
    trim: true 
  }],
  contactInfo: {
    email: { 
      type: String, 
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: { 
      type: String, 
      trim: true 
    },
    website: { 
      type: String, 
      trim: true,
      match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please fill a valid website URL']
    }
  },
  imageUrl: { 
    type: String, 
    trim: true 
  }
}, {
  timestamps: true
});

// Create a geospatial index
FarmSchema.index({ location: '2dsphere' });

// Prevent duplicate farm names
FarmSchema.index({ name: 1 }, { unique: true });

export default mongoose.models.Farm || mongoose.model<IFarm>('Farm', FarmSchema);
