import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Main authentication middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if token is not a refresh token
    if (decoded.type === 'refresh') {
      return res.status(401).json({ 
        message: 'Invalid token type. Access token required.',
        code: 'INVALID_TOKEN_TYPE'
      });
    }
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Token is not valid. User not found.',
        code: 'USER_NOT_FOUND'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Account is deactivated.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    if (user.isLocked) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked due to multiple failed login attempts.',
        code: 'ACCOUNT_LOCKED'
      });
    }
    
    // Add user info to request (without sensitive data)
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired.',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        message: 'Authentication error.',
        code: 'AUTH_ERROR'
      });
    }
  }
};

// Refresh token verification middleware
const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        message: 'Refresh token is required.',
        code: 'NO_REFRESH_TOKEN'
      });
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ 
        message: 'Invalid token type. Refresh token required.',
        code: 'INVALID_TOKEN_TYPE'
      });
    }
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid refresh token. User not found.',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Check if refresh token exists in user's refresh tokens
    const tokenExists = user.refreshTokens.some(rt => rt.token === refreshToken);
    
    if (!tokenExists) {
      return res.status(401).json({ 
        message: 'Invalid refresh token.',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Account is deactivated.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    req.user = user;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Refresh token has expired.',
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid refresh token.',
        code: 'INVALID_REFRESH_TOKEN'
      });
    } else {
      console.error('Refresh token verification error:', error);
      return res.status(500).json({ 
        message: 'Token verification error.',
        code: 'TOKEN_VERIFICATION_ERROR'
      });
    }
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    next();
  };
};

// Admin authorization middleware
const adminAuth = (req, res, next) => {
  return authorize('admin')(req, res, next);
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }
    
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    if (decoded.type === 'refresh') {
      return next(); // Continue without authentication
    }
    
    const user = await User.findById(decoded.id);
    
    if (user && user.isActive && !user.isLocked) {
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive
      };
    }
    
    next();
  } catch (error) {
    // Continue without authentication on any error
    next();
  }
};

export { 
  auth, 
  adminAuth, 
  authorize, 
  verifyRefreshToken, 
  optionalAuth 
};
