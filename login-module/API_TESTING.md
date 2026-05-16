# API Testing Guide

This guide provides example requests for testing the Campus App Login Module APIs.

## Setup

- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **Token Format**: `Bearer <accessToken>` (in Authorization header)

## Testing Tools

You can test these endpoints using:
- Postman (https://www.postman.com)
- cURL (command line)
- VS Code REST Client extension
- Insomnia (https://insomnia.rest)

## API Endpoints

### 1. Login Endpoint

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "admin",
  "password": "Admin@123"
}
```

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYyNTkwMDAwMCwiZXhwIjoxNjI1OTAzNjAwfQ.signature",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjI1OTAwMDAwLCJleHAiOjE2MjY1MDUwMDB9.signature",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@campus.edu",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "phoneNumber": null,
    "profilePictureUrl": null,
    "emailVerified": true
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid password",
  "status": "error"
}
```

### 2. Register Endpoint

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Alice",
  "lastName": "Johnson",
  "username": "alice_j",
  "email": "alice@campus.edu",
  "password": "SecurePass123!",
  "role": "STUDENT",
  "phoneNumber": "+1234567890"
}
```

**Success Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 5,
    "username": "alice_j",
    "email": "alice@campus.edu",
    "firstName": "Alice",
    "lastName": "Johnson",
    "role": "STUDENT",
    "phoneNumber": "+1234567890",
    "profilePictureUrl": null,
    "emailVerified": false
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Username already exists",
  "status": "error"
}
```

### 3. Refresh Token Endpoint

**Request:**
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInR5cGUiOiJyZWZyZXNoIn0.signature"
}
```

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9.new_token.signature",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9.new_refresh.signature",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {...}
}
```

### 4. Logout Endpoint

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Success Response (200 OK):**
```json
{
  "message": "Logged out successfully",
  "status": "success"
}
```

### 5. Health Check Endpoint

**Request:**
```http
GET /api/auth/health
```

**Success Response (200 OK):**
```json
{
  "status": "UP",
  "message": "Campus App Login Module is running"
}
```

## cURL Examples

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"Admin@123"}'
```

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "username":"johndoe",
    "email":"john@campus.edu",
    "password":"JohnPass123!",
    "role":"STUDENT"
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:8080/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your_refresh_token_here"}'
```

### Protected Request with Token
```bash
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer your_access_token_here"
```

## Postman Collection

### Import Steps:
1. Open Postman
2. Create new collection
3. Add these requests:

**Login Request**
- Method: POST
- URL: http://localhost:8080/api/auth/login
- Body: 
  ```json
  {
    "usernameOrEmail": "admin",
    "password": "Admin@123"
  }
  ```

**Register Request**
- Method: POST
- URL: http://localhost:8080/api/auth/register
- Body:
  ```json
  {
    "firstName": "Test",
    "lastName": "User",
    "username": "testuser",
    "email": "test@campus.edu",
    "password": "TestPass123!",
    "role": "STUDENT"
  }
  ```

**Refresh Token Request**
- Method: POST
- URL: http://localhost:8080/api/auth/refresh-token
- Body:
  ```json
  {
    "refreshToken": "{{refreshToken}}"
  }
  ```
- Headers: Content-Type: application/json

## Using Postman Variables

Set collection variables for reuse:
1. Go to Collection Settings
2. Add Variables:
   - `base_url` = http://localhost:8080/api
   - `access_token` = (value from login response)
   - `refresh_token` = (value from login response)

Then use in requests:
- URL: `{{base_url}}/auth/login`
- Header: `Authorization: Bearer {{access_token}}`

## Testing Workflow

1. **Health Check**
   ```
   GET /auth/health
   Expected: 200 OK
   ```

2. **Register New User**
   ```
   POST /auth/register with unique email
   Expected: 201 Created
   ```

3. **Login with Registered User**
   ```
   POST /auth/login with credentials
   Expected: 200 OK with tokens
   ```

4. **Use Access Token**
   ```
   GET /protected-resource with Bearer token
   Expected: 200 OK
   ```

5. **Refresh Token**
   ```
   POST /auth/refresh-token with refresh token
   Expected: 200 OK with new tokens
   ```

## Error Codes

| Code | Error | Cause |
|------|-------|-------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input/validation failed |
| 401 | Unauthorized | Missing/invalid token or wrong credentials |
| 403 | Forbidden | Insufficient permissions |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal server error |

## Test Scenarios

### Valid Login
```
Username: admin
Password: Admin@123
Expected: Success with tokens
```

### Invalid Password
```
Username: admin
Password: WrongPassword
Expected: 401 Unauthorized
```

### Non-existent User
```
Username: nonexistent
Password: AnyPassword
Expected: 401 Unauthorized
```

### Duplicate Email Registration
```
Email: admin@campus.edu (existing)
Expected: 400 Bad Request - "Email already exists"
```

### Weak Password
```
Password: 123
Expected: 400 Bad Request - "Password must be at least 8 characters"
```

### Invalid Email
```
Email: not_an_email
Expected: 400 Bad Request - "Email should be valid"
```

## Rate Limiting (Future Enhancement)

Currently not implemented. Consider adding:
- Login attempts limit (5 per 15 minutes)
- Token refresh limit (10 per hour)
- Registration limit (3 per day per IP)

## Debugging Tips

1. **Check Token Validity**
   - Verify token format (Bearer prefix)
   - Check token expiration time
   - Ensure JWT secret matches

2. **Enable Debug Logging**
   ```properties
   logging.level.com.campusapp=DEBUG
   ```

3. **Monitor Database**
   ```sql
   SELECT * FROM users WHERE username='admin';
   SELECT * FROM login_audit ORDER BY login_timestamp DESC;
   ```

4. **Check Server Logs**
   ```
   tail -f application.log
   ```

---

For more details, see `README.md`
