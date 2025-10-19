# Client Authentication System

This guide explains how to use the authentication system in the React client application.

## Features

- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **Automatic Token Refresh**: Seamless token renewal without user intervention
- **Protected Routes**: Route protection based on authentication status and user roles
- **User Registration & Login**: Complete user onboarding flow
- **Dashboard with CRUD**: User dashboard with profile management and property operations
- **Logout Options**: Single device or all devices logout
- **Role-based Access**: Support for buyer, seller, agent, and admin roles

## Setup

1. **Environment Configuration**:
   ```bash
   cp env.example .env
   # Edit .env and set your API URL
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Authentication Flow

### 1. User Registration
- Navigate to `/register`
- Fill out the registration form with:
  - First Name (required)
  - Last Name (required)
  - Email (required, must be valid)
  - Phone (optional)
  - Role (buyer, seller, agent)
  - Password (minimum 6 characters)
  - Confirm Password
- Upon successful registration, user is automatically logged in and redirected to dashboard

### 2. User Login
- Navigate to `/login`
- Enter email and password
- Upon successful login, user is redirected to dashboard
- Tokens are automatically stored and managed

### 3. Protected Routes
- Dashboard (`/dashboard`) - Requires authentication
- Admin routes (`/admin/*`) - Requires admin role
- Auth routes (`/login`, `/register`) - Redirect authenticated users to dashboard

### 4. Token Management
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Automatic token refresh on API calls
- Manual logout invalidates tokens

## Components

### AuthContext
Central authentication state management:
```typescript
const { 
  user,           // Current user object
  login,          // Login function
  register,       // Registration function
  logout,         // Logout from current device
  logoutAll,      // Logout from all devices
  refreshToken,   // Manual token refresh
  loading,        // Loading state
  isAuthenticated // Authentication status
} = useAuth()
```

### ProtectedRoute
Route protection component:
```typescript
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

### API Service
Automatic token management:
- Adds Bearer token to requests
- Handles token refresh on 401 errors
- Redirects to login on authentication failure

## User Interface

### Login Page (`/login`)
- Email and password fields
- Password visibility toggle
- Error handling for invalid credentials
- Link to registration page

### Registration Page (`/register`)
- Complete user information form
- Role selection (buyer, seller, agent)
- Password confirmation
- Client-side validation
- Link to login page

### Dashboard (`/dashboard`)
- User profile display
- Profile editing modal
- Property management (for sellers/agents)
- Logout options modal
- Role-based content display

## API Integration

The client integrates with the following backend endpoints:

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/refresh-token` - Token refresh
- `POST /api/users/logout` - Logout (single device)
- `POST /api/users/logout-all` - Logout (all devices)

### User Management
- `GET /api/users/me` - Get current user
- `PUT /api/users/:id` - Update user profile

### Property Management (for sellers/agents)
- `GET /api/properties` - Get user's properties
- `DELETE /api/properties/:id` - Delete property

## Error Handling

### Authentication Errors
- **Invalid Credentials**: Clear error message
- **Account Locked**: Informative message about lockout
- **Account Deactivated**: Contact support message
- **Token Expired**: Automatic refresh attempt

### Network Errors
- **Connection Issues**: Retry mechanism
- **Server Errors**: User-friendly error messages
- **Validation Errors**: Field-specific error display

## Security Features

### Token Security
- Tokens stored in localStorage
- Automatic token refresh
- Secure token transmission
- Token invalidation on logout

### Route Protection
- Authentication required for protected routes
- Role-based access control
- Automatic redirects for unauthorized access

### Input Validation
- Client-side form validation
- Server-side validation feedback
- XSS protection through React

## Usage Examples

### Basic Authentication Check
```typescript
import { useAuth } from '../contexts/AuthContext'

const MyComponent = () => {
  const { user, isAuthenticated, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>
  
  return <div>Welcome, {user?.firstName}!</div>
}
```

### Making Authenticated API Calls
```typescript
import api from '../lib/api'

const fetchUserData = async () => {
  try {
    const response = await api.get('/users/me')
    return response.data
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
}
```

### Role-based Rendering
```typescript
const Dashboard = () => {
  const { user } = useAuth()
  
  return (
    <div>
      {user?.role === 'seller' && <SellerPanel />}
      {user?.role === 'agent' && <AgentPanel />}
      {user?.role === 'admin' && <AdminPanel />}
    </div>
  )
}
```

## Testing

### Manual Testing
1. **Registration Flow**:
   - Register a new user
   - Verify automatic login
   - Check dashboard access

2. **Login Flow**:
   - Login with valid credentials
   - Test invalid credentials
   - Verify token storage

3. **Protected Routes**:
   - Access dashboard without login (should redirect)
   - Access admin routes without admin role (should show access denied)

4. **Token Management**:
   - Wait for token expiration
   - Verify automatic refresh
   - Test manual logout

### Automated Testing
```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Token Not Refreshing**:
   - Check network connectivity
   - Verify refresh token is valid
   - Check browser console for errors

2. **Login Redirect Issues**:
   - Clear localStorage
   - Check route configuration
   - Verify authentication state

3. **API Call Failures**:
   - Check API URL configuration
   - Verify server is running
   - Check CORS settings

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'auth:*')
```

## Best Practices

1. **Token Management**:
   - Never store tokens in plain text
   - Use secure storage mechanisms
   - Implement proper token refresh

2. **Error Handling**:
   - Provide user-friendly error messages
   - Log errors for debugging
   - Handle network failures gracefully

3. **Security**:
   - Validate all user inputs
   - Use HTTPS in production
   - Implement proper CORS policies

4. **User Experience**:
   - Show loading states
   - Provide clear feedback
   - Handle edge cases gracefully

## Production Deployment

### Environment Variables
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=RealEstate
VITE_APP_VERSION=1.0.0
```

### Build Process
```bash
npm run build
```

### Security Checklist
- [ ] HTTPS enabled
- [ ] Secure token storage
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] Error handling implemented
- [ ] Rate limiting configured
