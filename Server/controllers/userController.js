import User from '../models/User.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { 
  createDemoUser, 
  getDemoUser, 
  getDemoUserByEmail,
  createDemoSession,
  getDemoSession,
  updateSessionAccess,
  removeDemoSession,
  clearUserSessions
} from '../services/demoUserService.js';

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    
    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(filter);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Create new user (registration)
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password, firstName, lastName, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || 'buyer'
    });
    
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is updating their own profile or is admin
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    // Don't allow password updates through this endpoint
    const { password, ...updateData } = req.body;
    
    Object.assign(user, updateData);
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is deleting their own account or is admin
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// User registration
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    
    // Demo mode - create user in memory
    if (!process.env.MONGODB_URI) {
      const { email, firstName, lastName, phone, role } = req.body;
      
      // Check if user already exists
      const existingUser = getDemoUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User already exists with this email',
          code: 'USER_EXISTS'
        });
      }
      
      // Create new demo user
      const user = createDemoUser({ email, firstName, lastName, phone, role });
      
      // Create session
      const session = createDemoSession(user._id);
      
      // Generate demo tokens with real user ID
      const accessToken = `demo-access-${user._id}`;
      const refreshToken = `demo-refresh-${session.sessionId}`;
      
      return res.status(201).json({
        message: 'User registered successfully (demo mode)',
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    }
    
    const { email, password, firstName, lastName, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email',
        code: 'USER_EXISTS'
      });
    }
    
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || 'buyer'
    });
    
    await user.save();
    
    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    // Save refresh token
    await user.addRefreshToken(refreshToken);
    
    // Set last login
    user.lastLogin = new Date();
    await user.save();
    
    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error during registration', 
      error: error.message 
    });
  }
};

// User login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    
    // Demo mode - authenticate user from memory
    if (!process.env.MONGODB_URI) {
      const { email, password } = req.body;
      
      // Find user by email
      const user = getDemoUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }
      
      // In demo mode, accept any password
      // Create new session
      const session = createDemoSession(user._id);
      
      // Generate demo tokens with real user ID
      const accessToken = `demo-access-${user._id}`;
      const refreshToken = `demo-refresh-${session.sessionId}`;
      
      return res.json({
        message: 'Login successful (demo mode)',
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    }
    
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked due to multiple failed login attempts',
        code: 'ACCOUNT_LOCKED'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      return res.status(401).json({ 
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    
    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    // Save refresh token
    await user.addRefreshToken(refreshToken);
    
    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error during login', 
      error: error.message 
    });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user;
    
    // Generate new access token
    const newAccessToken = user.generateAccessToken();
    
    res.json({
      message: 'Token refreshed successfully',
      tokens: {
        accessToken: newAccessToken,
        refreshToken // Return the same refresh token
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      message: 'Error refreshing token', 
      error: error.message 
    });
  }
};

// Logout (remove refresh token)
const logout = async (req, res) => {
  try {
    // Demo mode - remove session
    if (!process.env.MONGODB_URI) {
      const { refreshToken } = req.body;
      const user = req.user;
      
      if (refreshToken && refreshToken.startsWith('demo-refresh-')) {
        const sessionId = refreshToken.replace('demo-refresh-', '');
        removeDemoSession(sessionId);
      }
      
      return res.json({
        message: 'Logout successful (demo mode)'
      });
    }

    const { refreshToken } = req.body;
    const user = req.user;
    
    if (refreshToken) {
      // Remove specific refresh token
      await user.removeRefreshToken(refreshToken);
    } else {
      // Clear all refresh tokens
      await user.clearRefreshTokens();
    }
    
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Error during logout', 
      error: error.message 
    });
  }
};

// Logout from all devices (clear all refresh tokens)
const logoutAll = async (req, res) => {
  try {
    // Demo mode - clear all user sessions
    if (!process.env.MONGODB_URI) {
      const user = req.user;
      const clearedCount = clearUserSessions(user._id);
      
      return res.json({
        message: `Logged out from all devices successfully (demo mode) - ${clearedCount} sessions cleared`
      });
    }

    const user = req.user;
    await user.clearRefreshTokens();
    
    res.json({
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ 
      message: 'Error during logout', 
      error: error.message 
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Clear all refresh tokens to force re-login
    await user.clearRefreshTokens();
    
    res.json({
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Error changing password', 
      error: error.message 
    });
  }
};

// Forgot password (placeholder - would typically send email)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }
    
    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Save it to the user with expiration
    // 3. Send email with reset link
    
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Error processing forgot password request', 
      error: error.message 
    });
  }
};

export {
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
};
