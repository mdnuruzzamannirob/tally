# Vercel Deployment Configuration

## Environment Variables

To deploy to Vercel, you need to configure the following environment variables:

### Required Variables

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Setup Instructions

### 1. Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select "Import Git Repository"
4. Connect your GitHub repository: `github.com/mdnuruzzamannirob/tally`

### 2. Configure Project Settings

Select `tally_web` as the project root:
- **Framework**: Next.js
- **Root Directory**: `tally_web`
- **Build Command**: `pnpm run build`
- **Install Command**: `pnpm install --frozen-lockfile`
- **Output Directory**: `.next`

### 3. Set Environment Variables

In the Vercel project settings (Settings → Environment Variables):

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Important**: Set these for all environments:
- Preview
- Production
- Development

### 4. Deploy

Push to main branch to automatically deploy:
```bash
git push origin main
```

Or manually trigger deployment from Vercel dashboard.

## Troubleshooting

### Build Error: Invalid URL Format

If you see:
```
Error [ZodError]: "code": "invalid_format", "format": "url"
```

**Solution**: Ensure environment variables are set in Vercel project settings, not just in `.env.production`.

### Build Timeout

If build times out:
1. Check the build logs in Vercel dashboard
2. Optimize Next.js config: disable ISR, reduce prerendering
3. Increase build timeout in `vercel.json` (if needed)

### Dependencies Installation Fails

```bash
# Clear pnpm cache
pnpm install --force

# Push again
git push origin main
```

## Build Performance

Current build time: ~35-40 seconds

Optimizations applied:
- Webpack bundler (faster than SWC)
- Static page generation
- Image optimization
- Code splitting

## Production Deployment

### Prerequisites

1. ✅ Backend API running on production domain
2. ✅ Environment variables configured in Vercel
3. ✅ DNS configured to point to Vercel

### Deployment Steps

1. **Configure environment variables**
   - Go to Vercel Project Settings
   - Add production environment variables
   - Ensure `NEXT_PUBLIC_API_URL` points to production API

2. **Deploy**
   - Push to main branch
   - Vercel automatically builds and deploys
   - Check deployment status in Vercel dashboard

3. **Verify**
   - Visit your production domain
   - Check browser console for errors
   - Test API calls in Network tab
   - Verify OAuth sign-in flows

### Rollback

To rollback to previous version:
1. Go to Vercel project
2. Click "Deployments"
3. Find previous successful deployment
4. Click "..." → "Promote to Production"

## Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. DNS changes may take up to 48 hours

## SSL/TLS Certificate

Vercel automatically provisions SSL certificates for all domains using Let's Encrypt.

Certificates auto-renew every 30 days. No manual action needed.

## Monitoring

### Build Logs

- View all build logs in Vercel dashboard
- Each deployment shows detailed build output
- Errors are highlighted and linked to documentation

### Analytics

Enable Vercel Analytics:
1. Settings → Analytics
2. Click "Enable"
3. Choose pricing plan

### Runtime Logs

View production errors and logs:
1. Functions → Logs
2. Monitor real-time requests and errors

## CI/CD Integration

### GitHub Actions

Vercel automatically integrates with GitHub:
- Preview deployments on PRs
- Production deployment on merge to main
- Automatic rollback on deployment failure (configurable)

### Pull Request Previews

Each PR automatically gets:
- Preview deployment URL
- Vercel bot comments with deployment status
- Automatic preview cleanup when PR is closed

## Database Connection from Vercel

For connecting to backend API:
- Use `NEXT_PUBLIC_API_URL` for frontend calls
- Set to production API domain in environment variables
- Ensure CORS allows Vercel domain

## Performance Monitoring

### Web Vitals

Vercel Web Analytics shows:
- Core Web Vitals (LCP, FID, CLS)
- Real user performance data
- Performance trends over time

### Lighthouse

Vercel runs Lighthouse on production:
- Performance scores
- SEO analysis
- Best practices
- Accessibility checks

## File Limits

- **Deployment size**: Up to 250MB
- **Build output size**: Up to 150MB
- **Serverless function size**: Up to 50MB

If you exceed limits, optimize:
- Remove unused dependencies
- Compress assets
- Split routes into separate functions

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [GitHub Issues](https://github.com/mdnuruzzamannirob/tally/issues)
