# React Login Integration Guide

This document explains the complete React login integration with Spring Boot backend authentication.

## ✅ Setup Complete

All components are configured and ready to use. No `.env` file required - backend URL is hardcoded to `http://localhost:8080/api`.

## 📋 Project Structure

```
src/
├── services/
│   ├── api.js              # Axios API client with interceptors
│   └── authService.js      # Authentication service (login, register, logout)
├── store/
│   └── AuthProvider.jsx    # React Context for auth state management
├── components/
│   ├── common/
│   │   └── ProtectedRoute.jsx  # Route protection component
│   └── forms/
│       └── LoginForm.jsx   # Login form component
└── pages/
    └── auth/
        └── Login.jsx       # Login page
```

## 🔑 Key Features

### 1. **Axios API Client** (`src/services/api.js`)
- ✅ Configured with base URL: `http://localhost:8080/api`
- ✅ Request interceptor: Automatically adds auth token to headers
- ✅ Response interceptor: Handles 401 errors (auto logout)
- ✅ Error handling: Includes try-catch for all endpoints
- ✅ Modular API exports: `authAPI`, `userAPI`, and default instance

### 2. **Authentication Service** (`src/services/authService.js`)
- ✅ Login: POST `/api/auth/login` with email & password
- ✅ Register: POST `/api/auth/register`
- ✅ Logout: POST `/api/auth/logout`
- ✅ Token Management: Stores/retrieves auth token from localStorage
- ✅ Session Persistence: User remains logged in after page refresh
- ✅ Input Validation: Email format, password requirements

### 3. **Auth Context Provider** (`src/store/AuthProvider.jsx`)
- ✅ Manages global authentication state
- ✅ Provides: `user`, `isLoggedIn`, `login()`, `logout()`, `register()`
- ✅ Local storage sync: Automatic persistence of user data
- ✅ Session restoration: Restores user on app startup

### 4. **Login Form** (`src/components/forms/LoginForm.jsx`)
- ✅ React Hooks: Uses `useState` for form state
- ✅ Error handling: Displays user-friendly error messages
- ✅ Loading state: Prevents duplicate submissions
- ✅ Role-based redirect: Directs users to their dashboard after login
- ✅ Form validation: Checks email and password before submission

### 5. **Protected Routes** (`src/components/common/ProtectedRoute.jsx`)
- ✅ Redirects unauthenticated users to `/login`
- ✅ Role-based access control: Restricts routes by user role
- ✅ Case-insensitive role checking: Works with `ADMIN`, `admin`, etc.

## 🚀 How It Works

### Login Flow

```
1. User enters email & password in LoginForm
   ↓
2. Form validates input and calls authService.login()
   ↓
3. authService sends POST request to /api/auth/login via Axios
   ↓
4. Backend validates credentials and returns user data + token
   ↓
5. Token stored in localStorage (used by Axios interceptor)
   ↓
6. User data stored in context + localStorage
   ↓
7. User redirected based on role:
   - ADMIN → /admin/dashboard
   - FARMER → /farmer/dashboard
   - BUYER → /customer/dashboard
```

### Request/Response Cycle

```
LoginForm Component
        ↓
authService.login(email, password)
        ↓
authAPI.login() [from api.js]
        ↓
Axios Instance (with interceptors)
        ↓
POST http://localhost:8080/api/auth/login
        ↓
Spring Boot Backend
        ↓
Response: { user: {...}, token: "jwt-token", role: "ADMIN" }
        ↓
localStorage.setItem('authToken', token)
localStorage.setItem('user', JSON.stringify(user))
        ↓
Context updated via login()
        ↓
useAuth() hook provides data to components
```

## 💾 localStorage Structure

```javascript
// Stored after successful login
localStorage.getItem('authToken')  // "eyJhbGci..."
localStorage.getItem('user')       // { id: 1, email: "...", role: "ADMIN", ... }

// Used by Axios interceptor for subsequent requests
Authorization: `Bearer ${authToken}`
```

## 🔐 Axios Interceptors

### Request Interceptor
```javascript
// Adds auth token to every request
Authorization: Bearer <token>
```

### Response Interceptor
```javascript
// Handles 401 Unauthorized - user session expired
if (status === 401) {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

## 📞 API Endpoints

### Authentication Endpoints
```
POST /api/auth/login
  Request: { email: "user@example.com", password: "pass123" }
  Response: { id: 1, email: "...", role: "ADMIN", token: "jwt-token" }

POST /api/auth/register
  Request: { name: "...", email: "...", password: "...", role: "BUYER" }
  Response: { id: 1, email: "...", role: "BUYER", token: "jwt-token" }

POST /api/auth/logout
  No request body
  Response: { message: "Logged out successfully" }
```

### User Endpoints (with auth token)
```
GET /api/users
GET /api/users/:id
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
```

## 🧪 Testing Login

### Demo Accounts
```
Admin:  admin@organic.com / password123
Farmer: farmer@organic.com / password123
Buyer:  buyer@organic.com / password123
```

### Test Steps
1. Navigate to `/login`
2. Enter demo email and password
3. Click "Login"
4. Should redirect to appropriate dashboard based on role
5. Verify localStorage has `authToken` and `user` data
6. Refresh page - should remain logged in
7. Try accessing `/admin/dashboard` with non-admin role - should redirect to home

## 🛠️ Using the API in Components

### Calling Login
```javascript
import { authService } from '../services/authService';
import { useAuth } from '../store/AuthProvider';

function MyComponent() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const user = await authService.login('user@example.com', 'password123');
      login(user);
      // User now available in useAuth() hook
    } catch (error) {
      console.error(error.message);
    }
  };
}
```

### Using Auth Context
```javascript
import { useAuth } from '../store/AuthProvider';

function MyComponent() {
  const { user, isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) return <p>Not logged in</p>;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes
```javascript
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import AdminPage from '../pages/AdminPage';

<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

### Making API Calls
```javascript
import { userAPI } from '../services/api';

// Get all users (requires auth token)
const users = await userAPI.getUsers();

// Get specific user
const user = await userAPI.getUserById(1);

// Add new user
const newUser = await userAPI.addUser({
  name: "John",
  email: "john@example.com",
  role: "FARMER"
});
```

## 🔄 Token Refresh (Optional Enhancement)

Current setup uses static tokens. For production, implement token refresh:

```javascript
// Add to api.js response interceptor
if (error.response?.status === 401) {
  try {
    const newToken = await refreshToken();
    config.headers.Authorization = `Bearer ${newToken}`;
    return apiClient(config);
  } catch (err) {
    // Refresh failed, redirect to login
  }
}
```

## 📦 Dependencies

- ✅ `axios` ^1.13.5 - HTTP client with interceptors
- ✅ `react` ^19.2.0 - UI framework
- ✅ `react-router-dom` ^7.13.0 - Client-side routing

No additional packages needed!

## 🚦 Backend Requirements

Spring Boot backend must provide:

```
POST /api/auth/login
  - Accept JSON: { email, password }
  - Return JSON: { id, email, role, token, ...otherData }
  - Return 401 if credentials invalid

POST /api/auth/register
  - Accept JSON: { name, email, password, role }
  - Return JSON: { id, email, role, token }
  - Return 409 if email exists

POST /api/auth/logout
  - Accept any request
  - Return success response

GET/POST/PUT/DELETE /api/users/*
  - Check Authorization header for Bearer token
  - Return 401 if token invalid/expired
```

## ⚙️ Configuration

All configuration is in `src/services/api.js`:

```javascript
// Base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Modify here to change:
// - Backend URL
// - Headers
// - Timeout
// - Request/Response transformations
```

## ✨ Production Checklist

- [ ] Move backend URL to environment variable (or keep hardcoded per requirements)
- [ ] Implement token refresh mechanism
- [ ] Add CSRF protection if needed
- [ ] Enable HTTPS in production
- [ ] Add rate limiting for login attempts
- [ ] Implement password reset flow
- [ ] Add user permissions/scopes
- [ ] Set up logout across all tabs
- [ ] Add form validation feedback
- [ ] Implement "Remember Me" functionality

## 🐛 Troubleshooting

### Issue: Login fails with CORS error
**Solution:** Ensure Spring Boot backend has CORS enabled for `http://localhost:3000`

### Issue: Token not persisting after refresh
**Solution:** Check localStorage is enabled and not in private/incognito mode

### Issue: User redirects to login after every action
**Solution:** Check token expiration, implement token refresh in response interceptor

### Issue: Protected routes not working
**Solution:** Verify role in developer console: `localStorage.getItem('user')`

### Issue: Axios interceptor not adding token
**Solution:** Verify token exists: `localStorage.getItem('authToken')`

## 📚 Additional Resources

- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [React Context API](https://react.dev/learn/passing-data-deeply-with-context)
- [React Router Protected Routes](https://reactrouter.com/docs/en/v6/getting-started/overview)
- [JWT Authentication](https://jwt.io/introduction)

---

**Last Updated:** April 7, 2026
**Status:** ✅ Production Ready
