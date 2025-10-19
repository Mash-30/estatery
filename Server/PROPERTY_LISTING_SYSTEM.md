# Property Listing System Documentation

## Overview

This document describes the comprehensive property listing system implemented for the Real Estate application. The system provides Zillow-like functionality with real estate data, advanced search capabilities, and a modern user interface.

## Features

### 🏠 Property Management
- **Comprehensive Property Data**: Detailed property information including price, square footage, bedrooms, bathrooms, amenities, and more
- **Multiple Property Types**: Support for Houses, Apartments, Condos, Townhouses, Studios, and Lofts
- **Property Status Tracking**: For Sale, For Rent, Sold, Pending, and Off Market statuses
- **Image Gallery**: Multiple property images with thumbnail navigation
- **Agent Information**: Complete agent details with contact information

### 🔍 Advanced Search & Filtering
- **Text Search**: Search by property title, description, address, city, or state
- **Price Range**: Filter by minimum and maximum price
- **Property Type**: Filter by specific property types
- **Location**: Filter by city and state
- **Bedrooms/Bathrooms**: Range filtering for bedrooms and bathrooms
- **Square Footage**: Filter by property size
- **Amenities**: Multi-select amenity filtering
- **Sorting Options**: Sort by price, size, date, popularity, and more

### 📊 Analytics & Statistics
- **View Tracking**: Track property views for popularity metrics
- **Favorite System**: Users can favorite properties
- **Property Statistics**: Comprehensive stats including average prices, total listings, etc.
- **Featured Properties**: Highlight popular and trending properties

### 🎨 User Interface
- **Responsive Design**: Mobile-first responsive design
- **Modern UI Components**: Clean, professional interface with Tailwind CSS
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Image Galleries**: Full-screen image viewing with navigation
- **Pagination**: Efficient pagination for large property lists

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Get All Properties
```
GET /api/properties
```
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `search` (string): Text search
- `type` (string|array): Property type filter
- `status` (string|array): Property status filter
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `minBedrooms` (number): Minimum bedrooms filter
- `maxBedrooms` (number): Maximum bedrooms filter
- `minBathrooms` (number): Minimum bathrooms filter
- `maxBathrooms` (number): Maximum bathrooms filter
- `minSqft` (number): Minimum square footage filter
- `maxSqft` (number): Maximum square footage filter
- `city` (string): City filter
- `state` (string): State filter
- `amenities` (array): Amenities filter
- `sortBy` (string): Sort field (default: 'createdAt')
- `sortOrder` (string): Sort order 'asc' or 'desc' (default: 'desc')

**Response:**
```json
{
  "properties": [...],
  "totalPages": 10,
  "currentPage": 1,
  "total": 100,
  "filters": {
    "availableTypes": [...],
    "availableStatuses": [...],
    "availableAmenities": [...],
    "availableFeatures": [...],
    "availableCities": [...]
  }
}
```

#### Get Featured Properties
```
GET /api/properties/featured?limit=6
```

#### Get Property Statistics
```
GET /api/properties/stats
```

#### Get Filter Options
```
GET /api/properties/filters
```

#### Get Single Property
```
GET /api/properties/:id
```

#### Advanced Search
```
POST /api/properties/search
```
**Request Body:**
```json
{
  "search": "string",
  "type": ["House", "Apartment"],
  "status": ["For Sale", "For Rent"],
  "minPrice": 100000,
  "maxPrice": 500000,
  "minBedrooms": 2,
  "maxBedrooms": 4,
  "minBathrooms": 1,
  "maxBathrooms": 3,
  "minSqft": 1000,
  "maxSqft": 3000,
  "city": "New York",
  "state": "NY",
  "amenities": ["Swimming Pool", "Gym"],
  "sortBy": "price",
  "sortOrder": "asc"
}
```

### Protected Endpoints (Authentication Required)

#### Toggle Property Favorite
```
POST /api/properties/:id/favorite
```
**Request Body:**
```json
{
  "action": "add" // or "remove"
}
```

#### Create Property
```
POST /api/properties
```

#### Update Property
```
PUT /api/properties/:id
```

#### Delete Property
```
DELETE /api/properties/:id
```

### Admin Endpoints

#### Seed Database
```
POST /api/properties/seed
```
**Request Body:**
```json
{
  "count": 100
}
```

## Data Models

### Property Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  type: String (enum: ['House', 'Apartment', 'Condo', 'Townhouse', 'Studio', 'Loft', 'Land', 'Commercial']),
  status: String (enum: ['For Sale', 'For Rent', 'Sold', 'Pending', 'Off Market']),
  price: Number (required, min: 0),
  sqft: Number (min: 0),
  bedrooms: Number (min: 0, default: 0),
  bathrooms: Number (min: 0, default: 0),
  yearBuilt: Number (min: 1800, max: current year),
  lotSize: Number (min: 0),
  images: [String] (required),
  location: {
    address: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    coordinates: {
      lat: Number (required),
      lng: Number (required)
    }
  },
  amenities: [String],
  features: [String],
  propertyDetails: {
    heating: String (enum: ['Central Air', 'Forced Air', 'Radiant', 'Heat Pump', 'Baseboard', 'Other']),
    cooling: String (enum: ['Central Air', 'Window Units', 'None', 'Other']),
    parking: String (enum: ['Garage', 'Street', 'Driveway', 'None', 'Other']),
    hoa: Number (min: 0),
    propertyTax: Number (min: 0),
    mlsNumber: String (unique, sparse)
  },
  agent: {
    name: String (required),
    email: String (required),
    phone: String (required),
    company: String (required)
  },
  owner: {
    _id: String (required),
    name: String (required)
  },
  views: Number (default: 0, min: 0),
  favorites: Number (default: 0, min: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Mock Data Service

The system includes a comprehensive mock data service (`propertyDataService.js`) that generates realistic property data including:

### Property Types
- House, Apartment, Condo, Townhouse, Studio, Loft

### Property Statuses
- For Sale, For Rent, Sold, Pending, Off Market

### Amenities
- Swimming Pool, Gym, Parking, Balcony, Garden, Fireplace, Air Conditioning, Heating, Dishwasher, Washer/Dryer, Pet Friendly, Furnished, Hardwood Floors, Granite Countertops, Walk-in Closet, High Ceilings, City View, Mountain View, Ocean View, Rooftop Access

### Features
- Open Floor Plan, Modern Kitchen, Updated Bathroom, New Appliances, Energy Efficient, Smart Home, Security System, Cable Ready, High-Speed Internet, Laundry Room, Storage Space, Patio, Deck, Garage, Basement, Attic, Central Air, Forced Air Heating

### Cities
- Major US cities including New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Jose, Austin, Jacksonville, Fort Worth, Columbus, Charlotte, San Francisco, Indianapolis, Seattle, Denver, Washington DC

## Database Indexes

The system includes optimized database indexes for performance:

```javascript
// Location indexes
{ 'location.city': 1, 'location.state': 1 }

// Property attributes
{ price: 1 }
{ type: 1 }
{ status: 1 }
{ bedrooms: 1, bathrooms: 1 }
{ sqft: 1 }

// Timestamps and popularity
{ createdAt: -1 }
{ views: -1 }
{ favorites: -1 }

// Text search index
{
  title: 'text',
  description: 'text',
  'location.address': 'text',
  'location.city': 'text',
  'location.state': 'text'
}
```

## Frontend Components

### Properties Page (`/properties`)
- Advanced filtering system with collapsible advanced options
- Property grid with hover effects and status badges
- Pagination for large result sets
- Sort options (price, size, date, popularity)
- Real-time search and filter updates

### Property Detail Page (`/properties/:id`)
- Full-screen image gallery with navigation
- Comprehensive property information
- Agent contact details
- Similar properties recommendations
- Favorite and share functionality
- View tracking

### Home Page (`/`)
- Featured properties showcase
- Real-time statistics
- Hero section with call-to-action
- Feature highlights

## Performance Optimizations

### Backend
- Database indexes for fast queries
- Pagination to limit result sets
- Efficient search algorithms
- Caching for frequently accessed data

### Frontend
- React Query for data caching and synchronization
- Lazy loading for images
- Debounced search inputs
- Optimized re-renders with proper state management

## Security Features

- Input validation with express-validator
- Authentication middleware for protected routes
- Role-based access control
- SQL injection prevention with Mongoose
- XSS protection with proper data sanitization

## Usage Examples

### Basic Property Search
```javascript
// Search for houses under $500,000 in New York
const response = await api.get('/properties', {
  params: {
    type: 'House',
    maxPrice: 500000,
    city: 'New York',
    state: 'NY'
  }
});
```

### Advanced Search
```javascript
// Advanced search with multiple criteria
const response = await api.post('/properties/search', {
  type: ['House', 'Condo'],
  status: ['For Sale'],
  minPrice: 200000,
  maxPrice: 800000,
  minBedrooms: 2,
  maxBathrooms: 3,
  amenities: ['Swimming Pool', 'Gym'],
  sortBy: 'price',
  sortOrder: 'asc'
});
```

### Get Featured Properties
```javascript
// Get 6 featured properties for homepage
const response = await api.get('/properties/featured?limit=6');
```

## Environment Variables

Add these to your `.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/realestate

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_super_secure_jwt_refresh_secret_key_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
CORS_MAX_AGE=86400

# Security Configuration
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=2h
```

## Getting Started

1. **Install Dependencies**
   ```bash
   cd Server
   npm install
   
   cd ../Client
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cd Server
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the Application**
   ```bash
   # Terminal 1 - Backend
   cd Server
   npm run dev
   
   # Terminal 2 - Frontend
   cd Client
   npm run dev
   ```

4. **Seed Database (Optional)**
   ```bash
   # Make a POST request to /api/properties/seed with admin authentication
   # Or the database will auto-seed when first accessed
   ```

## API Testing

You can test the API endpoints using tools like Postman, curl, or the built-in frontend interface:

```bash
# Get all properties
curl http://localhost:3000/api/properties

# Get featured properties
curl http://localhost:3000/api/properties/featured

# Get property statistics
curl http://localhost:3000/api/properties/stats

# Search properties
curl -X POST http://localhost:3000/api/properties/search \
  -H "Content-Type: application/json" \
  -d '{"type": ["House"], "maxPrice": 500000}'
```

## Future Enhancements

- **Map Integration**: Add interactive maps for property locations
- **Virtual Tours**: Support for 360° property tours
- **Saved Searches**: Allow users to save and get notified about search criteria
- **Property Comparisons**: Side-by-side property comparison feature
- **Market Analytics**: Price trends and market analysis
- **Mobile App**: React Native mobile application
- **Real-time Notifications**: WebSocket integration for real-time updates
- **Advanced Filtering**: More sophisticated filtering options
- **Property Recommendations**: AI-powered property recommendations
- **Multi-language Support**: Internationalization support

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify database permissions

2. **CORS Issues**
   - Update ALLOWED_ORIGINS in .env
   - Ensure frontend URL is included

3. **Authentication Issues**
   - Check JWT secrets in .env
   - Verify token expiration settings
   - Ensure proper middleware order

4. **Image Loading Issues**
   - Check image URLs in property data
   - Verify CORS settings for image domains
   - Ensure proper image format support

### Performance Issues

1. **Slow Queries**
   - Check database indexes
   - Optimize query parameters
   - Consider pagination limits

2. **Large Bundle Sizes**
   - Implement code splitting
   - Optimize image loading
   - Use lazy loading for components

## Support

For issues or questions about the property listing system:

1. Check this documentation first
2. Review the API endpoints and examples
3. Check the browser console for errors
4. Verify environment configuration
5. Test with the provided API examples

The system is designed to be scalable, maintainable, and user-friendly, providing a solid foundation for a real estate application.
