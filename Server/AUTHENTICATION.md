# JWT Authentication System

This document describes the complete JWT authentication system implemented in the Real Estate Express.js application.

## Features

- **JWT Access Tokens**: Short-lived tokens (15 minutes) for API access
- **JWT Refresh Tokens**: Long-lived tokens (7 days) for token renewal
- **Account Lockout**: Protection against brute force attacks
- **Role-based Authorization**: Support for different user roles (buyer, seller, agent, admin)
- **Secure Password Hashing**: Using bcryptjs with salt rounds
- **Token Blacklisting**: Ability to revoke refresh tokens
- **Multi-device Support**: Users can be logged in on multiple devices

## Environment Variables

Make sure to set these environment variables in your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_random
JWT_REFRESH_SECRET=your_super_secure_jwt_refresh_secret_key_here_different_from_above
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Security Configuration
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=2h
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. User Registration
```http
POST /api/users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "buyer" // optional: buyer, seller, agent, admin
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "buyer",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. User Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "buyer",
    "isActive": true,
    "lastLogin": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Refresh Access Token
```http
POST /api/users/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 4. Forgot Password
```http
POST /api/users/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Protected Endpoints (Authentication Required)

All protected endpoints require the `Authorization` header:
```http
Authorization: Bearer <access_token>
```

#### 1. Get Current User Profile
```http
GET /api/users/me
Authorization: Bearer <access_token>
```

#### 2. Change Password
```http
PUT /api/users/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

#### 3. Logout (Current Device)
```http
POST /api/users/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Logout from All Devices
```http
POST /api/users/logout-all
Authorization: Bearer <access_token>
```

### Admin Only Endpoints

These endpoints require admin role in addition to authentication.

#### 1. Get All Users
```http
GET /api/users?page=1&limit=10&role=buyer
Authorization: Bearer <admin_access_token>
```

#### 2. Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <admin_access_token>
```

#### 3. Update User
```http
PUT /api/users/:id
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "role": "seller"
}
```

#### 4. Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <admin_access_token>
```

## Security Features

### 1. Account Lockout
- After 5 failed login attempts, the account is locked for 2 hours
- Lockout is automatically lifted after the time expires
- Successful login resets the attempt counter

### 2. Token Management
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Users can have up to 5 active refresh tokens
- Old refresh tokens are automatically removed when new ones are added

### 3. Password Security
- Passwords are hashed using bcryptjs with salt rounds
- Minimum password length is 6 characters
- Password changes invalidate all existing refresh tokens

### 4. Role-based Access Control
- **buyer**: Can view properties and manage their profile
- **seller**: Can create and manage properties
- **agent**: Can manage properties for clients
- **admin**: Full system access

## Error Codes

The API returns specific error codes for different scenarios:

- `NO_TOKEN`: No authorization token provided
- `INVALID_TOKEN`: Token is malformed or invalid
- `TOKEN_EXPIRED`: Access token has expired
- `INVALID_TOKEN_TYPE`: Wrong token type (e.g., using refresh token as access token)
- `USER_NOT_FOUND`: User associated with token doesn't exist
- `ACCOUNT_DEACTIVATED`: User account is deactivated
- `ACCOUNT_LOCKED`: Account is temporarily locked
- `INVALID_CREDENTIALS`: Wrong email or password
- `USER_EXISTS`: Email already registered
- `INVALID_CURRENT_PASSWORD`: Wrong current password for password change
- `INSUFFICIENT_PERMISSIONS`: User doesn't have required role

## Usage Examples

### Frontend Integration

#### 1. Login and Store Tokens
```javascript
const login = async (email, password) => {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Store tokens securely
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    return data.user;
  } else {
    throw new Error(data.message);
  }
};
```

#### 2. Make Authenticated Requests
```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  // Handle token expiration
  if (response.status === 401) {
    const errorData = await response.json();
    if (errorData.code === 'TOKEN_EXPIRED') {
      // Try to refresh token
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request
        return makeAuthenticatedRequest(url, options);
      } else {
        // Redirect to login
        window.location.href = '/login';
        return;
      }
    }
  }
  
  return response;
};
```

#### 3. Refresh Token Logic
```javascript
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await fetch('/api/users/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      return true;
    } else {
      // Refresh token is invalid, clear storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return false;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};
```

## Middleware Usage

### Protect Routes
```javascript
import { auth, adminAuth, authorize } from '../middleware/auth.js';

// Require authentication
router.get('/protected', auth, (req, res) => {
  res.json({ user: req.user });
});

// Require admin role
router.get('/admin-only', auth, adminAuth, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Require specific roles
router.get('/agent-or-admin', auth, authorize('agent', 'admin'), (req, res) => {
  res.json({ message: 'Access granted' });
});
```

### Optional Authentication
```javascript
import { optionalAuth } from '../middleware/auth.js';

// Optional authentication - req.user will be set if token is valid
router.get('/public-with-user-info', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({ message: 'Hello authenticated user', user: req.user });
  } else {
    res.json({ message: 'Hello anonymous user' });
  }
});
```

## Best Practices

1. **Store tokens securely**: Use httpOnly cookies or secure storage mechanisms
2. **Implement token refresh**: Always handle token expiration gracefully
3. **Use HTTPS**: Always use HTTPS in production
4. **Validate input**: Always validate and sanitize user input
5. **Rate limiting**: Implement rate limiting for authentication endpoints
6. **Log security events**: Log failed login attempts and suspicious activities
7. **Regular token rotation**: Consider implementing token rotation for enhanced security

## Testing

You can test the authentication system using tools like Postman or curl:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Access protected route
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
