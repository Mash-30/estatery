import cors from 'cors';

// CORS configuration for different environments
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) return callback(null, true);
    
    // Get allowed origins from environment variables or use defaults
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:5173', // Vite default port
          'http://localhost:8080', // Vue CLI default port
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          'http://127.0.0.1:5173',
          'http://127.0.0.1:8080',
          'https://estatery-k5nv.vercel.app', // Your Vercel client domain
          'https://estatery-l8jg.vercel.app', // Your new Vercel client domain
          'https://estatery.vercel.app' // Alternative Vercel domain
        ];
    
    // In development, allow all localhost origins
    if (process.env.NODE_ENV === 'development') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    // In production, allow all Vercel domains
    if (process.env.NODE_ENV === 'production') {
      if (origin.includes('vercel.app') || origin.includes('vercel.com')) {
        return callback(null, true);
      }
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-API-Key'
  ],
  exposedHeaders: [
    'X-Total-Count', 
    'X-Page-Count',
    'X-Rate-Limit-Remaining',
    'X-Rate-Limit-Reset'
  ],
  maxAge: process.env.CORS_MAX_AGE || 86400, // Cache preflight response (default: 24 hours)
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Create CORS middleware
const corsMiddleware = cors(corsOptions);

// CORS error handler
const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed by CORS policy',
      origin: req.get('Origin')
    });
  } else {
    next(err);
  }
};

export {
  corsMiddleware,
  corsErrorHandler,
  corsOptions
};
