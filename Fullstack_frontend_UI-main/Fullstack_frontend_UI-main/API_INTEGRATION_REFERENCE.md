# API Integration Quick Reference

## 🎯 Quick Start

### 1. Login User
```javascript
import { authService } from './services/authService';
import { useAuth } from './store/AuthProvider';

const { login } = useAuth();

try {
  const user = await authService.login('user@example.com', 'password123');
  login(user);
} catch (error) {
  console.error(error.message);
}
```

### 2. Get Current User
```javascript
import { useAuth } from './store/AuthProvider';

const { user, isLoggedIn } = useAuth();

if (isLoggedIn) {
  console.log(user.email, user.role);
}
```

### 3. Make Protected API Call
```javascript
import { userAPI } from './services/api';

// Automatically includes auth token in header
const users = await userAPI.getUsers();
```

### 4. Protect a Route
```javascript
import { ProtectedRoute } from './components/common/ProtectedRoute';

<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

## 📋 Available Methods

### authService
```javascript
authService.login(email, password)              // → { user data + token }
authService.register(userData)                  // → { new user data + token }
authService.logout()                            // → void
authService.getCurrentUser()                    // → user object or null
authService.getAuthToken()                      // → token string or null
authService.isAuthenticated()                   // → boolean
```

### userAPI
```javascript
userAPI.getUsers()                              // → users array
userAPI.getUserById(id)                         // → single user
userAPI.addUser(userData)                       // → new user
userAPI.updateUser(id, updateData)              // → updated user
userAPI.deleteUser(id)                          // → success response
```

### authAPI
```javascript
authAPI.login(email, password)                  // → { user + token }
authAPI.register(userData)                      // → { new user + token }
authAPI.logout()                                // → void
```

## 🔌 Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## 🔐 Roles

- `ADMIN` - Administrator access
- `FARMER` - Farmer access
- `BUYER` - Buyer/Customer access

## 💾 localStorage Keys

- `authToken` - JWT token for API authentication
- `user` - Current user object (JSON stringified)
- `isLoggedIn` - Boolean flag for login status

## 🚨 Error Handling

```javascript
try {
  const user = await authService.login(email, password);
} catch (error) {
  // error.message contains user-friendly error text
  console.error(error.message);
  // Examples:
  // "Email and password are required"
  // "Invalid email format"
  // "Login failed. Please check your credentials and try again."
}
```

## 🎨 Example Component

```javascript
import { useState } from 'react';
import { useAuth } from '../store/AuthProvider';
import { userAPI } from '../services/api';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return <p>Please log in</p>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? 'Loading...' : 'Load Users'}
      </button>
      <button onClick={logout}>Logout</button>
      
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.email} - {u.role}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 🔄 Request/Response Example

### Login Request
```json
POST /api/auth/login
Content-Type: application/json
Accept: application/json

{
  "email": "admin@organic.com",
  "password": "password123"
}
```

### Login Response
```json
200 OK
Content-Type: application/json

{
  "id": 1,
  "email": "admin@organic.com",
  "role": "ADMIN",
  "name": "Admin User",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "createdAt": "2026-04-07T10:30:00Z"
}
```

### Authenticated Request
```
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Token expired or invalid, user will be logged out |
| 404 Not Found | Check endpoint path in api.js |
| CORS Error | Ensure backend CORS is configured |
| "Token not found" | User not logged in or localStorage cleared |
| Form won't submit | Check for validation errors in console |

---

For detailed guide, see `LOGIN_INTEGRATION_GUIDE.md`
