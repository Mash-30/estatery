import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['House', 'Apartment', 'Condo', 'Townhouse', 'Studio', 'Loft', 'Land', 'Commercial'],
    required: true
  },
  status: {
    type: String,
    enum: ['For Sale', 'For Rent', 'Sold', 'Pending', 'Off Market'],
    default: 'For Sale'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sqft: {
    type: Number,
    min: 0
  },
  bedrooms: {
    type: Number,
    min: 0,
    default: 0
  },
  bathrooms: {
    type: Number,
    min: 0,
    default: 0
  },
  yearBuilt: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  lotSize: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  amenities: [{
    type: String
  }],
  features: [{
    type: String
  }],
  propertyDetails: {
    heating: {
      type: String,
      enum: ['Central Air', 'Forced Air', 'Radiant', 'Heat Pump', 'Baseboard', 'Other']
    },
    cooling: {
      type: String,
      enum: ['Central Air', 'Window Units', 'None', 'Other']
    },
    parking: {
      type: String,
      enum: ['Garage', 'Street', 'Driveway', 'None', 'Other']
    },
    hoa: {
      type: Number,
      min: 0
    },
    propertyTax: {
      type: Number,
      min: 0
    },
    mlsNumber: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  agent: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    }
  },
  owner: {
    _id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  favorites: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Virtual fields for backward compatibility
  propertyType: {
    type: String,
    get: function() {
      return this.type;
    }
  },
  squareFeet: {
    type: Number,
    get: function() {
      return this.sqft;
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better search performance
propertySchema.index({ 'location.city': 1, 'location.state': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ bedrooms: 1, bathrooms: 1 });
propertySchema.index({ sqft: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ views: -1 });
propertySchema.index({ favorites: -1 });

// Text search index
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.address': 'text',
  'location.city': 'text',
  'location.state': 'text'
});

// Virtual for price per square foot
propertySchema.virtual('pricePerSqft').get(function() {
  if (this.sqft && this.sqft > 0) {
    return Math.round(this.price / this.sqft);
  }
  return null;
});

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} ${this.location.zipCode}`;
});

// Method to increment views
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment favorites
propertySchema.methods.incrementFavorites = function() {
  this.favorites += 1;
  return this.save();
};

// Method to decrement favorites
propertySchema.methods.decrementFavorites = function() {
  if (this.favorites > 0) {
    this.favorites -= 1;
  }
  return this.save();
};

// Static method to get featured properties
propertySchema.statics.getFeatured = function(limit = 6) {
  return this.find({ isActive: true })
    .sort({ views: -1, favorites: -1 })
    .limit(limit);
};

// Static method to search properties
propertySchema.statics.search = function(filters = {}, page = 1, limit = 10) {
  const query = { isActive: true };
  
  // Text search
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  // Price range
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }
  
  // Property type
  if (filters.type && filters.type.length > 0) {
    query.type = { $in: filters.type };
  }
  
  // Status
  if (filters.status && filters.status.length > 0) {
    query.status = { $in: filters.status };
  }
  
  // Bedrooms
  if (filters.minBedrooms || filters.maxBedrooms) {
    query.bedrooms = {};
    if (filters.minBedrooms) query.bedrooms.$gte = filters.minBedrooms;
    if (filters.maxBedrooms) query.bedrooms.$lte = filters.maxBedrooms;
  }
  
  // Bathrooms
  if (filters.minBathrooms || filters.maxBathrooms) {
    query.bathrooms = {};
    if (filters.minBathrooms) query.bathrooms.$gte = filters.minBathrooms;
    if (filters.maxBathrooms) query.bathrooms.$lte = filters.maxBathrooms;
  }
  
  // Square footage
  if (filters.minSqft || filters.maxSqft) {
    query.sqft = {};
    if (filters.minSqft) query.sqft.$gte = filters.minSqft;
    if (filters.maxSqft) query.sqft.$lte = filters.maxSqft;
  }
  
  // Location
  if (filters.city) {
    query['location.city'] = new RegExp(filters.city, 'i');
  }
  if (filters.state) {
    query['location.state'] = new RegExp(filters.state, 'i');
  }
  
  // Amenities
  if (filters.amenities && filters.amenities.length > 0) {
    query.amenities = { $all: filters.amenities };
  }
  
  const skip = (page - 1) * limit;
  
  return this.find(query)
    .sort(filters.sortBy ? { [filters.sortBy]: filters.sortOrder || -1 } : { createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export default mongoose.model('Property', propertySchema);
