# Tally Web Deployment Guide

This guide covers deploying Tally Web (Next.js frontend) to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Nginx Configuration](#nginx-configuration)
- [Environment Setup](#environment-setup)
- [Monitoring & Health Checks](#monitoring--health-checks)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js >= 20.9.0
- pnpm >= 9.0.0
- Docker (optional, for containerized deployment)
- Backend API running and accessible

---

## Build Process

### Local Build

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Start production server
pnpm start
```

### Verifying Build

```bash
# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Lint code
pnpm lint
```

### Build Artifacts

After `pnpm build`, you'll have:

```
.next/              # Compiled Next.js application
public/             # Static assets
node_modules/       # Dependencies
```

---

## Docker Deployment

### Building Docker Image

```bash
# Build the Docker image
docker build -t tally-web:latest .

# Build with specific tag for registry
docker build -t myregistry.com/tally-web:1.0.0 .
```

### Running Docker Container

```bash
# Run with default environment
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com/api/v1 \
  -e NEXT_PUBLIC_APP_URL=https://app.example.com \
  tally-web:latest

# Run with env file
docker run -p 3000:3000 \
  --env-file .env.production \
  tally-web:latest

# Run with health checks
docker run -p 3000:3000 \
  --health-cmd='curl --fail http://localhost:3000 || exit 1' \
  --health-interval=30s \
  --health-timeout=5s \
  --health-retries=3 \
  tally-web:latest
```

### Docker Compose Deployment

```bash
# Start web service
docker-compose -f docker-compose.deploy.yml up -d

# View logs
docker-compose -f docker-compose.deploy.yml logs -f web

# Stop services
docker-compose -f docker-compose.deploy.yml down

# Restart service
docker-compose -f docker-compose.deploy.yml restart web
```

### Pushing to Container Registry

```bash
# Tag image
docker tag tally-web:latest myregistry.com/tally-web:1.0.0

# Login to registry
docker login myregistry.com

# Push image
docker push myregistry.com/tally-web:1.0.0

# Pull image (for deployment)
docker pull myregistry.com/tally-web:1.0.0
```

---

## Kubernetes Deployment

### Basic Kubernetes Manifest

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tally-web
  labels:
    app: tally-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tally-web
  template:
    metadata:
      labels:
        app: tally-web
    spec:
      containers:
      - name: web
        image: myregistry.com/tally-web:1.0.0
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "https://api.example.com/api/v1"
        - name: NEXT_PUBLIC_APP_URL
          value: "https://app.example.com"
        - name: NODE_ENV
          value: "production"
        - name: NEXT_TELEMETRY_DISABLED
          value: "1"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 30
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 5
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi

---
apiVersion: v1
kind: Service
metadata:
  name: tally-web-service
spec:
  selector:
    app: tally-web
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Deploy to Kubernetes

```bash
# Apply deployment
kubectl apply -f deployment.yaml

# Check deployment status
kubectl get deployments

# Check pods
kubectl get pods -l app=tally-web

# View logs
kubectl logs -l app=tally-web -f

# Describe service
kubectl describe service tally-web-service
```

---

## Nginx Configuration

### Reverse Proxy Setup

```nginx
# /etc/nginx/sites-available/tally-web.conf
upstream tally_web {
  server 127.0.0.1:3000;
  keepalive 64;
}

server {
  listen 80;
  listen [::]:80;
  server_name app.example.com;

  # Redirect HTTP to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name app.example.com;

  # SSL Configuration
  ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  # Security Headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  # Gzip Compression
  gzip on;
  gzip_vary on;
  gzip_types text/plain text/css text/xml text/javascript
             application/x-javascript application/xml+rss
             application/json application/javascript;
  gzip_min_length 1024;

  # Client max upload size
  client_max_body_size 20M;

  # Proxy settings
  location / {
    proxy_pass http://tally_web;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }

  # Static assets caching
  location /_next/static/ {
    proxy_pass http://tally_web;
    proxy_cache_valid 30d;
    proxy_cache_bypass $http_pragma $http_authorization;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location /api/ {
    proxy_pass https://api.example.com;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Enable Configuration

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/tally-web.conf /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Environment Setup

### Production Environment Variables

Update `.env.production` with your production values:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1

# Frontend URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
```

### Verifying Environment

```bash
# Check that environment variables are set
docker run --env-file .env.production tally-web:latest env | grep NEXT_PUBLIC

# Verify build-time variables are in code
docker run tally-web:latest grep -r "NEXT_PUBLIC_API_URL" .next
```

---

## Monitoring & Health Checks

### Health Check Endpoint

The application exposes a health check on the root path:

```bash
# Check health
curl -I https://app.example.com/

# Expected response
HTTP/1.1 200 OK
```

### Monitoring Metrics

Monitor these metrics in production:

- **Response Time**: Should be < 200ms for most requests
- **Error Rate**: Should be < 0.5%
- **Memory Usage**: Should remain stable around 512MB
- **CPU Usage**: Should spike only during build-time operations
- **Disk Space**: Monitor `.next` and node_modules size

### Logging

Logs are captured to stdout/stderr. View with:

```bash
# Docker
docker logs tally-web

# Docker Compose
docker-compose logs -f web

# Kubernetes
kubectl logs -l app=tally-web -f
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### API Connection Issues

1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check backend is running and accessible
3. Verify CORS headers from backend
4. Check network connectivity

```bash
# Test API endpoint
curl https://api.yourdomain.com/api/v1/health
```

### Build Failures

1. Check Node.js version: `node --version` (should be >= 20.9.0)
2. Clear cache: `rm -rf .next node_modules && pnpm install`
3. Check disk space: `df -h`
4. View build logs: `docker build --progress=plain .`

### Docker Image Size Too Large

1. Use multi-stage builds (already configured)
2. Remove test files: Update `.dockerignore`
3. Prune dependencies: `pnpm prune --prod`

### Memory Issues

Increase memory limits:

```bash
# Docker
docker run -m 2g tally-web:latest

# Docker Compose
# Edit docker-compose.deploy.yml, increase memory limit in deploy.resources

# Kubernetes
# Increase requests and limits in deployment manifest
```

### SSL/TLS Issues

```bash
# Test SSL certificate
openssl s_client -connect app.example.com:443

# Verify certificate is valid
curl -v https://app.example.com/
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Backend API URL is correct
- [ ] SSL/TLS certificate is valid
- [ ] Health checks are passing
- [ ] Build succeeds locally
- [ ] Docker image builds successfully
- [ ] Container starts and serves requests
- [ ] Reverse proxy (Nginx) is configured
- [ ] Firewall rules allow traffic
- [ ] Monitoring and logging are configured
- [ ] Database backups are configured
- [ ] Rollback plan is documented

---

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tally Documentation](../README.md)
- Backend deployment guide: `../tally_api/docs/deployment.md`
