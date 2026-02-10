# Dabba AI - Deployment Guide

## 🚀 Production Deployment Guide

This guide covers deploying Dabba AI to production environments, including containerization, cloud deployment, and production optimizations.

## 📋 Deployment Overview

Dabba AI can be deployed using several strategies:

- **Container Deployment**: Docker + Docker Compose (Recommended)
- **Cloud Platforms**: AWS, Google Cloud, Azure
- **Self-Hosted**: Traditional server deployment
- **Serverless**: Function-based deployment (Future)

---

## 1. 🐳 Container Deployment (Recommended)

### Docker Setup

#### Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

**Frontend Dockerfile:**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production server
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Configuration (frontend/nginx.conf):**
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Create Docker Compose File

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  # Ollama AI service
  ollama:
    image: ollama/ollama:latest
    container_name: dabba-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/version"]
      interval: 30s
      timeout: 10s
      retries: 3

  # FastAPI Backend
  backend:
    build: ./backend
    container_name: dabba-backend
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_URL=http://ollama:11434
      - MONGODB_URL=mongodb://mongodb:27017/dabba_ai
      - ENVIRONMENT=production
    volumes:
      - ./data:/app/data
      - backend_logs:/app/logs
    depends_on:
      ollama:
        condition: service_healthy
      mongodb:
        condition: service_started
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # React Frontend
  frontend:
    build: ./frontend
    container_name: dabba-frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

  # MongoDB Database (Optional)
  mongodb:
    image: mongo:7.0
    container_name: dabba-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./docker/mongo-init:/docker-entrypoint-initdb.d
    environment:
      - MONGO_INITDB_DATABASE=dabba_ai
    restart: unless-stopped

  # Reverse Proxy (Optional)
  nginx:
    image: nginx:alpine
    container_name: dabba-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  ollama_data:
  mongodb_data:
  backend_logs:

networks:
  default:
    name: dabba-network
```

### Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Scale services (if needed)
docker-compose up -d --scale backend=3

# Update services
docker-compose down
docker-compose pull
docker-compose up -d
```

### Production Optimizations

#### Environment Variables

**Create `.env` file:**
```env
# Domain and SSL
DOMAIN_NAME=your-domain.com
SSL_EMAIL=admin@your-domain.com

# Database
MONGODB_URL=mongodb://mongodb:27017/dabba_ai
MONGODB_ROOT_PASSWORD=your-secure-password

# Security
JWT_SECRET=your-jwt-secret-key
API_KEY=your-api-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

#### SSL/TLS Configuration

```bash
# Install certbot for Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew certificates
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 2. ☁️ Cloud Platform Deployment

### AWS Deployment

#### Using AWS ECS (Fargate)

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name dabba-ai
```

2. **Build and Push Images**
```bash
# Authenticate Docker to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin [account-id].dkr.ecr.[region].amazonaws.com

# Build and tag images
docker build -t dabba-backend ./backend
docker tag dabba-backend:latest [account-id].dkr.ecr.[region].amazonaws.com/dabba-ai:backend

# Push images
docker push [account-id].dkr.ecr.[region].amazonaws.com/dabba-ai:backend
```

3. **Create ECS Cluster and Service**
```bash
# Create cluster
aws ecs create-cluster --cluster-name dabba-ai-cluster

# Register task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Create service
aws ecs create-service --cluster dabba-ai-cluster --service-name dabba-ai-service --task-definition dabba-ai --desired-count 2
```

#### Using AWS Lightsail

1. **Create Lightsail Instance**
   - Choose Ubuntu 22.04
   - Select appropriate instance size (8GB RAM minimum)

2. **Deploy Application**
```bash
# SSH into instance
ssh ubuntu@[instance-ip]

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Deploy application
git clone [your-repo-url]
cd dabba-ai
docker-compose up -d
```

### Google Cloud Deployment

#### Using Cloud Run

1. **Build and Push to Container Registry**
```bash
# Configure gcloud
gcloud config set project [your-project-id]
gcloud auth configure-docker

# Build and push backend
docker build -t gcr.io/[project-id]/dabba-backend ./backend
docker tag gcr.io/[project-id]/dabba-backend gcr.io/[project-id]/dabba-backend:latest
docker push gcr.io/[project-id]/dabba-backend:latest
```

2. **Deploy to Cloud Run**
```bash
# Deploy backend
gcloud run deploy dabba-backend \
  --image gcr.io/[project-id]/dabba-backend \
  --platform managed \
  --region [region] \
  --allow-unauthenticated

# Deploy frontend (static site)
gcloud run deploy dabba-frontend \
  --image gcr.io/[project-id]/dabba-frontend \
  --platform managed \
  --region [region] \
  --allow-unauthenticated
```

#### Using Google App Engine

```bash
# Deploy backend (Python)
cd backend
gcloud app deploy app.yaml

# Deploy frontend (static files)
cd ../frontend
gcloud app deploy frontend.yaml
```

### Azure Deployment

#### Using Azure Container Instances

```bash
# Create resource group
az group create --name dabba-ai-rg --location eastus

# Create container group
az container create \
  --resource-group dabba-ai-rg \
  --name dabba-ai \
  --image [your-container-registry]/dabba-ai:latest \
  --dns-name-label dabba-ai-[unique-id] \
  --ports 80 8000 \
  --environment-variables OLLAMA_URL=http://ollama:11434
```

---

## 3. 🖥️ Traditional Server Deployment

### Ubuntu Server Setup

#### System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    nginx \
    certbot \
    python3-certbot-nginx \
    mongodb \
    git \
    curl \
    wget

# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Application Deployment

```bash
# Clone repository
git clone [your-repo-url]
cd dabba-ai

# Setup backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Setup frontend
cd ../frontend
npm install
npm run build

# Configure nginx
sudo cp nginx.conf /etc/nginx/sites-available/dabba-ai
sudo ln -s /etc/nginx/sites-available/dabba-ai /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

#### Systemd Services

**Create `/etc/systemd/system/dabba-backend.service`:**
```ini
[Unit]
Description=Dabba AI Backend
After=network.target mongodb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/dabba-ai/backend
Environment=PATH=/path/to/dabba-ai/backend/.venv/bin
ExecStart=/path/to/dabba-ai/backend/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Create `/etc/systemd/system/dabba-ollama.service`:**
```ini
[Unit]
Description=Ollama AI Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ollama serve
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable dabba-backend ollama
sudo systemctl start dabba-backend ollama

# Check status
sudo systemctl status dabba-backend
sudo systemctl status ollama
```

---

## 4. 🔒 Security Configuration

### SSL/TLS Setup

#### Using Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com

# Configure auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Manual SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL Security Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Firewall Configuration

```bash
# Configure UFW (Ubuntu)
sudo ufw allow 'OpenSSH'
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Or use iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -P INPUT DROP
```

### Authentication Setup

#### JWT Configuration

```python
# main.py - Add authentication
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=["HS256"]
        )
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return username
```

---

## 5. 📊 Monitoring and Logging

### Application Monitoring

#### Health Checks

```bash
# Backend health check
curl https://your-domain.com/health

# Frontend health check
curl https://your-domain.com/

# Ollama status
curl http://localhost:11434/api/version
```

#### Log Aggregation

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/dabba-ai

# /var/log/dabba-ai/*.log {
#     daily
#     rotate 30
#     compress
#     delaycompress
#     missingok
#     notifempty
#     create 644 ubuntu ubuntu
# }
```

### Performance Monitoring

#### Using Prometheus + Grafana

```yaml
# docker-compose monitoring addition
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

#### Key Metrics to Monitor

- Response times
- Error rates
- Resource usage (CPU, Memory, Disk)
- AI model performance
- File upload success rates

### Alerting Setup

```bash
# Install monitoring tools
sudo apt install -y prometheus-node-exporter

# Configure alerts for:
# - High response times (>5s)
# - Error rate > 5%
# - Disk usage > 80%
# - Memory usage > 90%
```

---

## 6. 🚀 Production Optimization

### Performance Tuning

#### Backend Optimization

```python
# main.py - Production settings
from fastapi import FastAPI
import asyncio

app = FastAPI(
    title="Dabba AI",
    description="AI-powered study assistant",
    version="1.0.0",
    docs_url=None,  # Disable Swagger UI in production
    redoc_url=None,  # Disable ReDoc in production
)

# Connection pooling for external services
@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

#### Frontend Optimization

```javascript
// vite.config.js - Production build
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['axios', 'tailwindcss']
        }
      }
    }
  }
})
```

### Caching Strategy

#### Browser Caching

```nginx
# nginx.conf - Cache configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

#### Application Caching

```python
# Backend caching with Redis (optional)
import redis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache

# Initialize cache
redis_client = redis.Redis(host='localhost', port=6379, db=0)
FastAPICache.init(RedisBackend(redis_client), prefix="dabba-ai")

# Use cache decorator
@cache(expire=3600)  # Cache for 1 hour
@app.get("/api/models")
async def get_models():
    # This will be cached
    pass
```

### Database Optimization

#### MongoDB Optimization

```javascript
// MongoDB indexes for better performance
db.sessions.createIndex({ "userId": 1, "createdAt": -1 })
db.materials.createIndex({ "chunk_text": "text" })
db.analytics.createIndex({ "timestamp": -1, "event": 1 })
```

#### Connection Pooling

```python
# MongoDB connection with pooling
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(
    MONGODB_URL,
    maxPoolSize=10,
    minPoolSize=5,
    maxIdleTimeMS=30000
)
```

---

## 7. 🔄 CI/CD Pipeline

### GitHub Actions Example

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    - name: Install dependencies
      run: |
        cd backend && pip install -r requirements.txt
    - name: Run tests
      run: |
        cd backend && pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to server
      run: |
        echo "Deploying to production server"
        # Add your deployment commands here
```

### Automated Deployment

```bash
#!/bin/bash
# deploy.sh

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker-compose down
docker-compose pull
docker-compose up -d --build

# Run database migrations (if needed)
# python manage.py migrate

# Health check
sleep 30
curl -f https://your-domain.com/health || exit 1

echo "Deployment successful!"
```

---

## 8. 🛠️ Maintenance and Troubleshooting

### Backup Strategy

#### Database Backups

```bash
# MongoDB backup
mongodump --db dabba_ai --out /backup/dabba_ai_$(date +%Y%m%d_%H%M%S)

# Automated backup script
#!/bin/bash
# Add to crontab: 0 2 * * * /path/to/backup.sh
```

#### Application Backups

```bash
# Backup application data
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz \
    /path/to/dabba-ai/data/ \
    /path/to/dabba-ai/backend/logs/ \
    /etc/nginx/sites-available/dabba-ai
```

### Log Management

```bash
# Centralized logging with ELK Stack
# Elasticsearch + Logstash + Kibana

# Or use cloud logging
# AWS CloudWatch
# Google Cloud Logging
# Azure Monitor
```

### Troubleshooting Commands

```bash
# Check service status
sudo systemctl status dabba-backend ollama nginx

# View application logs
sudo journalctl -u dabba-backend -f
sudo tail -f /var/log/nginx/access.log

# Check resource usage
htop
df -h  # Disk usage
free -h  # Memory usage

# Test connectivity
curl -I https://your-domain.com/
curl -f http://localhost:8000/health

# Database connectivity
mongosh --eval "db.runCommand('ismaster')"
```

---

## 9. 📈 Scaling and High Availability

### Horizontal Scaling

#### Load Balancer Setup

```nginx
# nginx.conf - Load balancer configuration
upstream backend_servers {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Auto-scaling Configuration

```bash
# AWS Auto Scaling Group
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name dabba-ai-asg \
    --launch-configuration-name dabba-ai-lc \
    --min-size 2 \
    --max-size 10 \
    --desired-capacity 3 \
    --target-group-arns [target-group-arn]
```

### Database Scaling

#### MongoDB Sharding

```bash
# Configure sharded cluster
mongos --configdb config-server-replica-set/[host]:27019
mongo --host [mongos-host] --eval "sh.enableSharding('dabba_ai')"
```

#### Read Replicas

```yaml
# docker-compose with read replicas
services:
  mongodb-primary:
    image: mongo:7.0
    command: mongod --replSet rs0 --bind_ip_all

  mongodb-secondary:
    image: mongo:7.0
    command: mongod --replSet rs0 --bind_ip_all
    depends_on:
      - mongodb-primary
```

---

## 10. 📋 Production Checklist

### Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Database backups scheduled
- [ ] Monitoring and alerting setup
- [ ] Load testing completed
- [ ] Documentation updated

### Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Authentication implemented
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] Secrets management setup

### Performance Checklist

- [ ] Caching configured
- [ ] Database indexes created
- [ ] Static assets optimized
- [ ] Compression enabled
- [ ] CDN configured (if needed)

### Monitoring Checklist

- [ ] Health checks implemented
- [ ] Log aggregation setup
- [ ] Performance monitoring enabled
- [ ] Error tracking configured
- [ ] Backup verification completed

---

## 🚨 Emergency Procedures

### Service Recovery

```bash
# Restart all services
sudo systemctl restart dabba-backend ollama nginx

# Or using Docker Compose
docker-compose restart

# Check system resources
sudo systemctl status --no-pager -l
```

### Data Recovery

```bash
# Restore from backup
mongorestore --db dabba_ai /path/to/backup/dabba_ai/

# Verify data integrity
mongosh --eval "db.sessions.countDocuments()"
```

### Security Incident Response

1. **Isolate affected systems**
2. **Preserve evidence/logs**
3. **Assess damage**
4. **Restore from clean backups**
5. **Update security measures**
6. **Monitor for reoccurrence**

---

## 📞 Support and Resources

### Getting Help

1. **Documentation**: Check this deployment guide and other docs
2. **Logs**: Review application and system logs
3. **Monitoring**: Check Grafana/Prometheus dashboards
4. **Community**: Search GitHub issues and discussions

### Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [MongoDB Production Checklist](https://docs.mongodb.com/manual/administration/production-checklist/)
- [Ollama Production Guide](https://github.com/jmorganca/ollama)

### Contact Information

For deployment issues or questions:
- **GitHub Issues**: Bug reports and feature requests
- **Email**: admin@your-domain.com (replace with actual contact)
- **Slack/Discord**: Community support channels

---

**🎉 Congratulations! Your Dabba AI application is now deployed to production!**

This deployment guide provides comprehensive instructions for deploying Dabba AI in various environments. Remember to regularly update, monitor, and backup your production deployment.
