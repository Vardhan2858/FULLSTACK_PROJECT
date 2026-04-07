# Backend API Connection Guide

## Base Configuration
- **Backend URL**: `http://localhost:8080/api`
- **CORS Enabled**: Backend has CORS configuration for localhost

## Connected Endpoints

### User Management (`/api/users`)
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Register new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `POST /api/users/login` - User login

### Product Management (`/api/products`)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products?category={category}` - Get products by category
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/{id}` - Update product (requires auth)
- `DELETE /api/products/{id}` - Delete product (requires auth)

### Category Management (`/api/categories`)
- `GET /api/categories` - Get all categories

### Orders (`/api/orders`)
- `GET /api/orders` - Get all orders
- `GET /api/orders?userId={userId}` - Get user's orders

## Service Files Updated
1. **api.js** - Fixed BASE_URL and added utility endpoints
2. **authService.js** - Replaced mock auth with backend API calls
3. **productService.js** - Updated to use API with fallback to mock data

## Error Handling
- All services include error handling with fallback to mock data
- Network errors are logged to console with "API failed" messages
- Check browser console for detailed error information

## Authentication
- Login/Register endpoints return user object with optional token
- Token stored in localStorage as 'authToken'
- User object stored in localStorage as 'user'
- Include token in Authorization header for protected endpoints

## Testing Connection
1. Ensure backend is running on `localhost:8080`
2. Check browser DevTools Network tab to verify API calls
3. Check browser DevTools Console for any connection errors
4. Verify CORS is properly configured on backend
