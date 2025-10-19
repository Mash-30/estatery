import Property from '../models/Property.js';
import { validationResult } from 'express-validator';
import { 
  generateProperties, 
  searchProperties as searchPropertiesFromService, 
  sortProperties, 
  getFeaturedProperties as getFeaturedPropertiesFromService, 
  getSimilarProperties, 
  getPropertyStats as getPropertyStatsFromService,
  propertyTypes,
  propertyStatuses,
  amenities,
  features,
  cities
} from '../services/propertyDataService.js';

// Get all properties with advanced search and filtering
const getAllProperties = async (req, res) => {
  try {
    // Fallback response if no database connection
    if (!process.env.MONGODB_URI) {
      return res.json({
        properties: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        message: 'Database not configured'
      });
    }
    const { 
      page = 1, 
      limit = 12, 
      search,
      type,
      status,
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
    const filters = {};
    if (search) filters.search = search;
    if (type) filters.type = Array.isArray(type) ? type : [type];
    if (status) filters.status = Array.isArray(status) ? status : [status];
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (minBedrooms) filters.minBedrooms = Number(minBedrooms);
    if (maxBedrooms) filters.maxBedrooms = Number(maxBedrooms);
    if (minBathrooms) filters.minBathrooms = Number(minBathrooms);
    if (maxBathrooms) filters.maxBathrooms = Number(maxBathrooms);
    if (minSqft) filters.minSqft = Number(minSqft);
    if (maxSqft) filters.maxSqft = Number(maxSqft);
    if (city) filters.city = city;
    if (state) filters.state = state;
    if (amenitiesFilter) {
      filters.amenities = Array.isArray(amenitiesFilter) ? amenitiesFilter : [amenitiesFilter];
    }
    
    // Check if we have properties in database, if not, seed with mock data
    const existingCount = await Property.countDocuments();
    if (existingCount === 0) {
      console.log('Seeding database with mock property data...');
      const mockProperties = generateProperties(100);
      await Property.insertMany(mockProperties);
    }
    
    // Use the model's search method for database queries
    const properties = await Property.search(filters, Number(page), Number(limit));
    const total = await Property.countDocuments(Property.search(filters, 1, 1000));
    
    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
      filters: {
        availableTypes: propertyTypes,
        availableStatuses: propertyStatuses,
        availableAmenities: amenities,
        availableFeatures: features,
        availableCities: cities
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
};

// Get single property with view tracking
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Increment view count
    await property.incrementViews();
    
    // Get similar properties
    const allProperties = await Property.find({ isActive: true, _id: { $ne: property._id } });
    const similarProperties = getSimilarProperties(property, allProperties, 4);
    
    res.json({
      property,
      similarProperties
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
};

// Create new property
const createProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const property = new Property({
      ...req.body,
      owner: req.user.id // Assuming user is authenticated
    });
    
    await property.save();
    await property.populate('owner', 'firstName lastName email');
    
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error creating property', error: error.message });
  }
};

// Update property
const updateProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check if user owns the property or is admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }
    
    Object.assign(property, req.body);
    await property.save();
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error: error.message });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check if user owns the property or is admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }
    
    await Property.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
};

// Get featured properties
const getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    // Fallback response if no database connection
    if (!process.env.MONGODB_URI) {
      return res.json({
        properties: [],
        message: 'Database not configured'
      });
    }
    
    // Check if we have properties in database, if not, seed with mock data
    const existingCount = await Property.countDocuments();
    if (existingCount === 0) {
      console.log('Seeding database with mock property data...');
      const mockProperties = generateProperties(100);
      await Property.insertMany(mockProperties);
    }
    
    const properties = await Property.getFeatured(Number(limit));
    
    res.json({
      properties,
      count: properties.length
    });
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    res.status(500).json({ message: 'Error fetching featured properties', error: error.message });
  }
};

// Get property statistics
const getPropertyStats = async (req, res) => {
  try {
    // Fallback response if no database connection
    if (!process.env.MONGODB_URI) {
      return res.json({
        totalProperties: 0,
        totalAgents: 0,
        totalClients: 0,
        message: 'Database not configured'
      });
    }

    const allProperties = await Property.find({ isActive: true });
    const stats = getPropertyStatsFromService(allProperties);
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching property stats:', error);
    res.status(500).json({ message: 'Error fetching property statistics', error: error.message });
  }
};

// Search properties with advanced filters
const searchProperties = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12,
      search,
      type,
      status,
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
    } = req.body;
    
    // Build filters object
    const filters = {};
    if (search) filters.search = search;
    if (type) filters.type = Array.isArray(type) ? type : [type];
    if (status) filters.status = Array.isArray(status) ? status : [status];
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (minBedrooms) filters.minBedrooms = Number(minBedrooms);
    if (maxBedrooms) filters.maxBedrooms = Number(maxBedrooms);
    if (minBathrooms) filters.minBathrooms = Number(minBathrooms);
    if (maxBathrooms) filters.maxBathrooms = Number(maxBathrooms);
    if (minSqft) filters.minSqft = Number(minSqft);
    if (maxSqft) filters.maxSqft = Number(maxSqft);
    if (city) filters.city = city;
    if (state) filters.state = state;
    if (amenitiesFilter) {
      filters.amenities = Array.isArray(amenitiesFilter) ? amenitiesFilter : [amenitiesFilter];
    }
    
    // Check if we have properties in database, if not, seed with mock data
    const existingCount = await Property.countDocuments();
    if (existingCount === 0) {
      console.log('Seeding database with mock property data...');
      const mockProperties = generateProperties(100);
      await Property.insertMany(mockProperties);
    }
    
    // Use the model's search method for database queries
    const properties = await Property.search(filters, Number(page), Number(limit));
    const total = await Property.countDocuments(Property.search(filters, 1, 1000));
    
    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
      filters
    });
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ message: 'Error searching properties', error: error.message });
  }
};

// Get filter options
const getFilterOptions = async (req, res) => {
  try {
    res.json({
      types: propertyTypes,
      statuses: propertyStatuses,
      amenities: amenities,
      features: features,
      cities: cities
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ message: 'Error fetching filter options', error: error.message });
  }
};

// Get search suggestions
const getSearchSuggestions = async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }
    
    // Get properties matching the search query
    const properties = await Property.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.city': { $regex: query, $options: 'i' } },
        { 'location.state': { $regex: query, $options: 'i' } },
        { 'location.address': { $regex: query, $options: 'i' } }
      ]
    }).limit(Number(limit));
    
    // Get unique cities matching the query
    const cities = await Property.distinct('location.city', {
      'location.city': { $regex: query, $options: 'i' }
    });
    
    // Get amenities matching the query
    const matchingAmenities = amenities.filter(amenity => 
      amenity.toLowerCase().includes(query.toLowerCase())
    );
    
    const suggestions = [
      // Property suggestions
      ...properties.map(property => ({
        type: 'property',
        value: property.title,
        label: property.title,
        count: property.views
      })),
      
      // City suggestions
      ...cities.slice(0, 3).map(city => ({
        type: 'location',
        value: city,
        label: city
      })),
      
      // Amenity suggestions
      ...matchingAmenities.slice(0, 3).map(amenity => ({
        type: 'amenity',
        value: amenity,
        label: amenity
      }))
    ];
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({ 
      message: 'Error fetching search suggestions', 
      error: error.message 
    });
  }
};

// Seed database with mock data
const seedProperties = async (req, res) => {
  try {
    // Only allow seeding in development or by admin
    if (process.env.NODE_ENV === 'production' && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to seed database' });
    }
    
    const { count = 100 } = req.body;
    
    // Clear existing properties
    await Property.deleteMany({});
    
    // Generate and insert new properties
    const mockProperties = generateProperties(count);
    await Property.insertMany(mockProperties);
    
    res.json({
      message: `Successfully seeded database with ${count} properties`,
      count: mockProperties.length
    });
  } catch (error) {
    console.error('Error seeding properties:', error);
    res.status(500).json({ message: 'Error seeding properties', error: error.message });
  }
};

// Toggle property favorite
const toggleFavorite = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // For now, just increment/decrement favorites
    // In a real app, you'd track user favorites in a separate collection
    const { action } = req.body; // 'add' or 'remove'
    
    if (action === 'add') {
      await property.incrementFavorites();
    } else if (action === 'remove') {
      await property.decrementFavorites();
    }
    
    res.json({
      message: `Property ${action === 'add' ? 'added to' : 'removed from'} favorites`,
      favorites: property.favorites
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: 'Error toggling favorite', error: error.message });
  }
};

export {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  getPropertyStats,
  searchProperties,
  getFilterOptions,
  getSearchSuggestions,
  seedProperties,
  toggleFavorite
};
