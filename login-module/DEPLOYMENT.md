# Deployment Guide for Campus App Login Module

## Production Deployment Checklist

### Pre-Deployment

- [ ] Review and update all security configurations
- [ ] Generate new JWT secret (minimum 32 characters)
- [ ] Configure production database
- [ ] Enable HTTPS/TLS
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable audit logging
- [ ] Set up monitoring and alerting
- [ ] Review CORS configuration
- [ ] Enable rate limiting
- [ ] Configure CDN (optional)

## Deployment Options

### Option 1: Traditional Server (Linux/Ubuntu)

**Prerequisites:**
```bash
sudo apt-get update
sudo apt-get install openjdk-17-jdk mysql-server
```

**Deploy:**
```bash
# Copy JAR file
scp target/login-module-1.0.0.jar user@server:/home/app/

# Create systemd service
sudo nano /etc/systemd/system/campus-auth.service
```

**systemd Service File:**
```ini
[Unit]
Description=Campus App Login Module
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=10
User=app
Environment="SPRING_PROFILES_ACTIVE=production"
Environment="DB_URL=jdbc:mysql://localhost:3306/campus_app"
Environment="DB_USERNAME=${DB_USER}"
Environment="DB_PASSWORD=${DB_PASSWORD}"
Environment="JWT_SECRET=${JWT_SECRET}"
ExecStart=/usr/bin/java -jar /home/app/login-module-1.0.0.jar

[Install]
WantedBy=multi-user.target
```

**Start Service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable campus-auth
sudo systemctl start campus-auth
sudo systemctl status campus-auth
```

### Option 2: Docker Deployment

**Dockerfile:**
```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/login-module-1.0.0.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
```

**Build Docker Image:**
```bash
docker build -t campus-auth:1.0.0 .
```

**Run Docker Container:**
```bash
docker run -d \
  --name campus-auth \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/campus_app \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=password \
  -e JWT_SECRET=your_secret_key \
  campus-auth:1.0.0
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: campus_app
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  auth-service:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/campus_app
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: password
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mysql
    restart: always

volumes:
  mysql_data:
```

**Deploy with Docker Compose:**
```bash
docker-compose up -d
```

### Option 3: Kubernetes Deployment

**Deployment YAML:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: campus-auth
spec:
  replicas: 3
  selector:
    matchLabels:
      app: campus-auth
  template:
    metadata:
      labels:
        app: campus-auth
    spec:
      containers:
      - name: auth
        image: campus-auth:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_DATASOURCE_URL
          valueFrom:
            configMapKeyRef:
              name: campus-config
              key: db-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: campus-secret
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/auth/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10

---
apiVersion: v1
kind: Service
metadata:
  name: campus-auth-service
spec:
  selector:
    app: campus-auth
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

**Deploy to Kubernetes:**
```bash
kubectl apply -f deployment.yaml
kubectl create configmap campus-config --from-literal=db-url=jdbc:mysql://mysql:3306/campus_app
kubectl create secret generic campus-secret --from-literal=jwt-secret=your_secret_key
kubectl get pods
```

### Option 4: AWS Elastic Beanstalk

**Create `.ebextensions/java.config`:**
```yaml
option_settings:
  aws:elasticbeanstalk:container:java:
    JVMOptions: -Xmx256m -Xms128m
  aws:elasticbeanstalk:application:environment:
    SPRING_PROFILES_ACTIVE: production
    JWT_SECRET: your_secret_key
```

**Deploy:**
```bash
eb init
eb create campus-auth-prod
eb deploy
```

## Environment Variables

### Production Settings

```bash
export SPRING_PROFILES_ACTIVE=production
export SERVER_PORT=8080
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-db:3306/campus_app
export SPRING_DATASOURCE_USERNAME=db_user
export SPRING_DATASOURCE_PASSWORD=strong_password
export JWT_SECRET=very_long_random_secret_key_min_32_chars
export JWT_EXPIRATION=86400000
export SPRING_JPA_HIBERNATE_DDL_AUTO=validate
export LOGGING_LEVEL_COM_CAMPUSAPP=INFO
```

## SSL/TLS Configuration

### Self-Signed Certificate (Testing):
```bash
keytool -genkey -alias tomcat -storetype PKCS12 -keyalg RSA -keysize 2048 \
  -keystore keystore.p12 -validity 365
```

### Application Properties:
```properties
server.ssl.key-store=keystore.p12
server.ssl.key-store-password=password
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
server.ssl.enabled=true
server.ssl.protocol=TLSv1.2
```

## Monitoring & Logging

### ELK Stack Integration

**Logstash Configuration:**
```json
input {
  file {
    path => "/var/log/campus-auth/*.log"
    start_position => "beginning"
  }
}

filter {
  grok {
    match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} - %{DATA:message}" }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "campus-auth-%{+YYYY.MM.dd}"
  }
}
```

### Application Insights (Azure):
```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-spring-boot-starter</artifactId>
    <version>2.6.1</version>
</dependency>
```

## Database Optimization

### Create Indexes:
```sql
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_login_audit_user_id ON login_audit(user_id);
```

### Connection Pool:
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
```

## Backup & Recovery

### Automated Backups:
```bash
#!/bin/bash
# daily_backup.sh
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p campus_app > /backup/campus_app_$TIMESTAMP.sql
```

### Restore:
```bash
mysql -u root -p campus_app < /backup/campus_app_20240515_120000.sql
```

## Load Balancing

### Nginx Configuration:
```nginx
upstream campus_auth {
    server app1.example.com:8080;
    server app2.example.com:8080;
    server app3.example.com:8080;
}

server {
    listen 80;
    server_name auth.campus.edu;
    
    location / {
        proxy_pass http://campus_auth;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Health Checks

Monitor endpoint:
```bash
curl -s http://localhost:8080/api/auth/health | jq .
```

Automated monitoring:
```bash
#!/bin/bash
while true; do
  if ! curl -s http://localhost:8080/api/auth/health > /dev/null; then
    systemctl restart campus-auth
  fi
  sleep 60
done
```

## Rollback Plan

```bash
# Keep previous version
cp login-module-1.0.0.jar login-module-1.0.0.backup

# Update to new version
cp login-module-1.0.1.jar login-module-1.0.0.jar
systemctl restart campus-auth

# If issues, rollback
cp login-module-1.0.0.backup login-module-1.0.0.jar
systemctl restart campus-auth
```

## Performance Tuning

### JVM Parameters:
```bash
java -Xmx1g -Xms512m \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=200 \
     -jar login-module-1.0.0.jar
```

### Database Connection Pool:
```properties
spring.datasource.hikari.maximum-pool-size=30
spring.datasource.hikari.minimum-idle=10
spring.jpa.properties.hibernate.jdbc.batch_size=20
```

---

For more information, see README.md and API_TESTING.md
