# EcoAlert - Deployment Guide

## Development Setup

### Local Development
```bash
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Visit: http://localhost:3000
```

---

## Production Build & Deployment

### Build for Production
```bash
# Create optimized build
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

---

## Deployment Platforms

### Option 1: Vercel (Recommended for Next.js)

**Advantages:**
- Zero-config deployment
- Automatic scaling
- Built-in CDN
- Environment variables management
- Preview deployments

**Steps:**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Configure environment (if needed)
vercel env add DATABASE_URL
vercel redeploy
```

Or use GitHub integration:
- Push to GitHub repository
- Connect repository in Vercel dashboard
- Automatic deployments on push

### Option 2: Docker

**Dockerfile**
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
```

**Build & Run:**
```bash
# Build image
docker build -t ecoalert:latest .

# Run container
docker run -p 3000:3000 ecoalert:latest
```

### Option 3: Node.js Server (AWS EC2, DigitalOcean, etc.)

**Setup:**
```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone https://github.com/your-repo/EcoAlert.git
cd EcoAlert

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Build
npm run build

# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start npm --name "ecoalert" -- start

# Setup auto-restart on reboot
pm2 startup
pm2 save
```

### Option 4: Heroku

**Create Procfile:**
```
web: npm start
```

**Deploy:**
```bash
# Login to Heroku
heroku login

# Create app
heroku create ecoalert

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Environment Configuration

### Environment Variables

Create `.env.local` (development) or `.env.production.local` (production):

```env
# Database (if adding real backend)
DATABASE_URL=postgresql://...

# External APIs
NEWS_API_KEY=your_api_key
FINANCIAL_API_KEY=your_api_key

# Application
NODE_ENV=production
LOG_LEVEL=info
```

### Next.js Configuration

Edit `next.config.js` for production:
```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations
  optimizeFonts: true,
  compress: true,
  
  // Security headers
  headers() {
    return [{
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        }
      ]
    }]
  }
};

module.exports = nextConfig;
```

---

## Scaling Considerations

### Current Architecture (Single Process)
- **Load**: <1000 daily requests
- **Concurrent Users**: <100
- **Cache**: In-memory (5-minute TTL)
- **Database**: None

### For Production Scaling

#### 1. Add Caching Layer
```typescript
// Replace in-memory cache with Redis
import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

class PredictionCache {
  async set(key: string, value: any, ttl = 300) {
    await client.setEx(key, ttl, JSON.stringify(value));
  }
  
  async get(key: string) {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }
}
```

#### 2. Add Database
```typescript
// Example: PostgreSQL
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Store prediction history
async function storePrediction(prediction: Prediction) {
  await pool.query(
    'INSERT INTO predictions (id, data, created_at) VALUES ($1, $2, $3)',
    [prediction.id, JSON.stringify(prediction), new Date()]
  );
}
```

#### 3. Load Balancing
```bash
# Multiple instances behind nginx
upstream ecoalert {
  server localhost:3000;
  server localhost:3001;
  server localhost:3002;
}

server {
  listen 80;
  server_name ecoalert.com;
  
  location / {
    proxy_pass http://ecoalert;
    proxy_set_header Host $host;
  }
}
```

#### 4. Background Jobs
```typescript
// Use Bull or similar for async processing
import Queue from 'bull';

const forecastQueue = new Queue('forecast', {
  redis: { host: 'localhost', port: 6379 }
});

// Queue a forecast
forecastQueue.add({ domain, description }, {
  attempts: 3,
  backoff: 'exponential'
});

// Process queue
forecastQueue.process(async (job) => {
  const result = await generateForecast(job.data);
  return result;
});
```

---

## Monitoring & Logging

### Application Monitoring
```typescript
// Add to src/app/api/forecast/route.ts
import { performance } from 'perf_hooks';

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    // ... forecast logic
    
    const duration = performance.now() - startTime;
    console.log({
      event: 'forecast_generated',
      duration,
      domain: body.domain,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error({
      event: 'forecast_error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

### Use Monitoring Services
- **Sentry** - Error tracking
- **DataDog** - Performance monitoring
- **New Relic** - Full-stack monitoring
- **CloudWatch** (AWS) - Logs and metrics

---

## Continuous Deployment

### GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
      run: |
        vercel --prod --token $VERCEL_TOKEN
```

---

## SSL/TLS Certificate

### Using Certbot (Let's Encrypt)
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d ecoalert.com -d www.ecoalert.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### In Nginx
```nginx
server {
  listen 443 ssl;
  server_name ecoalert.com;
  
  ssl_certificate /etc/letsencrypt/live/ecoalert.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/ecoalert.com/privkey.pem;
  
  location / {
    proxy_pass http://localhost:3000;
  }
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name ecoalert.com;
  return 301 https://$server_name$request_uri;
}
```

---

## Database Setup (Optional)

### PostgreSQL
```sql
-- Create predictions table
CREATE TABLE predictions (
  id VARCHAR(255) PRIMARY KEY,
  domain VARCHAR(50),
  description TEXT,
  prediction_data JSONB,
  confidence DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_domain ON predictions(domain);
CREATE INDEX idx_created_at ON predictions(created_at DESC);
CREATE INDEX idx_confidence ON predictions(confidence DESC);
```

---

## API Rate Limiting

### Using express-rate-limit
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

export async function POST(request: NextRequest) {
  // Apply rate limiting
  // ...
}
```

---

## Performance Optimization

### 1. Enable Compression
```javascript
// next.config.js
const nextConfig = {
  compress: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  }
};
```

### 2. Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="EcoAlert"
  width={200}
  height={200}
  priority
/>
```

### 3. Code Splitting
```typescript
import dynamic from 'next/dynamic';

const PredictionCard = dynamic(() => 
  import('@/components/prediction-card').then(mod => mod.PredictionCard)
);
```

### 4. Caching Headers
```typescript
// Set in response headers
response.headers.set('Cache-Control', 'max-age=60');
```

---

## Backup & Recovery

### Backup Strategy
```bash
# Database backup (PostgreSQL)
pg_dump dbname > backup.sql

# Scheduled backups (cron)
0 2 * * * /usr/bin/pg_dump dbname > /backups/db_$(date +\%Y\%m\%d).sql

# S3 backup
aws s3 cp backup.sql s3://my-bucket/backups/
```

---

## Security Checklist

- ✅ HTTPS/SSL enabled
- ✅ Environment variables for secrets
- ✅ Input validation on all endpoints
- ✅ CORS configured appropriately
- ✅ Rate limiting enabled
- ✅ Security headers set
- ✅ Dependencies kept up-to-date
- ✅ Regular security audits

---

## Maintenance

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions (carefully)
npm upgrade
```

### Log Rotation
```bash
# Using logrotate (Linux)
/var/log/ecoalert/*.log {
  daily
  rotate 7
  compress
  delaycompress
  missingok
  postrotate
    systemctl restart ecoalert
  endscript
}
```

---

## Rollback Plan

### If deployment fails:
```bash
# Docker rollback
docker run -p 3000:3000 ecoalert:previous

# Git rollback
git revert HEAD
git push

# Vercel rollback
vercel rollback [deployment-id]

# Manual rollback
git checkout v1.2.3
npm run build
npm start
```

---

## Support & Troubleshooting

**Issue: High memory usage**
- Check for memory leaks with: `node --inspect start`
- Increase Node.js heap: `NODE_OPTIONS="--max-old-space-size=4096"`

**Issue: Slow predictions**
- Check cache effectiveness
- Profile with: `node --prof app.js`
- Consider adding Redis layer

**Issue: Database connections exhausted**
- Increase connection pool size
- Check for connection leaks in queries
- Implement connection pooling

---

## Cost Estimation

| Platform | Cost | Notes |
|----------|------|-------|
| Vercel | $0-20/month | Auto-scaling, ideal for Next.js |
| Docker + VPS | $5-20/month | DigitalOcean, Linode |
| AWS | $10-100+/month | Depends on usage |
| Heroku | $7-50/month | Simple deployment |

---

This deployment guide provides everything needed to take EcoAlert from development to production across various platforms.
