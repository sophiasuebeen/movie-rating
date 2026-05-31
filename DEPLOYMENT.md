# Deployment Guide

## Deployment Options

### 1. Self-Hosted VPS (Recommended for Full Control)

#### Prerequisites
- Ubuntu 20.04+ or similar Linux
- Node.js 20+ installed
- PostgreSQL 14+ (optional, for production DB)
- nginx or similar reverse proxy
- SSL certificate (Let's Encrypt)
- Domain name

#### Setup Steps

1. **Clone repository and install dependencies**:
   ```bash
   git clone <your-repo>
   cd movie-rating
   npm install
   npm --prefix server install
   npm --prefix client install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

3. **Build frontend**:
   ```bash
   npm run build
   ```

4. **Setup nginx reverse proxy**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       # Redirect to HTTPS
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
       
       # Frontend
       location / {
           root /path/to/movie-rating/client/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup systemd service**:
   ```ini
   # /etc/systemd/system/movie-rating.service
   [Unit]
   Description=Movie Rating Application
   After=network.target
   
   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/path/to/movie-rating
   Environment="NODE_ENV=production"
   Environment="PORT=4000"
   Environment="DATABASE_URL=postgresql://user:pass@localhost/movierating"
   Environment="JWT_SECRET=your-secret-key"
   ExecStart=/usr/bin/node /path/to/movie-rating/server/src/index.js
   Restart=always
   RestartSec=10
   
   [Install]
   WantedBy=multi-user.target
   ```

6. **Start service**:
   ```bash
   sudo systemctl start movie-rating
   sudo systemctl enable movie-rating
   ```

### 2. Docker Deployment

#### Using Docker Compose

```bash
docker-compose -f docker-compose.yml up -d
```

#### Using Docker Swarm or Kubernetes

Create appropriate manifests and deploy using your orchestration platform.

### 3. Platform as a Service (PaaS)

#### Vercel (Frontend only)
```bash
npm run build
# Connect repository to Vercel
# Set environment variable: VITE_API_URL=https://api.yourdomain.com
```

#### Render.com (Full Stack)
```bash
# Create render.yml
# Configure database, backend, and frontend services
```

#### Railway.app
```bash
# Simple deployment with GitHub integration
# Set environment variables in dashboard
```

#### Fly.io
```bash
flyctl launch
# Follow prompts
```

---

## Post-Deployment

### 1. Database Migration
```bash
npm --prefix server run prisma:migrate -- --skip-generate
```

### 2. Health Check
```bash
curl https://yourdomain.com/api/health
```

### 3. Monitoring Setup
- Setup error tracking (Sentry)
- Setup uptime monitoring (UptimeRobot)
- Setup log aggregation (LogDNA, Datadog)

### 4. Backup Strategy
- Daily database backups
- Store in secure location (AWS S3, etc.)
- Test restore procedures monthly

### 5. Security Hardening
- Enable HTTPS/TLS (Let's Encrypt)
- Setup WAF (CloudFlare, AWS WAF)
- Enable rate limiting
- Setup DDoS protection
- Regular security updates

---

## Environment Variables (Production)

```env
# Application
NODE_ENV=production
PORT=4000
API_URL=https://api.yourdomain.com

# Database (switch to PostgreSQL)
DATABASE_URL=postgresql://username:password@host:5432/movierating

# Authentication
JWT_SECRET=your-very-secret-key-minimum-32-characters-long

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional: Analytics
SENTRY_DSN=https://key@sentry.io/project-id
```

---

## Scaling Considerations

### Database
- Switch from SQLite to PostgreSQL
- Add read replicas for scaling reads
- Add database indexes for performance
- Implement connection pooling

### Backend
- Use load balancer (nginx, HAProxy)
- Deploy multiple server instances
- Setup health checks
- Implement caching (Redis)

### Frontend
- Use CDN (CloudFlare, Cloudfront)
- Enable gzip compression
- Setup HTTP/2 push
- Cache busting with versioned assets

---

## Monitoring & Logging

### Application Logs
```bash
# Check service logs
sudo journalctl -u movie-rating -f

# Docker logs
docker-compose logs -f server
```

### Key Metrics to Monitor
- API response times
- Error rates
- Database query times
- Active connections
- Server CPU/Memory usage

### Alert Thresholds
- 5xx errors > 1% of requests
- API response time > 2 seconds (p99)
- Database connection pool > 80%
- Server uptime < 99.5%

---

## Maintenance

### Regular Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update
npm --prefix server update
npm --prefix client update
```

### Database Maintenance
```bash
# Create backup
pg_dump movierating > backup.sql

# Analyze and vacuum
psql movierating -c "ANALYZE; VACUUM;"
```

### Security Patches
- Update Node.js regularly
- Apply OS security updates
- Review and update dependencies
- Rotate JWT secret periodically

---

## Rollback Procedures

### If deployment fails
1. Keep previous version running
2. Revert database migrations
3. Restore from backup if needed
4. Investigate logs for issues

### Rolling deployment
1. Deploy to staging first
2. Run full test suite
3. Gradually roll out to production
4. Monitor error rates closely

---

## Performance Optimization

### Frontend
- Lazy load routes
- Code splitting
- Image optimization
- Minification and compression

### Backend
- Add database indexes
- Implement caching
- Optimize database queries
- Add request/response compression

### Infrastructure
- Use CDN for assets
- Setup caching headers
- Enable HTTP/2
- Use regional load balancing

---

## Disaster Recovery

### Backup Strategy
- Daily automated backups
- Store in multiple locations
- Test restore monthly
- Keep 30-day history

### RTO/RPO Targets
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 1 hour

### Incident Response
1. Assess severity
2. Notify team
3. Implement hotfix or rollback
4. Post-incident review

---

For questions or issues, please refer to the main README.md or open an issue on GitHub.
