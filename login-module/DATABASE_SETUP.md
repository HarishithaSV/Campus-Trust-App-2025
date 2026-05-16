# Database Schema Setup

This file contains the SQL schema for the Campus App Login Module.

## MySQL Setup

```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS campus_app;
USE campus_app;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role ENUM('ADMIN', 'STUDENT', 'FACULTY', 'MANAGEMENT') NOT NULL DEFAULT 'STUDENT',
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    is_email_verified BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(15),
    profile_picture_url VARCHAR(500),
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_oauth (oauth_provider, oauth_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Login Audit Table (Optional)
CREATE TABLE IF NOT EXISTS login_audit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    status VARCHAR(20),
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (login_timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reset Token Table (Optional - for password reset)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Insert Queries
-- Insert Admin User (Password: Admin@123)
INSERT INTO users (username, email, password, first_name, last_name, role, status, is_email_verified)
VALUES ('admin', 'admin@campus.edu', 
        '$2a$12$UD6iDMUYnRDrU6I/bVP5qe7RdoTjEqyZYKNg4P4Yyq4TiIdoXGBkG', 
        'Admin', 'User', 'ADMIN', 'ACTIVE', true);

-- Insert Sample Student User (Password: Student@123)
INSERT INTO users (username, email, password, first_name, last_name, role, status, is_email_verified)
VALUES ('student1', 'student1@campus.edu', 
        '$2a$12$fhVU.nxyJhCJ3I8PHJ8PqeQp8oZsF8w5sZEH4rDvwK1RKvlMUWE5C', 
        'John', 'Doe', 'STUDENT', 'ACTIVE', true);

-- Insert Sample Faculty User (Password: Faculty@123)
INSERT INTO users (username, email, password, first_name, last_name, role, status, is_email_verified)
VALUES ('faculty1', 'faculty1@campus.edu', 
        '$2a$12$0qKJfLCBEhCCFHVYUhxKH.WrZLLLaQQIlQfcZqVH.5KuPLFxN3ZrS', 
        'Jane', 'Smith', 'FACULTY', 'ACTIVE', true);

-- Insert Sample Management User (Password: Management@123)
INSERT INTO users (username, email, password, first_name, last_name, role, status, is_email_verified)
VALUES ('management1', 'management1@campus.edu', 
        '$2a$12$OLBfLIBEhCCFHVYUhxKH.WrZLLLaQQIlQfcZqVH.5KuPLFxN3ZrS', 
        'Robert', 'Johnson', 'MANAGEMENT', 'ACTIVE', true);
```

## PostgreSQL Setup

```sql
-- Create Database
CREATE DATABASE campus_app;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    is_email_verified BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(15),
    profile_picture_url VARCHAR(500),
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_status ON users(status);
CREATE INDEX idx_oauth ON users(oauth_provider, oauth_id);

-- Login Audit Table
CREATE TABLE IF NOT EXISTS login_audit (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    status VARCHAR(20)
);

CREATE INDEX idx_audit_user_id ON login_audit(user_id);
CREATE INDEX idx_audit_timestamp ON login_audit(login_timestamp);
```

## Test Data

Login with these credentials to test different roles:

| Role | Username | Email | Password |
|------|----------|-------|----------|
| Admin | admin | admin@campus.edu | Admin@123 |
| Student | student1 | student1@campus.edu | Student@123 |
| Faculty | faculty1 | faculty1@campus.edu | Faculty@123 |
| Management | management1 | management1@campus.edu | Management@123 |

> Note: These are BCrypt hashed passwords. Use the web interface to create new users.

## Migrations

To apply migrations programmatically, set in `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=update  # Create/update tables
```

Or use Flyway for version control:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

Place migration files in `src/main/resources/db/migration/`
