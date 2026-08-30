# Tally Web Deployment Quick Start

## 30-Second Setup

### 1. Verify Production Ready
```bash
./scripts/check-production-ready.sh
```

### 2. Build & Test Locally
```bash
pnpm install
pnpm build
pnpm start  # Test the build
```

### 3. Configure Production Environment
```bash
# Edit .env.production with your production values
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
nano .env.production
```

### 4. Deploy

#### Option A: Docker Compose (Recommended for VPS)
```bash
docker-compose -f docker-compose.deploy.yml up -d
```

#### Option B: Vercel (Recommended for SaaS)
```bash
# Push to GitHub and connect to Vercel dashboard
# https://vercel.com/import
```

#### Option C: Kubernetes
```bash
kubectl apply -f deployment.yaml
```

---

## Full Deployment Steps

### Prerequisites
- Node.js 20.9.0+
- pnpm 9.0.0+
- Docker (for containerized deployment)
- Production domain & SSL certificate

### Step 1: Configure Environment
```bash
# Copy and update production environment
cp .env.example .env.production

# Edit with your values
nano .env.production
```

**Required Variables:**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 2: Run Readiness Checks
```bash
./scripts/check-production-ready.sh

# Fix any failed checks before proceeding
```

### Step 3: Build Production Bundle
```bash
pnpm install
pnpm build
```

### Step 4: Test Locally
```bash
pnpm start

# Visit http://localhost:3000
# Verify the app loads and connects to the API
```

### Step 5: Build Docker Image
```bash
docker build -t tally-web:latest .
```

### Step 6: Deploy

**For Docker Compose:**
```bash
docker-compose -f docker-compose.deploy.yml up -d
```

**For Kubernetes:**
```bash
# Update deployment.yaml with your image and settings
kubectl apply -f deployment.yaml
```

### Step 7: Configure Reverse Proxy (Nginx)

See `docs/deployment.md` for Nginx configuration template.

```bash
# Quick setup with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Step 8: Verify Deployment
```bash
# Check health
curl https://app.yourdomain.com/

# Monitor logs
docker-compose -f docker-compose.deploy.yml logs -f web
```

---

## Deployment Commands Reference

```bash
# Check if ready to deploy
./scripts/check-production-ready.sh

# Full deployment with tests
./scripts/deploy.sh production deploy

# Build only
./scripts/deploy.sh production build

# Build and push to registry
./scripts/deploy.sh production build-and-push

# Check deployment status
./scripts/deploy.sh production status

# Deploy with Docker Compose
docker-compose -f docker-compose.deploy.yml up -d

# View logs
docker-compose -f docker-compose.deploy.yml logs -f web

# Stop deployment
docker-compose -f docker-compose.deploy.yml down

# Restart service
docker-compose -f docker-compose.deploy.yml restart web
```

---

## Common Issues

### Issue: "Cannot connect to API"
**Solution:** Verify `NEXT_PUBLIC_API_URL` is set correctly and API is accessible.

```bash
# Test API endpoint
curl https://api.yourdomain.com/api/v1/health
```

### Issue: "Port 3000 already in use"
**Solution:** Find and stop the existing process.

```bash
lsof -i :3000
kill -9 <PID>
```

### Issue: "Docker image build fails"
**Solution:** Clear cache and try again.

```bash
docker system prune -a
docker build --no-cache -t tally-web:latest .
```

### Issue: "High memory usage"
**Solution:** Increase container memory limit.

```bash
# Docker run
docker run -m 2g tally-web:latest

# Docker Compose - edit docker-compose.deploy.yml
# Increase memory in deploy.resources.limits.memory
```

---

## Performance Optimization

### Enable Static Asset Caching
Update your reverse proxy (Nginx) to cache static assets:

```nginx
location /_next/static/ {
    expires 30d;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### Enable Gzip Compression
```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
```

### Use CDN for Static Assets
Upload `public/` directory to a CDN and update `next.config.ts`:

```typescript
images: {
  unoptimized: true,
  path: 'https://cdn.yourdomain.com/_next/image',
}
```

---

## Monitoring & Alerts

### Set Up Health Checks
```bash
# Check endpoint
curl -I https://app.yourdomain.com/

# Automated monitoring
# Consider: Uptime Robot, New Relic, DataDog, Sentry
```

### View Logs
```bash
# Docker
docker logs -f tally-web

# Docker Compose
docker-compose -f docker-compose.deploy.yml logs -f web

# Kubernetes
kubectl logs -f deployment/tally-web
```

---

## Rollback Plan

If deployment fails:

```bash
# Docker Compose - revert to previous image
docker-compose -f docker-compose.deploy.yml down
docker-compose -f docker-compose.deploy.yml up -d  # Uses previous image
```

---

## Next Steps

1. Read full documentation: `docs/deployment.md`
2. Set up monitoring: Sentry, DataDog, New Relic
3. Configure CI/CD: GitHub Actions, GitLab CI
4. Set up backups
5. Document runbooks for common issues

---

## Support & Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
