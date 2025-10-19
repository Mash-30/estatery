# Real Estate Server

A RESTful API server built with Express.js and MVC architecture for a real estate application.

## Features

- **MVC Architecture**: Clean separation of concerns with Models, Views (JSON responses), and Controllers
- **User Management**: Registration, authentication, and role-based access control
- **Property Management**: CRUD operations for real estate properties
- **Data Validation**: Input validation using express-validator
- **Security**: Helmet for security headers, CORS support
- **Database**: MongoDB with Mongoose ODM
- **Logging**: Morgan for HTTP request logging

## Project Structure

```
Server/
├── app.js                 # Main application entry point
├── package.json           # Dependencies and scripts
├── config/
│   └── database.js        # Database connection configuration
├── controllers/           # Business logic
│   ├── propertyController.js
│   └── userController.js
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/               # Database models
│   ├── Property.js
│   └── User.js
└── routes/               # API routes
    ├── propertyRoutes.js
    └── userRoutes.js
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the Server directory:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/realestate
JWT_SECRET=your_jwt_secret_key_here
```

3. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties (with filtering)
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Register new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB object modeling
- `cors` - Cross-origin resource sharing
- `helmet` - Security middleware
- `morgan` - HTTP request logger
- `dotenv` - Environment variable loader
- `express-validator` - Input validation
- `bcryptjs` - Password hashing

### Development
- `nodemon` - Development server with auto-restart

## CORS Configuration

The application includes comprehensive CORS (Cross-Origin Resource Sharing) support:

### Features
- **Environment-based configuration**: Different settings for development and production
- **Dynamic origin validation**: Checks against allowed origins list
- **Credentials support**: Allows cookies and authorization headers
- **Preflight caching**: Reduces unnecessary OPTIONS requests
- **Custom error handling**: Detailed CORS error responses

### Default Allowed Origins
- `http://localhost:3000` (React default)
- `http://localhost:3001` (Alternative React port)
- `http://localhost:5173` (Vite default)
- `http://localhost:8080` (Vue CLI default)
- `127.0.0.1` variants of above

### Testing CORS
Use the test endpoint to verify CORS functionality:
```bash
curl -H "Origin: http://localhost:3000" http://localhost:3000/api/test/cors-test
```

### Production Setup
For production, set the `ALLOWED_ORIGINS` environment variable:
```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```
