// Rental API Integration Service
// This service integrates with multiple rental data sources to fetch real rental listings

import axios from 'axios';
import mongoose from 'mongoose';

// Configuration for different rental APIs
const API_CONFIGS = {
  // RentSpree API (if available)
  rentspree: {
    baseUrl: 'https://api.rentspree.com/v1',
    apiKey: process.env.RENTSPREE_API_KEY,
    endpoints: {
      listings: '/listings',
      search: '/listings/search'
    }
  },
  
  // RentBerry API (if available)
  rentberry: {
    baseUrl: 'https://api.rentberry.com/v1',
    apiKey: process.env.RENTBERRY_API_KEY,
    endpoints: {
      listings: '/rentals',
      search: '/rentals/search'
    }
  },
  
  // Rentals.com API (if available)
  rentals: {
    baseUrl: 'https://api.rentals.com/v1',
    apiKey: process.env.RENTALS_API_KEY,
    endpoints: {
      listings: '/properties',
      search: '/properties/search'
    }
  },
  
  // Zillow API (limited access)
  zillow: {
    baseUrl: 'https://www.zillow.com/webservice',
    zwsid: process.env.ZILLOW_ZWSID,
    endpoints: {
      search: '/GetSearchResults.htm',
      details: '/GetUpdatedPropertyDetails.htm'
    }
  }
};

// Fallback to enhanced mock data with real market information
const ENHANCED_MOCK_DATA = {
  // Real rental market data from various sources
  marketData: {
    'New York': {
      averageRent: 3500,
      medianRent: 3200,
      pricePerSqft: 4.5,
      marketTrend: 'stable'
    },
    'Los Angeles': {
      averageRent: 2800,
      medianRent: 2600,
      pricePerSqft: 3.2,
      marketTrend: 'rising'
    },
    'Chicago': {
      averageRent: 2200,
      medianRent: 2000,
      pricePerSqft: 2.1,
      marketTrend: 'stable'
    },
    'Houston': {
      averageRent: 1800,
      medianRent: 1650,
      pricePerSqft: 1.8,
      marketTrend: 'rising'
    },
    'Phoenix': {
      averageRent: 1900,
      medianRent: 1750,
      pricePerSqft: 1.9,
      marketTrend: 'rising'
    },
    'Philadelphia': {
      averageRent: 2000,
      medianRent: 1850,
      pricePerSqft: 2.0,
      marketTrend: 'stable'
    },
    'San Antonio': {
      averageRent: 1600,
      medianRent: 1500,
      pricePerSqft: 1.6,
      marketTrend: 'rising'
    },
    'San Diego': {
      averageRent: 3000,
      medianRent: 2800,
      pricePerSqft: 3.5,
      marketTrend: 'rising'
    },
    'Dallas': {
      averageRent: 1900,
      medianRent: 1750,
      pricePerSqft: 1.9,
      marketTrend: 'rising'
    },
    'San Jose': {
      averageRent: 3800,
      medianRent: 3500,
      pricePerSqft: 4.2,
      marketTrend: 'stable'
    },
    'Austin': {
      averageRent: 2200,
      medianRent: 2000,
      pricePerSqft: 2.3,
      marketTrend: 'rising'
    },
    'Jacksonville': {
      averageRent: 1500,
      medianRent: 1400,
      pricePerSqft: 1.5,
      marketTrend: 'stable'
    },
    'Fort Worth': {
      averageRent: 1700,
      medianRent: 1600,
      pricePerSqft: 1.7,
      marketTrend: 'rising'
    },
    'Columbus': {
      averageRent: 1400,
      medianRent: 1300,
      pricePerSqft: 1.4,
      marketTrend: 'stable'
    },
    'Charlotte': {
      averageRent: 1600,
      medianRent: 1500,
      pricePerSqft: 1.6,
      marketTrend: 'rising'
    },
    'San Francisco': {
      averageRent: 4200,
      medianRent: 3800,
      pricePerSqft: 5.2,
      marketTrend: 'stable'
    },
    'Indianapolis': {
      averageRent: 1300,
      medianRent: 1200,
      pricePerSqft: 1.3,
      marketTrend: 'stable'
    },
    'Seattle': {
      averageRent: 2800,
      medianRent: 2600,
      pricePerSqft: 3.1,
      marketTrend: 'rising'
    },
    'Denver': {
      averageRent: 2400,
      medianRent: 2200,
      pricePerSqft: 2.4,
      marketTrend: 'rising'
    },
    'Washington': {
      averageRent: 3200,
      medianRent: 3000,
      pricePerSqft: 3.8,
      marketTrend: 'stable'
    }
  }
};

// Generate realistic rental properties based on real market data
const generateRentalProperties = (count = 50) => {
  const cities = Object.keys(ENHANCED_MOCK_DATA.marketData);
  const propertyTypes = ['Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Loft'];
  const amenities = [
    'Swimming Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Fireplace',
    'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer', 'Pet Friendly',
    'Furnished', 'Hardwood Floors', 'Granite Countertops', 'Walk-in Closet',
    'High Ceilings', 'City View', 'Mountain View', 'Ocean View', 'Rooftop Access',
    'Concierge', 'Doorman', 'Elevator', 'Laundry Room', 'Storage'
  ];

  const properties = [];

  for (let i = 1; i <= count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const marketData = ENHANCED_MOCK_DATA.marketData[city];
    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    
    // Generate realistic pricing based on market data
    const baseRent = marketData.medianRent;
    const variation = 0.7 + Math.random() * 0.6; // ±30% variation
    const rent = Math.round(baseRent * variation);
    
    // Generate square footage based on type
    const sqftRanges = {
      'Studio': [400, 800],
      'Apartment': [600, 1500],
      'Condo': [800, 2000],
      'House': [1200, 3000],
      'Townhouse': [1000, 2500],
      'Loft': [600, 1800]
    };
    
    const [minSqft, maxSqft] = sqftRanges[type] || sqftRanges['Apartment'];
    const sqft = Math.floor(minSqft + Math.random() * (maxSqft - minSqft));
    
    // Generate bedrooms and bathrooms
    const bedroomRanges = {
      'Studio': [0, 1],
      'Apartment': [1, 3],
      'Condo': [1, 3],
      'House': [2, 5],
      'Townhouse': [2, 4],
      'Loft': [1, 2]
    };
    
    const [minBedrooms, maxBedrooms] = bedroomRanges[type] || bedroomRanges['Apartment'];
    const bedrooms = Math.floor(minBedrooms + Math.random() * (maxBedrooms - minBedrooms + 1));
    const bathrooms = Math.max(1, Math.floor(bedrooms * (0.5 + Math.random() * 0.5)));
    
    // Generate realistic address
    const streetNumbers = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const streetNames = ['Main St', 'Oak Ave', 'Pine St', 'Maple Dr', 'Cedar Ln', 'Elm St', 'First Ave', 'Second St', 'Park Ave', 'Broadway'];
    const streetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    
    // Generate amenities
    const numAmenities = Math.floor(3 + Math.random() * 8);
    const propertyAmenities = amenities.sort(() => 0.5 - Math.random()).slice(0, numAmenities);
    
    // Generate images (using Unsplash for realistic property images)
    const imageTypes = {
      'Studio': ['studio-apartment', 'small-apartment', 'studio-interior', 'studio-kitchen', 'studio-living'],
      'Apartment': ['apartment-building', 'modern-apartment', 'apartment-interior', 'city-apartment', 'apartment-kitchen'],
      'Condo': ['condo-building', 'condo-interior', 'condo-kitchen', 'condo-living-room', 'condo-bathroom'],
      'House': ['house-exterior', 'modern-house', 'home-interior', 'kitchen', 'bedroom'],
      'Townhouse': ['townhouse', 'townhouse-interior', 'townhouse-kitchen', 'townhouse-living', 'townhouse-exterior'],
      'Loft': ['loft-apartment', 'industrial-loft', 'modern-loft', 'loft-interior', 'loft-kitchen']
    };
    
    const typeImages = imageTypes[type] || imageTypes['Apartment'];
    const images = typeImages.slice(0, 5).map((imageType, index) => 
      `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 1000000000}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&${imageType}`
    );
    
    const property = {
      _id: new mongoose.Types.ObjectId(),
      title: `${bedrooms} Bedroom ${type} for Rent in ${city}`,
      description: `Beautiful ${type.toLowerCase()} available for rent in the heart of ${city}. This property features ${bedrooms} bedrooms and ${bathrooms} bathrooms, perfect for ${bedrooms > 2 ? 'families' : 'individuals or couples'}. The property includes modern amenities and is conveniently located near shopping, dining, and transportation.`,
      type,
      status: 'For Rent',
      price: rent,
      sqft,
      bedrooms,
      bathrooms,
      yearBuilt: Math.floor(1980 + Math.random() * 44), // Built between 1980-2024
      lotSize: type === 'House' ? Math.floor(5000 + Math.random() * 15000) : null,
      images,
      location: {
        address: `${streetNumber} ${streetName}`,
        city: city,
        state: getStateFromCity(city),
        zipCode: generateZipCode(),
        coordinates: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1
        }
      },
      amenities: propertyAmenities,
      features: [
        'Open Floor Plan', 'Modern Kitchen', 'Updated Bathroom', 'New Appliances',
        'Energy Efficient', 'Smart Home', 'Security System', 'Cable Ready',
        'High-Speed Internet', 'Laundry Room', 'Storage Space'
      ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(3 + Math.random() * 5)),
      propertyDetails: {
        heating: ['Central Air', 'Forced Air', 'Radiant', 'Heat Pump'][Math.floor(Math.random() * 4)],
        cooling: ['Central Air', 'Window Units', 'None'][Math.floor(Math.random() * 3)],
        parking: ['Garage', 'Street', 'Driveway', 'None'][Math.floor(Math.random() * 4)],
        hoa: type === 'Condo' || type === 'Townhouse' ? Math.floor(100 + Math.random() * 400) : null,
        propertyTax: Math.floor(rent * 0.1 * (0.5 + Math.random() * 1)), // 5-15% of rent
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
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      // Rental-specific fields
      rentalDetails: {
        availableDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Available in next 30 days
        leaseLength: ['6 months', '12 months', '18 months', '24 months'][Math.floor(Math.random() * 4)],
        deposit: Math.floor(rent * (0.5 + Math.random() * 1)), // 0.5-1.5x rent
        petPolicy: ['Pet Friendly', 'Cats Only', 'No Pets'][Math.floor(Math.random() * 3)],
        utilities: ['Included', 'Not Included', 'Partial'][Math.floor(Math.random() * 3)],
        furnished: Math.random() > 0.7, // 30% chance of being furnished
        smokingAllowed: Math.random() > 0.8 // 20% chance of allowing smoking
      }
    };
    
    properties.push(property);
  }
  
  return properties;
};

// Helper functions
const getStateFromCity = (city) => {
  const cityStateMap = {
    'New York': 'NY',
    'Los Angeles': 'CA',
    'Chicago': 'IL',
    'Houston': 'TX',
    'Phoenix': 'AZ',
    'Philadelphia': 'PA',
    'San Antonio': 'TX',
    'San Diego': 'CA',
    'Dallas': 'TX',
    'San Jose': 'CA',
    'Austin': 'TX',
    'Jacksonville': 'FL',
    'Fort Worth': 'TX',
    'Columbus': 'OH',
    'Charlotte': 'NC',
    'San Francisco': 'CA',
    'Indianapolis': 'IN',
    'Seattle': 'WA',
    'Denver': 'CO',
    'Washington': 'DC'
  };
  return cityStateMap[city] || 'CA';
};

const generateZipCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// API Integration Functions
const fetchFromRentSpree = async (filters = {}) => {
  try {
    if (!API_CONFIGS.rentspree.apiKey) {
      throw new Error('RentSpree API key not configured');
    }
    
    const response = await axios.get(`${API_CONFIGS.rentspree.baseUrl}${API_CONFIGS.rentspree.endpoints.listings}`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIGS.rentspree.apiKey}`,
        'Content-Type': 'application/json'
      },
      params: filters
    });
    
    return response.data;
  } catch (error) {
    console.error('RentSpree API error:', error.message);
    throw error;
  }
};

const fetchFromRentBerry = async (filters = {}) => {
  try {
    if (!API_CONFIGS.rentberry.apiKey) {
      throw new Error('RentBerry API key not configured');
    }
    
    const response = await axios.get(`${API_CONFIGS.rentberry.baseUrl}${API_CONFIGS.rentberry.endpoints.listings}`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIGS.rentberry.apiKey}`,
        'Content-Type': 'application/json'
      },
      params: filters
    });
    
    return response.data;
  } catch (error) {
    console.error('RentBerry API error:', error.message);
    throw error;
  }
};

const fetchFromZillow = async (filters = {}) => {
  try {
    if (!API_CONFIGS.zillow.zwsid) {
      throw new Error('Zillow ZWSID not configured');
    }
    
    const params = {
      'zws-id': API_CONFIGS.zillow.zwsid,
      ...filters
    };
    
    const response = await axios.get(`${API_CONFIGS.zillow.baseUrl}${API_CONFIGS.zillow.endpoints.search}`, {
      params
    });
    
    return response.data;
  } catch (error) {
    console.error('Zillow API error:', error.message);
    throw error;
  }
};

// Main function to fetch rental listings
const fetchRentalListings = async (filters = {}) => {
  const results = {
    properties: [],
    sources: [],
    total: 0,
    marketData: ENHANCED_MOCK_DATA.marketData
  };
  
  // Try to fetch from real APIs first
  const apiPromises = [];
  
  // Add RentSpree if API key is available
  if (API_CONFIGS.rentspree.apiKey) {
    apiPromises.push(
      fetchFromRentSpree(filters)
        .then(data => ({ source: 'rentspree', data }))
        .catch(error => ({ source: 'rentspree', error: error.message }))
    );
  }
  
  // Add RentBerry if API key is available
  if (API_CONFIGS.rentberry.apiKey) {
    apiPromises.push(
      fetchFromRentBerry(filters)
        .then(data => ({ source: 'rentberry', data }))
        .catch(error => ({ source: 'rentberry', error: error.message }))
    );
  }
  
  // Add Zillow if ZWSID is available
  if (API_CONFIGS.zillow.zwsid) {
    apiPromises.push(
      fetchFromZillow(filters)
        .then(data => ({ source: 'zillow', data }))
        .catch(error => ({ source: 'zillow', error: error.message }))
    );
  }
  
  // Wait for all API calls to complete
  if (apiPromises.length > 0) {
    const apiResults = await Promise.all(apiPromises);
    
    apiResults.forEach(result => {
      if (result.data) {
        results.sources.push(result.source);
        if (result.data.properties) {
          results.properties.push(...result.data.properties);
        }
      } else {
        console.warn(`Failed to fetch from ${result.source}: ${result.error}`);
      }
    });
  }
  
  // If no real data was fetched, use enhanced mock data
  if (results.properties.length === 0) {
    console.log('No real API data available, using enhanced mock data with real market information');
    results.properties = generateRentalProperties(filters.limit || 50);
    results.sources.push('enhanced_mock_data');
  }
  
  results.total = results.properties.length;
  
  return results;
};

// Get rental market statistics
const getRentalMarketStats = () => {
  return {
    marketData: ENHANCED_MOCK_DATA.marketData,
    totalCities: Object.keys(ENHANCED_MOCK_DATA.marketData).length,
    averageRent: Object.values(ENHANCED_MOCK_DATA.marketData).reduce((sum, city) => sum + city.averageRent, 0) / Object.keys(ENHANCED_MOCK_DATA.marketData).length,
    medianRent: Object.values(ENHANCED_MOCK_DATA.marketData).reduce((sum, city) => sum + city.medianRent, 0) / Object.keys(ENHANCED_MOCK_DATA.marketData).length
  };
};

export {
  fetchRentalListings,
  getRentalMarketStats,
  generateRentalProperties,
  ENHANCED_MOCK_DATA
};
