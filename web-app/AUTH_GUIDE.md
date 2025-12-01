# Authentication Guide

## Overview
IntelliLearn uses **Keycloak** for authentication and authorization. All API requests require a valid JWT token obtained through Keycloak.

## Architecture

```
[Frontend] → [Keycloak] → Get Token
     ↓
[API Request with Bearer Token] → [Nginx with OIDC Validation] → [Backend Services]
```

## Test Accounts

### Tutor Account
- **Username:** `tutor`
- **Password:** `tutor123`
- **Role:** `TUTOR`, `ADMIN`
- **User ID:** `6aa5ed35-91b9-4cd6-80d3-9f4dff25846d`

### Student Account
- **Username:** `student`
- **Password:** `student123`
- **Role:** `STUDENT`
- **User ID:** `49616e7e-ad5d-4312-83ad-294facc849b2`

## Configuration

### Environment Variables (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/teaching

# Keycloak Configuration
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8083
NEXT_PUBLIC_KEYCLOAK_REALM=intellilearn
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=nginx
NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET=w5upehqrRr3xTL57IRAX0Vn5U6zGitbr
```

## Authentication Flow

### 1. Login
```typescript
import authService from '@/lib/services/authService';

const userInfo = await authService.login(username, password);
// Returns: { sub, email, name, roles, ... }
```

### 2. Access Protected Resources
The API client automatically injects the Bearer token:
```typescript
import courseService from '@/lib/services/courseService';

// Token is automatically added to headers
const courses = await courseService.getCoursesByTutor(tutorId);
```

### 3. Token Refresh
Tokens are automatically refreshed before expiry:
```typescript
const token = await authService.getValidToken();
// Automatically refreshes if expired
```

### 4. Logout
```typescript
await authService.logout();
// Clears tokens and redirects to signin
```

## Auth Service API

### Methods

#### `login(username: string, password: string): Promise<UserInfo>`
Authenticates user with Keycloak and stores tokens.

#### `logout(): Promise<void>`
Invalidates session and clears stored tokens.

#### `getValidToken(): Promise<string | null>`
Returns a valid access token, refreshing if needed.

#### `isAuthenticated(): boolean`
Checks if user is currently authenticated.

#### `getUserId(): string | null`
Returns the current user's ID from token.

#### `getUserRoles(): string[]`
Returns array of user roles.

#### `hasRole(role: string): boolean`
Checks if user has a specific role.

#### `isTutor(): boolean`
Convenience method to check TUTOR or ADMIN role.

#### `isStudent(): boolean`
Convenience method to check STUDENT role.

## Token Format

### Decoded JWT Token
```typescript
{
  sub: "6aa5ed35-91b9-4cd6-80d3-9f4dff25846d",  // User ID
  email: "tutor@example.com",
  name: "Test Tutor",
  preferred_username: "tutor",
  realm_access: {
    roles: ["TUTOR", "ADMIN", "offline_access", "uma_authorization"]
  },
  exp: 1732853760,  // Expiry timestamp
  iat: 1732796560,  // Issued at timestamp
  // ... other claims
}
```

## API Client Integration

### Automatic Token Injection
```typescript
// lib/api.ts
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Get valid token (auto-refresh if expired)
  const token = await authService.getValidToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // ... fetch logic
}
```

### 401 Handling
When API returns 401 Unauthorized:
1. Auth service logs out user
2. Clears all tokens
3. Redirects to `/signin`

## Protected Routes

To protect a page, check authentication status:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/lib/services/authService';

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/signin');
    }
  }, [router]);

  // ... page content
}
```

## Role-Based Access Control

### Check Roles in Components
```typescript
if (authService.isTutor()) {
  // Show tutor-only features
}

if (authService.hasRole('ADMIN')) {
  // Show admin-only features
}
```

### Backend Authorization
Backend services use `@PreAuthorize` annotations:
```java
@PreAuthorize("hasAnyRole('TUTOR', 'ADMIN')")
public ResponseEntity<Course> createCourse(@RequestBody CourseRequest request) {
  // Only tutors and admins can create courses
}
```

## Token Lifecycle

1. **Login:** User enters credentials → Keycloak issues tokens
2. **Storage:** Tokens stored in localStorage
3. **Usage:** Auto-injected into API requests
4. **Refresh:** Auto-refreshed 60 seconds before expiry
5. **Logout:** Tokens invalidated and removed

## Security Considerations

### Token Storage
- Access token: localStorage (short-lived, ~36 hours)
- Refresh token: localStorage (long-lived, ~30 days)

### CORS Configuration
Keycloak client configured with:
- **Redirect URIs:** `http://127.0.0.1:3000/*`
- **Web Origins:** `*` (development only)

### Client Secret
⚠️ **Development Only:** Client secret is hardcoded in frontend for development. In production, use:
- Public client (no secret)
- Backend-for-frontend pattern
- Secure token exchange

## Troubleshooting

### "Failed to fetch" Error
**Problem:** API calls fail with network error  
**Solution:** 
1. Check if all Docker containers are running: `docker ps`
2. Verify Keycloak is accessible: `http://localhost:8083`
3. Check nginx logs: `docker logs sarch-intellilearn-251-nginx-1`

### "Unauthorized" Error
**Problem:** API returns 401  
**Solution:**
1. Login again to get fresh token
2. Check token in localStorage (DevTools → Application → Local Storage)
3. Verify user has correct roles in Keycloak admin console

### Token Expired
**Problem:** Token refresh fails  
**Solution:**
1. Clear localStorage
2. Login again
3. Check Keycloak server is running

### CORS Errors
**Problem:** Browser blocks requests  
**Solution:**
1. Check Keycloak client "Web Origins" setting
2. Verify API_URL matches nginx location
3. Ensure frontend and backend on same origin

## Keycloak Admin Console

Access Keycloak admin:
- **URL:** http://localhost:8083/admin/intellilearn/console
- **Username:** `admin`
- **Password:** (check realm config)

### View Users
1. Navigate to Users
2. Click on username
3. View/edit roles, credentials, sessions

### View Tokens
Use "Token Exchange" tab to test token generation

## Testing

### Manual Token Test
```bash
# Get token
curl -X POST http://localhost:8083/realms/intellilearn/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=nginx" \
  -d "client_secret=w5upehqrRr3xTL57IRAX0Vn5U6zGitbr" \
  -d "username=tutor" \
  -d "password=tutor123"

# Use token in API request
curl http://localhost:8080/teaching/courses/tutor/6aa5ed35-91b9-4cd6-80d3-9f4dff25846d \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Next Steps

1. ✅ Login with Keycloak credentials
2. ✅ Access protected API endpoints
3. ✅ Auto-refresh tokens
4. 🔄 Implement middleware for route protection
5. 🔄 Add loading states during token refresh
6. 🔄 Implement "Remember Me" functionality
7. 🔄 Add session timeout warnings

---

**Last Updated:** November 29, 2025  
**Version:** 1.0.0
