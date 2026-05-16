# Campus App Login Module

A comprehensive authentication and login module for the Campus App platform built with Java Spring Boot, MySQL, and Vanilla JavaScript. Supports multiple user roles (Admin, Student, Faculty, Management) with JWT-based authentication and OAuth2 integration.

## Features

✅ **Authentication Methods**
- Username/Email + Password login
- User registration with email validation
- JWT token-based authentication
- Refresh token mechanism
- OAuth2 support (Google, GitHub - configurable)
- Session management

✅ **User Roles**
- Admin - Full system access
- Student - Student-specific features
- Faculty - Faculty management tools
- Management - Management dashboard

✅ **Security Features**
- BCrypt password encryption
- JWT token signing with HS512 algorithm
- CORS configuration
- Input validation
- SQL injection prevention (JPA)
- CSRF protection
- Role-based access control (RBAC)

✅ **User Interface**
- Responsive login page
- User registration form
- Password strength indicator
- Password visibility toggle
- Remember me functionality
- Error handling and validation
- Loading states and animations

## Project Structure

```
login-module/
├── pom.xml                                          # Maven dependencies
├── src/
│   └── main/
│       ├── java/com/campusapp/auth/
│       │   ├── CampusAppLoginApplication.java      # Main Spring Boot application
│       │   ├── controller/
│       │   │   └── AuthController.java             # REST API endpoints
│       │   ├── service/
│       │   │   └── AuthService.java                # Business logic
│       │   ├── repository/
│       │   │   └── UserRepository.java             # Database access
│       │   ├── entity/
│       │   │   └── User.java                       # User entity model
│       │   ├── security/
│       │   │   ├── JwtTokenProvider.java           # JWT token handling
│       │   │   └── JwtAuthenticationFilter.java    # JWT filter
│       │   └── config/
│       │       ├── SecurityConfig.java             # Spring Security config
│       │       └── UserDetailsServiceImpl.java      # User details service
│       ├── resources/
│       │   └── application.properties              # Application configuration
│       └── webapp/
│           ├── login.html                          # Login page
│           ├── register.html                       # Registration page
│           ├── css/
│           │   ├── style.css                       # Global styles
│           │   └── auth.css                        # Auth page styles
│           └── js/
│               ├── config.js                       # API client & utilities
│               ├── auth.js                         # Login logic
│               └── register.js                     # Registration logic
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0 or PostgreSQL 12+
- Node.js (optional, for running a local web server)

## Setup Instructions

### 1. Database Setup

Create a new MySQL database:

```sql
CREATE DATABASE campus_app;
USE campus_app;
```

Or use PostgreSQL:

```sql
CREATE DATABASE campus_app;
```

### 2. Configure Application Properties

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/campus_app?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password

# JWT Secret (Generate a strong secret key for production)
jwt.secret=your_super_secret_jwt_key_change_this_in_production_make_it_very_long_and_random_string_1234567890

# OAuth2 (Optional)
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

### 3. Build and Run

**Build the project:**
```bash
mvn clean package
```

**Run the application:**
```bash
mvn spring-boot:run
```

Or:
```bash
java -jar target/login-module-1.0.0.jar
```

The application will start on `http://localhost:8080`

### 4. Serve Frontend Files

Option 1: Using Python (if available)
```bash
cd src/main/webapp
python -m http.server 8000
```

Option 2: Using Node.js (with http-server)
```bash
npx http-server src/main/webapp -p 8000
```

Option 3: Using VS Code Live Server extension

Then navigate to:
- **Login**: `http://localhost:8000/login.html`
- **Register**: `http://localhost:8000/register.html`

## API Endpoints

All endpoints are prefixed with `/api`

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "usernameOrEmail": "student@campus.edu",
  "password": "password123"
}

Response (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "username": "student1",
    "email": "student@campus.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "emailVerified": false
  }
}
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "newstudent",
  "email": "newstudent@campus.edu",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "STUDENT",
  "phoneNumber": "+1234567890"
}

Response (201 Created):
Same as login response
```

#### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}

Response (200 OK):
{
  "accessToken": "new_token...",
  "refreshToken": "new_refresh_token...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {...}
}
```

#### Logout
```http
POST /auth/logout
Response (200 OK):
{
  "message": "Logged out successfully",
  "status": "success"
}
```

#### Health Check
```http
GET /auth/health
Response (200 OK):
{
  "status": "UP",
  "message": "Campus App Login Module is running"
}
```

## Usage Examples

### Frontend Integration

**Login:**
```javascript
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    usernameOrEmail: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('accessToken', data.accessToken);
```

**Protected API Call:**
```javascript
const accessToken = localStorage.getItem('accessToken');
const response = await fetch('http://localhost:8080/api/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## User Roles & Permissions

| Role | Permissions | Features |
|------|-------------|----------|
| Admin | Full access | User management, system settings, analytics |
| Student | Read own profile, announcements | Access to student modules |
| Faculty | Manage grades, classes | Faculty management tools |
| Management | View reports, manage events | Management dashboard |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role ENUM('ADMIN', 'STUDENT', 'FACULTY', 'MANAGEMENT') NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED') DEFAULT 'ACTIVE',
  is_email_verified BOOLEAN DEFAULT FALSE,
  phone_number VARCHAR(15),
  profile_picture_url VARCHAR(255),
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

## Configuration Guide

### JWT Configuration
```properties
jwt.secret=your_secret_key_here                    # Min 32 characters
jwt.expiration=86400000                            # 24 hours in ms
jwt.refresh.expiration=604800000                   # 7 days in ms
```

### CORS Configuration
Update allowed origins in `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(
  Arrays.asList(
    "http://localhost:3000",
    "http://localhost:8000",
    "https://yourdomain.com"
  )
);
```

### Database Configuration
For PostgreSQL:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/campus_app
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL10Dialect
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in application.properties
server.port=8081
```

### Database Connection Issues
- Verify MySQL/PostgreSQL is running
- Check credentials in `application.properties`
- Ensure database exists

### CORS Errors
- Check allowed origins in SecurityConfig
- Verify frontend URL is whitelisted

### JWT Token Expired
- Implement token refresh mechanism
- Client should automatically refresh before expiry

### Password Encoding Issues
- Ensure BCryptPasswordEncoder is configured
- Don't store plain text passwords

## Production Deployment

### Security Checklist
- [ ] Generate strong JWT secret (minimum 32 characters)
- [ ] Enable HTTPS
- [ ] Configure production database
- [ ] Set proper CORS origins
- [ ] Enable database encryption
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Use environment variables for secrets
- [ ] Enable WAF (Web Application Firewall)

### Environment Variables
```bash
export DB_URL=jdbc:mysql://prod-db:3306/campus_app
export DB_USERNAME=db_user
export DB_PASSWORD=strong_password
export JWT_SECRET=very_long_secret_key_here
export APP_ENV=production
```

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/login-module-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## Testing

Run unit tests:
```bash
mvn test
```

Integration tests:
```bash
mvn verify
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@campusapp.com
- Documentation: [Wiki]

## Changelog

### Version 1.0.0
- Initial release
- Basic login/registration
- JWT authentication
- OAuth2 integration framework
- Responsive UI
- Role-based access control

---

**Happy Coding! 🚀**
