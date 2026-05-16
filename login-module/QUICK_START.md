# Campus App Login Module - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Java 17+
- MySQL 8.0+ or PostgreSQL
- Git (optional)

### Step 1: Clone/Download Project
```bash
cd /path/to/Campus App intern 2024/login-module
```

### Step 2: Configure Database

**For MySQL:**
```bash
# Create database
mysql -u root -p < DATABASE_SETUP.md
```

Or manually run SQL from `DATABASE_SETUP.md`

### Step 3: Update Application Properties
Edit `src/main/resources/application.properties`:

```properties
# Database connection
spring.datasource.url=jdbc:mysql://localhost:3306/campus_app
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# JWT Secret (change this in production!)
jwt.secret=campus_app_super_secret_key_change_in_production
```

### Step 4: Build Project
```bash
mvn clean package
```

### Step 5: Run Application
```bash
mvn spring-boot:run
```

Application starts at: **http://localhost:8080**

### Step 6: Serve Frontend
Open another terminal:
```bash
cd src/main/webapp
python -m http.server 8000
```

Or use VS Code Live Server extension.

### Step 7: Open in Browser
- **Login Page**: http://localhost:8000/login.html
- **Register Page**: http://localhost:8000/register.html

### Test Login Credentials
| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | Admin |
| student1 | Student@123 | Student |
| faculty1 | Faculty@123 | Faculty |
| management1 | Management@123 | Management |

## 📁 Project Structure Summary

```
login-module/
├── pom.xml                 # Dependencies
├── README.md              # Full documentation
├── DATABASE_SETUP.md      # SQL scripts
├── QUICK_START.md         # This file
├── src/main/
│   ├── java/              # Spring Boot code
│   ├── resources/         # Config files
│   └── webapp/            # Frontend HTML/CSS/JS
└── target/               # Built files
```

## 🔑 Key API Endpoints

All endpoints start with `http://localhost:8080/api`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| POST | `/auth/refresh-token` | Refresh access token |
| POST | `/auth/logout` | User logout |
| GET | `/auth/health` | Health check |

## 💡 Common Issues & Fixes

### Port 8080 Already in Use
```properties
server.port=8081
```

### Database Connection Error
- Verify MySQL is running
- Check username/password in properties
- Ensure database `campus_app` exists

### CORS Errors
- Check allowed origins in `SecurityConfig.java`
- Ensure frontend URL is whitelisted

### JWT Token Errors
- Verify `jwt.secret` is set
- Check token format: `Bearer <token>`

## 📚 Next Steps

1. **Customize User Roles** - Modify `User.UserRole` enum
2. **Add Email Verification** - Implement email service
3. **OAuth2 Integration** - Configure Google/GitHub
4. **Password Reset** - Add forgot password functionality
5. **User Dashboard** - Create role-specific dashboards

## 🎯 Architecture Overview

```
Frontend (HTML/CSS/Vanilla JS)
         ↓ (HTTP REST API)
API Gateway / Security Layer (Spring Security + JWT)
         ↓
REST Controller (AuthController)
         ↓
Business Logic (AuthService)
         ↓
Database Access (UserRepository)
         ↓
MySQL/PostgreSQL Database
```

## 🔐 Security Features Included

✅ Password encryption with BCrypt
✅ JWT token authentication
✅ CORS protection
✅ Input validation
✅ SQL injection prevention
✅ Role-based access control
✅ Refresh token mechanism

## 📖 Full Documentation

See `README.md` for:
- Complete API documentation
- Database schema details
- Configuration options
- Production deployment guide
- Troubleshooting guide

---

**Questions?** Check README.md or create an issue!
