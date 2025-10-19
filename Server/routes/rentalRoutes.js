import express from 'express';
import { body } from 'express-validator';
import {
  getRentalListings,
  getRentalMarketStats,
  getFeaturedRentals,
  getRentalById,
  searchRentals,
  getRentalFilterOptions,
  getRentalSearchSuggestions,
  seedRentals
} from '../controllers/rentalController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const rentalSearchValidation = [
  body('search').optional().isString().withMessage('Search must be a string'),
  body('type').optional().isArray().withMessage('Type must be an array'),
  body('minPrice').optional().isNumeric().withMessage('Min price must be a number'),
  body('maxPrice').optional().isNumeric().withMessage('Max price must be a number'),
  body('minBedrooms').optional().isInt({ min: 0 }).withMessage('Min bedrooms must be a non-negative integer'),
  body('maxBedrooms').optional().isInt({ min: 0 }).withMessage('Max bedrooms must be a non-negative integer'),
  body('minBathrooms').optional().isInt({ min: 0 }).withMessage('Min bathrooms must be a non-negative integer'),
  body('maxBathrooms').optional().isInt({ min: 0 }).withMessage('Max bathrooms must be a non-negative integer'),
  body('minSqft').optional().isInt({ min: 0 }).withMessage('Min sqft must be a non-negative integer'),
  body('maxSqft').optional().isInt({ min: 0 }).withMessage('Max sqft must be a non-negative integer'),
  body('city').optional().isString().withMessage('City must be a string'),
  body('state').optional().isString().withMessage('State must be a string'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array')
];

// Public routes (no authentication required)
router.get('/', getRentalListings); // Get all rental listings with search/filter
router.get('/featured', getFeaturedRentals); // Get featured rental properties
router.get('/stats', getRentalMarketStats); // Get rental market statistics
router.get('/filters', getRentalFilterOptions); // Get available filter options
router.get('/suggestions', getRentalSearchSuggestions); // Get search suggestions
router.get('/:id', getRentalById); // Get single rental property
router.post('/search', rentalSearchValidation, searchRentals); // Advanced search

// Admin only routes
router.post('/seed', auth, adminAuth, seedRentals); // Seed database with rental data

export default router;
