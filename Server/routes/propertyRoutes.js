import express from 'express';
import { body } from 'express-validator';
import {
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
} from '../controllers/propertyController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const propertyValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.zipCode').notEmpty().withMessage('Zip code is required'),
  body('type').isIn(['House', 'Apartment', 'Condo', 'Townhouse', 'Studio', 'Loft', 'Land', 'Commercial'])
    .withMessage('Invalid property type'),
  body('status').optional().isIn(['For Sale', 'For Rent', 'Sold', 'Pending', 'Off Market'])
    .withMessage('Invalid property status')
];

const updatePropertyValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('type').optional().isIn(['House', 'Apartment', 'Condo', 'Townhouse', 'Studio', 'Loft', 'Land', 'Commercial'])
    .withMessage('Invalid property type'),
  body('status').optional().isIn(['For Sale', 'For Rent', 'Sold', 'Pending', 'Off Market'])
    .withMessage('Invalid property status')
];

// Public routes (no authentication required)
router.get('/', getAllProperties); // Get all properties with search/filter
router.get('/featured', getFeaturedProperties); // Get featured properties
router.get('/stats', getPropertyStats); // Get property statistics
router.get('/filters', getFilterOptions); // Get available filter options
router.get('/suggestions', getSearchSuggestions); // Get search suggestions
router.get('/:id', getPropertyById); // Get single property
router.post('/search', searchProperties); // Advanced search

// Protected routes (authentication required)
router.post('/:id/favorite', auth, toggleFavorite); // Toggle property favorite
router.post('/', auth, propertyValidation, createProperty); // Create new property
router.put('/:id', auth, updatePropertyValidation, updateProperty); // Update property
router.delete('/:id', auth, deleteProperty); // Delete property

// Admin only routes
router.post('/seed', auth, adminAuth, seedProperties); // Seed database with mock data

export default router;
