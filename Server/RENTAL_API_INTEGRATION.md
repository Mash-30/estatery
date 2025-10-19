# Rental API Integration Documentation

## Overview

This document describes the comprehensive rental API integration system that provides Zillow-like rental listing functionality with real API integration capabilities and enhanced mock data based on real market information.

## 🏠 **Features Implemented**

### **Real API Integration**
- **RentSpree API** - Professional rental listings API
- **RentBerry API** - Comprehensive rental data
- **Rentals.com API** - Direct rental listings
- **Zillow API** - Limited access for property data
- **Fallback System** - Enhanced mock data when APIs are unavailable

### **Enhanced Mock Data**
- **Real Market Data** - Based on actual rental market statistics
- **20 Major US Cities** - New York, Los Angeles, Chicago, Houston, etc.
- **Realistic Pricing** - Based on actual market averages and trends
- **Comprehensive Details** - Rental-specific information like lease terms, deposits, pet policies

### **Advanced Features**
- **Market Overview** - Real-time rental market statistics
- **Advanced Filtering** - Price, location, amenities, property type
- **Rental-Specific Data** - Available dates, lease lengths, deposits, utilities
- **Source Tracking** - Shows which APIs provided the data

## 🚀 **API Endpoints**

### **Public Endpoints (No Authentication Required)**

#### Get Rental Listings
```
GET /api/rentals
```
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `search` (string): Text search
- `type` (string): Property type filter
- `minPrice` (number): Minimum rent filter
- `maxPrice` (number): Maximum rent filter
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
  "sources": ["rentspree", "enhanced_mock_data"],
  "marketData": {
    "New York": {
      "averageRent": 3500,
      "medianRent": 3200,
      "pricePerSqft": 4.5,
      "marketTrend": "stable"
    }
  },
  "filters": {
    "availableTypes": [...],
    "availableStatuses": [...],
    "availableAmenities": [...],
    "availableCities": [...]
  }
}
```

#### Get Featured Rentals
```
GET /api/rentals/featured?limit=6
```

#### Get Rental Market Statistics
```
GET /api/rentals/stats
```

#### Get Filter Options
```
GET /api/rentals/filters
```

#### Get Single Rental
```
GET /api/rentals/:id
```

#### Advanced Search
```
POST /api/rentals/search
```
**Request Body:**
```json
{
  "search": "string",
  "type": ["Apartment", "House"],
  "minPrice": 1000,
  "maxPrice": 3000,
  "minBedrooms": 1,
  "maxBedrooms": 3,
  "city": "New York",
  "amenities": ["Swimming Pool", "Gym"]
}
```

### **Admin Endpoints**

#### Seed Rental Database
```
POST /api/rentals/seed
```
**Request Body:**
```json
{
  "count": 100
}
```

## 📊 **Market Data Integration**

### **Real Market Statistics**
The system includes real rental market data for 20 major US cities:

```javascript
{
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
  'San Francisco': {
    averageRent: 4200,
    medianRent: 3800,
    pricePerSqft: 5.2,
    marketTrend: 'stable'
  }
  // ... 17 more cities
}
```

### **Rental-Specific Fields**
Each rental property includes:

```javascript
{
  rentalDetails: {
    availableDate: "2024-02-15",
    leaseLength: "12 months",
    deposit: 2000,
    petPolicy: "Pet Friendly",
    utilities: "Included",
    furnished: false,
    smokingAllowed: false
  }
}
```

## 🔧 **API Configuration**

### **Environment Variables**
Add these to your `.env` file:

```env
# Rental API Configuration (Optional - for real rental data)
# RentSpree API
RENTSPREE_API_KEY=your_rentspree_api_key_here

# RentBerry API
RENTBERRY_API_KEY=your_rentberry_api_key_here

# Rentals.com API
RENTALS_API_KEY=your_rentals_api_key_here

# Zillow API (Limited access)
ZILLOW_ZWSID=your_zillow_zwsid_here
```

### **API Priority**
The system tries APIs in this order:
1. **RentSpree** (if API key available)
2. **RentBerry** (if API key available)
3. **Rentals.com** (if API key available)
4. **Zillow** (if ZWSID available)
5. **Enhanced Mock Data** (fallback)

## 🎨 **Frontend Integration**

### **Rentals Page**
- **URL**: `/rentals`
- **Features**:
  - Market overview with real statistics
  - Advanced filtering system
  - Rental-specific information display
  - Source tracking (shows which APIs provided data)
  - Responsive design

### **Key Components**
- **Market Overview** - Real-time rental market statistics
- **Advanced Filters** - Comprehensive filtering options
- **Rental Cards** - Display rental-specific information
- **Pagination** - Efficient browsing of large datasets

## 📈 **Data Sources**

### **Real APIs (When Available)**
1. **RentSpree** - Professional rental platform
2. **RentBerry** - Comprehensive rental marketplace
3. **Rentals.com** - Direct rental listings
4. **Zillow** - Limited property data access

### **Enhanced Mock Data (Fallback)**
- **Real Market Pricing** - Based on actual city averages
- **Realistic Property Details** - Comprehensive rental information
- **Market Trends** - Rising, stable, or declining markets
- **Geographic Distribution** - Properties across major US cities

## 🚀 **Getting Started**

### **1. Install Dependencies**
```bash
cd Server
npm install
```

### **2. Configure Environment**
```bash
cp env.example .env
# Edit .env and add your API keys (optional)
```

### **3. Start the Server**
```bash
npm run dev
```

### **4. Test the API**
```bash
# Get rental listings
curl http://localhost:3000/api/rentals

# Get market statistics
curl http://localhost:3000/api/rentals/stats

# Search rentals
curl -X POST http://localhost:3000/api/rentals/search \
  -H "Content-Type: application/json" \
  -d '{"type": ["Apartment"], "maxPrice": 2000, "city": "New York"}'
```

## 🔍 **Usage Examples**

### **Basic Rental Search**
```javascript
// Search for apartments under $2000 in New York
const response = await api.get('/rentals', {
  params: {
    type: 'Apartment',
    maxPrice: 2000,
    city: 'New York'
  }
});
```

### **Advanced Search**
```javascript
// Advanced search with multiple criteria
const response = await api.post('/rentals/search', {
  type: ['Apartment', 'Condo'],
  minPrice: 1500,
  maxPrice: 3000,
  minBedrooms: 1,
  maxBathrooms: 2,
  amenities: ['Swimming Pool', 'Gym', 'Pet Friendly'],
  city: 'Los Angeles'
});
```

### **Get Market Statistics**
```javascript
// Get rental market statistics
const response = await api.get('/rentals/stats');
console.log(response.data.marketData);
```

## 🎯 **Key Benefits**

### **Real Data Integration**
- **Multiple API Sources** - Redundancy and comprehensive coverage
- **Real Market Data** - Actual rental market statistics
- **Source Transparency** - Users know where data comes from

### **Enhanced User Experience**
- **Rental-Specific Information** - Lease terms, deposits, pet policies
- **Market Overview** - Real-time market statistics
- **Advanced Filtering** - Comprehensive search options
- **Responsive Design** - Works on all devices

### **Developer Friendly**
- **Easy Configuration** - Simple environment variable setup
- **Fallback System** - Works even without API keys
- **Comprehensive Documentation** - Clear API documentation
- **Error Handling** - Graceful degradation when APIs fail

## 🔮 **Future Enhancements**

### **Planned Features**
- **Real-time Updates** - WebSocket integration for live data
- **Map Integration** - Interactive maps for rental locations
- **Virtual Tours** - 360° property tours
- **Saved Searches** - User-specific search preferences
- **Price Alerts** - Notifications for price changes
- **Property Comparisons** - Side-by-side rental comparisons

### **Additional APIs**
- **Apartments.com API** - More rental listings
- **Rent.com API** - Additional rental data
- **HotPads API** - Padmapper rental data
- **Rentberry API** - Enhanced rental marketplace

## 🛠 **Troubleshooting**

### **Common Issues**

1. **No API Data**
   - Check API keys in `.env` file
   - Verify API endpoints are accessible
   - System will fallback to enhanced mock data

2. **Rate Limiting**
   - APIs may have rate limits
   - System handles rate limit errors gracefully
   - Consider implementing caching

3. **Data Format Issues**
   - Different APIs may return different formats
   - System normalizes data for consistent display
   - Check API documentation for expected formats

### **Performance Optimization**
- **Caching** - Implement Redis for API response caching
- **Pagination** - Use efficient pagination for large datasets
- **Lazy Loading** - Load images and data on demand
- **CDN** - Use CDN for static assets

## 📞 **Support**

For issues or questions about the rental API integration:

1. Check this documentation first
2. Review the API endpoints and examples
3. Verify environment configuration
4. Test with the provided examples
5. Check server logs for error details

The rental API integration provides a robust foundation for rental property applications with real data integration capabilities and comprehensive fallback systems.
