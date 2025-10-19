// Mock data for the real estate application
export const mockProperties = [
  {
    _id: '1',
    title: 'Modern Family Home',
    price: 450000,
    sqft: 2500,
    bedrooms: 4,
    bathrooms: 3,
    type: 'House',
    status: 'For Sale',
    location: {
      city: 'New York',
      state: 'NY',
      address: '123 Main St'
    },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
    ],
    description: 'Beautiful modern home with open floor plan and updated kitchen.',
    features: ['Garage', 'Garden', 'Pool'],
    yearBuilt: 2020,
    views: 150,
    favorites: 25
  },
  {
    _id: '2',
    title: 'Luxury Apartment',
    price: 320000,
    sqft: 1800,
    bedrooms: 3,
    bathrooms: 2,
    type: 'Apartment',
    status: 'For Sale',
    location: {
      city: 'Los Angeles',
      state: 'CA',
      address: '456 Oak Ave'
    },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    description: 'Spacious apartment with city views and modern amenities.',
    features: ['Balcony', 'Gym', 'Concierge'],
    yearBuilt: 2018,
    views: 200,
    favorites: 40
  },
  {
    _id: '3',
    title: 'Cozy Townhouse',
    price: 280000,
    sqft: 1600,
    bedrooms: 3,
    bathrooms: 2,
    type: 'Townhouse',
    status: 'For Sale',
    location: {
      city: 'Chicago',
      state: 'IL',
      address: '789 Pine St'
    },
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ],
    description: 'Charming townhouse in a quiet neighborhood.',
    features: ['Patio', 'Storage', 'Parking'],
    yearBuilt: 2015,
    views: 120,
    favorites: 18
  },
  {
    _id: '4',
    title: 'Executive Condo',
    price: 550000,
    sqft: 2200,
    bedrooms: 4,
    bathrooms: 3,
    type: 'Condo',
    status: 'For Sale',
    location: {
      city: 'Miami',
      state: 'FL',
      address: '321 Beach Blvd'
    },
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ],
    description: 'Luxury condo with ocean views and resort-style amenities.',
    features: ['Ocean View', 'Pool', 'Spa'],
    yearBuilt: 2021,
    views: 300,
    favorites: 65
  },
  {
    _id: '5',
    title: 'Suburban Villa',
    price: 380000,
    sqft: 2100,
    bedrooms: 4,
    bathrooms: 2,
    type: 'House',
    status: 'For Sale',
    location: {
      city: 'Austin',
      state: 'TX',
      address: '654 Maple Dr'
    },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
    ],
    description: 'Spacious family home with large backyard and modern kitchen.',
    features: ['Large Yard', 'Garage', 'Fireplace'],
    yearBuilt: 2019,
    views: 180,
    favorites: 32
  },
  {
    _id: '6',
    title: 'Urban Loft',
    price: 420000,
    sqft: 1400,
    bedrooms: 2,
    bathrooms: 2,
    type: 'Loft',
    status: 'For Sale',
    location: {
      city: 'Seattle',
      state: 'WA',
      address: '987 Industrial Ave'
    },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    description: 'Industrial-style loft with exposed brick and high ceilings.',
    features: ['High Ceilings', 'Exposed Brick', 'City View'],
    yearBuilt: 2017,
    views: 220,
    favorites: 45
  }
]

export const mockStats = {
  totalProperties: 1250,
  totalAgents: 85,
  totalClients: 420
}

export const mockRentals = [
  {
    _id: 'r1',
    title: 'Downtown Studio',
    price: 1800,
    sqft: 600,
    bedrooms: 1,
    bathrooms: 1,
    type: 'Studio',
    status: 'For Rent',
    location: {
      city: 'New York',
      state: 'NY',
      address: '100 Broadway'
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    description: 'Modern studio in the heart of downtown.',
    features: ['Furnished', 'Gym Access', 'Rooftop'],
    yearBuilt: 2020,
    views: 80,
    favorites: 12
  },
  {
    _id: 'r2',
    title: 'Family Apartment',
    price: 2200,
    sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    type: 'Apartment',
    status: 'For Rent',
    location: {
      city: 'Los Angeles',
      state: 'CA',
      address: '200 Sunset Blvd'
    },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
    ],
    description: 'Spacious apartment perfect for families.',
    features: ['Pet Friendly', 'Parking', 'Laundry'],
    yearBuilt: 2018,
    views: 95,
    favorites: 18
  }
]
