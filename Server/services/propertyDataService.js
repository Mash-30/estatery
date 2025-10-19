// Mock real estate data service that simulates Zillow-like property listings
// This provides realistic property data for development and testing

import mongoose from 'mongoose';

const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse', 'Studio', 'Loft'];
const propertyStatuses = ['For Sale', 'For Rent', 'Sold', 'Pending'];
const cities = [
  { name: 'New York', state: 'NY', zip: '10001' },
  { name: 'Los Angeles', state: 'CA', zip: '90210' },
  { name: 'Chicago', state: 'IL', zip: '60601' },
  { name: 'Houston', state: 'TX', zip: '77001' },
  { name: 'Phoenix', state: 'AZ', zip: '85001' },
  { name: 'Philadelphia', state: 'PA', zip: '19101' },
  { name: 'San Antonio', state: 'TX', zip: '78201' },
  { name: 'San Diego', state: 'CA', zip: '92101' },
  { name: 'Dallas', state: 'TX', zip: '75201' },
  { name: 'San Jose', state: 'CA', zip: '95101' },
  { name: 'Austin', state: 'TX', zip: '73301' },
  { name: 'Jacksonville', state: 'FL', zip: '32201' },
  { name: 'Fort Worth', state: 'TX', zip: '76101' },
  { name: 'Columbus', state: 'OH', zip: '43201' },
  { name: 'Charlotte', state: 'NC', zip: '28201' },
  { name: 'San Francisco', state: 'CA', zip: '94101' },
  { name: 'Indianapolis', state: 'IN', zip: '46201' },
  { name: 'Seattle', state: 'WA', zip: '98101' },
  { name: 'Denver', state: 'CO', zip: '80201' },
  { name: 'Washington', state: 'DC', zip: '20001' }
];

const amenities = [
  'Swimming Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Fireplace',
  'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer', 'Pet Friendly',
  'Furnished', 'Hardwood Floors', 'Granite Countertops', 'Walk-in Closet',
  'High Ceilings', 'City View', 'Mountain View', 'Ocean View', 'Rooftop Access'
];

const features = [
  'Open Floor Plan', 'Modern Kitchen', 'Updated Bathroom', 'New Appliances',
  'Energy Efficient', 'Smart Home', 'Security System', 'Cable Ready',
  'High-Speed Internet', 'Laundry Room', 'Storage Space', 'Patio',
  'Deck', 'Garage', 'Basement', 'Attic', 'Central Air', 'Forced Air Heating'
];

// Generate realistic property images using Unsplash
const generatePropertyImages = (type, count = 5) => {
  const imageTypes = {
    'House': ['house-exterior', 'modern-house', 'home-interior', 'kitchen', 'bedroom'],
    'Apartment': ['apartment-building', 'modern-apartment', 'apartment-interior', 'city-apartment', 'apartment-kitchen'],
    'Condo': ['condo-building', 'condo-interior', 'condo-kitchen', 'condo-living-room', 'condo-bathroom'],
    'Townhouse': ['townhouse', 'townhouse-interior', 'townhouse-kitchen', 'townhouse-living', 'townhouse-exterior'],
    'Studio': ['studio-apartment', 'small-apartment', 'studio-interior', 'studio-kitchen', 'studio-living'],
    'Loft': ['loft-apartment', 'industrial-loft', 'modern-loft', 'loft-interior', 'loft-kitchen']
  };
  
  const typeImages = imageTypes[type] || imageTypes['House'];
  return typeImages.slice(0, count).map((imageType, index) => 
    `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 1000000000}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&${imageType}`
  );
};

// Generate realistic property data
const generateProperty = (id) => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const status = propertyStatuses[Math.floor(Math.random() * propertyStatuses.length)];
  
  // Generate realistic pricing based on location and type
  const basePrice = {
    'New York': { 'House': 800000, 'Apartment': 600000, 'Condo': 700000, 'Townhouse': 750000, 'Studio': 400000, 'Loft': 650000 },
    'Los Angeles': { 'House': 700000, 'Apartment': 500000, 'Condo': 600000, 'Townhouse': 650000, 'Studio': 350000, 'Loft': 550000 },
    'San Francisco': { 'House': 1200000, 'Apartment': 800000, 'Condo': 900000, 'Townhouse': 1000000, 'Studio': 600000, 'Loft': 850000 },
    'Seattle': { 'House': 600000, 'Apartment': 450000, 'Condo': 500000, 'Townhouse': 550000, 'Studio': 300000, 'Loft': 450000 },
    'Chicago': { 'House': 400000, 'Apartment': 300000, 'Condo': 350000, 'Townhouse': 375000, 'Studio': 200000, 'Loft': 325000 },
    'Houston': { 'House': 350000, 'Apartment': 250000, 'Condo': 300000, 'Townhouse': 325000, 'Studio': 180000, 'Loft': 275000 },
    'Austin': { 'House': 450000, 'Apartment': 350000, 'Condo': 400000, 'Townhouse': 425000, 'Studio': 250000, 'Loft': 375000 },
    'Denver': { 'House': 500000, 'Apartment': 400000, 'Condo': 450000, 'Townhouse': 475000, 'Studio': 280000, 'Loft': 425000 }
  };
  
  const cityPrices = basePrice[city.name] || basePrice['Chicago'];
  const basePriceValue = cityPrices[type] || cityPrices['House'];
  
  // Add random variation (±20%)
  const priceVariation = 0.8 + (Math.random() * 0.4);
  const price = Math.round(basePriceValue * priceVariation);
  
  // Generate realistic square footage
  const sqftRanges = {
    'House': [1200, 4000],
    'Apartment': [600, 2000],
    'Condo': [800, 2500],
    'Townhouse': [1000, 3000],
    'Studio': [300, 800],
    'Loft': [600, 2000]
  };
  
  const [minSqft, maxSqft] = sqftRanges[type] || sqftRanges['House'];
  const sqft = Math.floor(minSqft + Math.random() * (maxSqft - minSqft));
  
  // Generate bedrooms and bathrooms
  const bedroomRanges = {
    'House': [2, 5],
    'Apartment': [1, 3],
    'Condo': [1, 3],
    'Townhouse': [2, 4],
    'Studio': [0, 1],
    'Loft': [1, 2]
  };
  
  const [minBedrooms, maxBedrooms] = bedroomRanges[type] || bedroomRanges['House'];
  const bedrooms = Math.floor(minBedrooms + Math.random() * (maxBedrooms - minBedrooms + 1));
  const bathrooms = Math.max(1, Math.floor(bedrooms * (0.5 + Math.random() * 0.5)));
  
  // Generate random amenities and features
  const numAmenities = Math.floor(3 + Math.random() * 8);
  const numFeatures = Math.floor(2 + Math.random() * 6);
  const propertyAmenities = amenities.sort(() => 0.5 - Math.random()).slice(0, numAmenities);
  const propertyFeatures = features.sort(() => 0.5 - Math.random()).slice(0, numFeatures);
  
  // Generate realistic address
  const streetNumbers = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const streetNames = ['Main St', 'Oak Ave', 'Pine St', 'Maple Dr', 'Cedar Ln', 'Elm St', 'First Ave', 'Second St', 'Park Ave', 'Broadway'];
  const streetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
  const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
  
  const property = {
    _id: new mongoose.Types.ObjectId(),
    title: `${bedrooms} Bedroom ${type} in ${city.name}`,
    description: `Beautiful ${type.toLowerCase()} located in the heart of ${city.name}. This property features ${bedrooms} bedrooms and ${bathrooms} bathrooms, perfect for ${bedrooms > 2 ? 'families' : 'individuals or couples'}. The property includes modern amenities and is conveniently located near shopping, dining, and transportation.`,
    type,
    status,
    price,
    sqft,
    bedrooms,
    bathrooms,
    yearBuilt: Math.floor(1950 + Math.random() * 74), // Built between 1950-2024
    lotSize: type === 'House' ? Math.floor(5000 + Math.random() * 15000) : null, // Square feet
    images: generatePropertyImages(type),
    location: {
      address: `${streetNumber} ${streetName}`,
      city: city.name,
      state: city.state,
      zipCode: city.zip,
      coordinates: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1, // Rough NYC area
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      }
    },
    amenities: propertyAmenities,
    features: propertyFeatures,
    propertyDetails: {
      heating: ['Central Air', 'Forced Air', 'Radiant', 'Heat Pump'][Math.floor(Math.random() * 4)],
      cooling: ['Central Air', 'Window Units', 'None'][Math.floor(Math.random() * 3)],
      parking: ['Garage', 'Street', 'Driveway', 'None'][Math.floor(Math.random() * 4)],
      hoa: type === 'Condo' || type === 'Townhouse' ? Math.floor(100 + Math.random() * 400) : null,
      propertyTax: Math.floor(price * 0.01 * (0.5 + Math.random() * 1)), // 0.5-1.5% of price
      mlsNumber: `MLS${Math.floor(100000 + Math.random() * 900000)}`
    },
    agent: {
      name: ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson', 'David Brown', 'Emily Taylor'][Math.floor(Math.random() * 6)],
      email: `agent${Math.floor(Math.random() * 1000)}@realestate.com`,
      phone: `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      company: ['Century 21', 'RE/MAX', 'Coldwell Banker', 'Keller Williams', 'Sotheby\'s', 'Compass'][Math.floor(Math.random() * 6)]
    },
    owner: {
      _id: new mongoose.Types.ObjectId(),
      name: ['Property Owner', 'Real Estate LLC', 'Investment Group'][Math.floor(Math.random() * 3)]
    },
    views: Math.floor(Math.random() * 1000),
    favorites: Math.floor(Math.random() * 100),
    isActive: true,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
    updatedAt: new Date()
  };
  
  return property;
};

// Generate a large dataset of properties
const generateProperties = (count = 100) => {
  const properties = [];
  for (let i = 1; i <= count; i++) {
    properties.push(generateProperty(i));
  }
  return properties;
};

// Search and filter functions
const searchProperties = (properties, filters) => {
  let filtered = [...properties];
  
  // Text search
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(property => 
      property.title.toLowerCase().includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm) ||
      property.location.city.toLowerCase().includes(searchTerm) ||
      property.location.state.toLowerCase().includes(searchTerm) ||
      property.location.address.toLowerCase().includes(searchTerm)
    );
  }
  
  // Price range
  if (filters.minPrice) {
    filtered = filtered.filter(property => property.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(property => property.price <= filters.maxPrice);
  }
  
  // Property type
  if (filters.type && filters.type.length > 0) {
    filtered = filtered.filter(property => filters.type.includes(property.type));
  }
  
  // Status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(property => filters.status.includes(property.status));
  }
  
  // Bedrooms
  if (filters.minBedrooms) {
    filtered = filtered.filter(property => property.bedrooms >= filters.minBedrooms);
  }
  if (filters.maxBedrooms) {
    filtered = filtered.filter(property => property.bedrooms <= filters.maxBedrooms);
  }
  
  // Bathrooms
  if (filters.minBathrooms) {
    filtered = filtered.filter(property => property.bathrooms >= filters.minBathrooms);
  }
  if (filters.maxBathrooms) {
    filtered = filtered.filter(property => property.bathrooms <= filters.maxBathrooms);
  }
  
  // Square footage
  if (filters.minSqft) {
    filtered = filtered.filter(property => property.sqft >= filters.minSqft);
  }
  if (filters.maxSqft) {
    filtered = filtered.filter(property => property.sqft <= filters.maxSqft);
  }
  
  // Location
  if (filters.city) {
    filtered = filtered.filter(property => 
      property.location.city.toLowerCase().includes(filters.city.toLowerCase())
    );
  }
  if (filters.state) {
    filtered = filtered.filter(property => 
      property.location.state.toLowerCase().includes(filters.state.toLowerCase())
    );
  }
  
  // Amenities
  if (filters.amenities && filters.amenities.length > 0) {
    filtered = filtered.filter(property => 
      filters.amenities.every(amenity => property.amenities.includes(amenity))
    );
  }
  
  return filtered;
};

// Sort properties
const sortProperties = (properties, sortBy = 'createdAt', order = 'desc') => {
  return [...properties].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'location') {
      aValue = a.location.city;
      bValue = b.location.city;
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Get featured properties (most viewed/favorited)
const getFeaturedProperties = (properties, count = 6) => {
  return [...properties]
    .sort((a, b) => (b.views + b.favorites) - (a.views + a.favorites))
    .slice(0, count);
};

// Get similar properties
const getSimilarProperties = (property, allProperties, count = 4) => {
  return allProperties
    .filter(p => 
      p._id !== property._id && 
      (p.type === property.type || 
       p.location.city === property.location.city ||
       Math.abs(p.price - property.price) < property.price * 0.3)
    )
    .slice(0, count);
};

// Get property statistics
const getPropertyStats = (properties) => {
  const stats = {
    total: properties.length,
    forSale: properties.filter(p => p.status === 'For Sale').length,
    forRent: properties.filter(p => p.status === 'For Rent').length,
    sold: properties.filter(p => p.status === 'Sold').length,
    pending: properties.filter(p => p.status === 'Pending').length,
    averagePrice: Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length),
    averageSqft: Math.round(properties.reduce((sum, p) => sum + p.sqft, 0) / properties.length),
    averageBedrooms: Math.round(properties.reduce((sum, p) => sum + p.bedrooms, 0) / properties.length),
    averageBathrooms: Math.round(properties.reduce((sum, p) => sum + p.bathrooms, 0) / properties.length),
    priceRange: {
      min: Math.min(...properties.map(p => p.price)),
      max: Math.max(...properties.map(p => p.price))
    },
    sqftRange: {
      min: Math.min(...properties.map(p => p.sqft)),
      max: Math.max(...properties.map(p => p.sqft))
    }
  };
  
  return stats;
};

export {
  generateProperties,
  searchProperties,
  sortProperties,
  getFeaturedProperties,
  getSimilarProperties,
  getPropertyStats,
  propertyTypes,
  propertyStatuses,
  amenities,
  features,
  cities
};
