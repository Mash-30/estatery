import { validationResult } from 'express-validator';
import { 
  fetchRentalListings, 
  getRentalMarketStats as getRentalMarketStatsFromService, 
  generateRentalProperties 
} from '../services/rentalApiService.js';

// Get rental listings with real API integration
const getRentalListings = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search,
      type,
      minPrice, 
      maxPrice, 
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      minSqft,
      maxSqft,
      city,
      state,
      amenities: amenitiesFilter,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filters object
    const filters = {
      page: Number(page),
      limit: Number(limit),
      search,
      type,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minBedrooms: minBedrooms ? Number(minBedrooms) : undefined,
      maxBedrooms: maxBedrooms ? Number(maxBedrooms) : undefined,
      minBathrooms: minBathrooms ? Number(minBathrooms) : undefined,
      maxBathrooms: maxBathrooms ? Number(maxBathrooms) : undefined,
      minSqft: minSqft ? Number(minSqft) : undefined,
      maxSqft: maxSqft ? Number(maxSqft) : undefined,
      city,
      state,
      amenities: amenitiesFilter ? (Array.isArray(amenitiesFilter) ? amenitiesFilter : [amenitiesFilter]) : undefined,
      sortBy,
      sortOrder
    };
    
    // Fetch rental listings from real APIs or enhanced mock data
    const result = await fetchRentalListings(filters);
    
    // Apply client-side filtering if needed (for mock data)
    let filteredProperties = result.properties;
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProperties = filteredProperties.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.location.city.toLowerCase().includes(searchTerm) ||
        property.location.state.toLowerCase().includes(searchTerm) ||
        property.location.address.toLowerCase().includes(searchTerm)
      );
    }
    
    if (type) {
      const types = Array.isArray(type) ? type : [type];
      filteredProperties = filteredProperties.filter(property => types.includes(property.type));
    }
    
    if (minPrice) {
      filteredProperties = filteredProperties.filter(property => property.price >= minPrice);
    }
    
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(property => property.price <= maxPrice);
    }
    
    if (minBedrooms) {
      filteredProperties = filteredProperties.filter(property => property.bedrooms >= minBedrooms);
    }
    
    if (maxBedrooms) {
      filteredProperties = filteredProperties.filter(property => property.bedrooms <= maxBedrooms);
    }
    
    if (minBathrooms) {
      filteredProperties = filteredProperties.filter(property => property.bathrooms >= minBathrooms);
    }
    
    if (maxBathrooms) {
      filteredProperties = filteredProperties.filter(property => property.bathrooms <= maxBathrooms);
    }
    
    if (minSqft) {
      filteredProperties = filteredProperties.filter(property => property.sqft >= minSqft);
    }
    
    if (maxSqft) {
      filteredProperties = filteredProperties.filter(property => property.sqft <= maxSqft);
    }
    
    if (city) {
      filteredProperties = filteredProperties.filter(property => 
        property.location.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    if (state) {
      filteredProperties = filteredProperties.filter(property => 
        property.location.state.toLowerCase().includes(state.toLowerCase())
      );
    }
    
    if (amenitiesFilter) {
      const amenities = Array.isArray(amenitiesFilter) ? amenitiesFilter : [amenitiesFilter];
      filteredProperties = filteredProperties.filter(property => 
        amenities.every(amenity => property.amenities.includes(amenity))
      );
    }
    
    // Apply sorting
    if (sortBy && sortOrder) {
      filteredProperties.sort((a, b) => {
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
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
    
    res.json({
      properties: paginatedProperties,
      totalPages: Math.ceil(filteredProperties.length / limit),
      currentPage: Number(page),
      total: filteredProperties.length,
      sources: result.sources,
      marketData: result.marketData,
      filters: {
        availableTypes: ['Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Loft'],
        availableStatuses: ['For Rent'],
        availableAmenities: [
          'Swimming Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Fireplace',
          'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer', 'Pet Friendly',
          'Furnished', 'Hardwood Floors', 'Granite Countertops', 'Walk-in Closet',
          'High Ceilings', 'City View', 'Mountain View', 'Ocean View', 'Rooftop Access',
          'Concierge', 'Doorman', 'Elevator', 'Laundry Room', 'Storage'
        ],
        availableCities: Object.keys(result.marketData)
      }
    });
  } catch (error) {
    console.error('Error fetching rental listings:', error);
    res.status(500).json({ 
      message: 'Error fetching rental listings', 
      error: error.message 
    });
  }
};

// Get rental market statistics
const getRentalMarketStats = async (req, res) => {
  try {
    const stats = getRentalMarketStatsFromService();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching rental market stats:', error);
    res.status(500).json({ 
      message: 'Error fetching rental market statistics', 
      error: error.message 
    });
  }
};

// Get featured rental properties
const getFeaturedRentals = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    // Generate featured rentals (most popular/trending)
    const featuredRentals = generateRentalProperties(Number(limit));
    
    // Sort by views and favorites to get most popular
    featuredRentals.sort((a, b) => (b.views + b.favorites) - (a.views + a.favorites));
    
    res.json({
      properties: featuredRentals,
      count: featuredRentals.length
    });
  } catch (error) {
    console.error('Error fetching featured rentals:', error);
    res.status(500).json({ 
      message: 'Error fetching featured rentals', 
      error: error.message 
    });
  }
};

// Get single rental property
const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Generate a single rental property (in real implementation, this would fetch from database)
    const rental = generateRentalProperties(1)[0];
    rental._id = id;
    
    // Get similar rentals
    const similarRentals = generateRentalProperties(4);
    
    res.json({
      property: rental,
      similarProperties: similarRentals
    });
  } catch (error) {
    console.error('Error fetching rental property:', error);
    res.status(500).json({ 
      message: 'Error fetching rental property', 
      error: error.message 
    });
  }
};

// Search rentals with advanced filters
const searchRentals = async (req, res) => {
  try {
    const filters = req.body;
    
    // Fetch rental listings with the provided filters
    const result = await fetchRentalListings(filters);
    
    res.json({
      properties: result.properties,
      total: result.total,
      sources: result.sources,
      marketData: result.marketData,
      filters
    });
  } catch (error) {
    console.error('Error searching rentals:', error);
    res.status(500).json({ 
      message: 'Error searching rentals', 
      error: error.message 
    });
  }
};

// Get rental filter options
const getRentalFilterOptions = async (req, res) => {
  try {
    res.json({
      types: ['Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Loft'],
      statuses: ['For Rent'],
      amenities: [
        'Swimming Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Fireplace',
        'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer', 'Pet Friendly',
        'Furnished', 'Hardwood Floors', 'Granite Countertops', 'Walk-in Closet',
        'High Ceilings', 'City View', 'Mountain View', 'Ocean View', 'Rooftop Access',
        'Concierge', 'Doorman', 'Elevator', 'Laundry Room', 'Storage'
      ],
      features: [
        'Open Floor Plan', 'Modern Kitchen', 'Updated Bathroom', 'New Appliances',
        'Energy Efficient', 'Smart Home', 'Security System', 'Cable Ready',
        'High-Speed Internet', 'Laundry Room', 'Storage Space', 'Patio',
        'Deck', 'Garage', 'Basement', 'Attic', 'Central Air', 'Forced Air Heating'
      ],
      cities: [
        'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
        'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
        'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis',
        'Seattle', 'Denver', 'Washington'
      ]
    });
  } catch (error) {
    console.error('Error fetching rental filter options:', error);
    res.status(500).json({ 
      message: 'Error fetching rental filter options', 
      error: error.message 
    });
  }
};

// Get search suggestions for rentals
const getRentalSearchSuggestions = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }
    
    const query = q.toLowerCase();
    const suggestions = [];
    
    // Generate some rental properties to search through
    const rentals = generateRentalProperties(20);
    
    // Search in titles
    const titleMatches = rentals
      .filter(rental => rental.title.toLowerCase().includes(query))
      .slice(0, 3)
      .map(rental => ({
        type: 'property',
        value: rental.title,
        label: rental.title,
        count: Math.floor(Math.random() * 100) + 10
      }));
    
    // Search in locations
    const locationMatches = rentals
      .filter(rental => 
        rental.location.city.toLowerCase().includes(query) ||
        rental.location.state.toLowerCase().includes(query)
      )
      .slice(0, 3)
      .map(rental => ({
        type: 'location',
        value: `${rental.location.city}, ${rental.location.state}`,
        label: `${rental.location.city}, ${rental.location.state}`,
        count: Math.floor(Math.random() * 50) + 5
      }));
    
    // Search in amenities
    const amenityMatches = rentals
      .flatMap(rental => rental.amenities)
      .filter(amenity => amenity.toLowerCase().includes(query))
      .slice(0, 3)
      .map(amenity => ({
        type: 'amenity',
        value: amenity,
        label: amenity,
        count: Math.floor(Math.random() * 30) + 3
      }));
    
    // Combine and deduplicate suggestions
    const allSuggestions = [...titleMatches, ...locationMatches, ...amenityMatches];
    const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.value === suggestion.value)
    ).slice(0, limit);
    
    res.json({ suggestions: uniqueSuggestions });
  } catch (error) {
    console.error('Error fetching rental search suggestions:', error);
    res.status(500).json({ 
      message: 'Error fetching search suggestions', 
      error: error.message 
    });
  }
};

// Seed rental database
const seedRentals = async (req, res) => {
  try {
    // Only allow seeding in development or by admin
    if (process.env.NODE_ENV === 'production' && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to seed database' });
    }
    
    const { count = 100 } = req.body;
    
    // Generate rental properties
    const rentalProperties = generateRentalProperties(count);
    
    res.json({
      message: `Successfully generated ${count} rental properties`,
      count: rentalProperties.length,
      properties: rentalProperties.slice(0, 5) // Return first 5 as sample
    });
  } catch (error) {
    console.error('Error seeding rentals:', error);
    res.status(500).json({ 
      message: 'Error seeding rentals', 
      error: error.message 
    });
  }
};

export {
  getRentalListings,
  getRentalMarketStats,
  getFeaturedRentals,
  getRentalById,
  searchRentals,
  getRentalFilterOptions,
  getRentalSearchSuggestions,
  seedRentals
};
