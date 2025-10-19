import express from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  changePassword,
  forgotPassword
} from '../controllers/userController.js';
import { auth, adminAuth, authorize, verifyRefreshToken } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const userValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['buyer', 'seller', 'agent', 'admin'])
    .withMessage('Invalid role')
];

const updateUserValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['buyer', 'seller', 'agent', 'admin'])
    .withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required')
];

// Public routes (no authentication required)
router.post('/register', userValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/refresh-token', verifyRefreshToken, refreshToken);

// Protected routes (authentication required)
router.get('/me', auth, getCurrentUser);
router.put('/change-password', auth, changePasswordValidation, changePassword);
router.post('/logout', auth, logout);
router.post('/logout-all', auth, logoutAll);

// Admin only routes
router.get('/', auth, adminAuth, getAllUsers);
router.get('/:id', auth, adminAuth, getUserById);
router.put('/:id', auth, adminAuth, updateUserValidation, updateUser);
router.delete('/:id', auth, adminAuth, deleteUser);

// Legacy route (for backward compatibility)
router.post('/', userValidation, createUser);

export default router;
