# PackEx Deployment Guide

This guide will help you deploy your PackEx application with flexible storage options and database configurations.

## Storage Options

PackEx supports two storage providers:

### 1. Local Storage (Recommended for Docker)
- Files stored on your server's filesystem
- No external dependencies or API keys required
- Perfect for self-hosted deployments
- Uses Docker volumes for persistence

### 2. UploadThing (Cloud CDN)
- Global CDN delivery for fast downloads
- Requires UploadThing account and API token
- Automatic file optimization and processing

## Quick Docker Deployment (Local Storage)

The simplest way to deploy PackEx:

```bash
# 1. Clone and navigate to project
git clone <your-repo>
cd pack-ex

# 2. Copy local environment template
cp .env.local.example .env

# 3. Start everything with Docker
docker-compose up -d

# 4. Access your application
# App: http://localhost:3000
# Database: localhost:5432
```

## Database Configuration Options

### Option 1: Docker PostgreSQL (Included)
Already configured in `docker-compose.yml`:
```
postgresql://packex_user:packex_password@db:5432/packex_db?schema=public
```

### Option 2: Neon PostgreSQL (Cloud)
Your application can also use Neon PostgreSQL with the connection string:
```
postgresql://neondb_owner:npg_o4eBfnasCY7u@ep-bitter-cloud-ab0tp6dh-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Environment Variables

PackEx supports flexible environment configuration for different deployment scenarios:

### Local Storage Configuration (Docker)

```bash
# Storage Configuration
STORAGE_PROVIDER=local
UPLOADS_DIR=/app/uploads
PUBLIC_URL=http://localhost:3000  # Change to your domain in production

# Database
DATABASE_URL="postgresql://packex_user:packex_password@db:5432/packex_db?schema=public"

# Security
SESSION_SECRET=your-strong-production-secret
NODE_ENV=production
```

### UploadThing Configuration (Cloud)

```bash
# Storage Configuration
STORAGE_PROVIDER=uploadthing
UPLOADTHING_TOKEN='eyJhcGlLZXkiOiJza19saXZlX2E2OTFjYjQ4ODQ1ZmYzYjcxMmQ2YmIyMzFiYjk4MjczM2E5MjFjMjAzMGNkNjEwNGQ1MTc1Y2YzNmI0ZmI4MmEiLCJhcHBJZCI6Im4zejcwZW8zZjUiLCJyZWdpb25zIjpbInNlYTEiXX0='

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_o4eBfnasCY7u@ep-bitter-cloud-ab0tp6dh-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Application Settings
NODE_ENV=production
CORS_ORIGIN=https://your-app-domain.vercel.app
```

### For Vercel and Platforms with Special Character Issues

```bash
# Database (Base64 encoded for better compatibility)
DATABASE_URL_BASE64=cG9zdGdyZXNxbDovL25lb25kYl9vd25lcjpucGdfbzRlQmZuYXNDWT==

# UploadThing Configuration
STORAGE_PROVIDER=uploadthing
UPLOADTHING_TOKEN='eyJhcGlLZXkiOiJza19saXZlX2E2OTFjYjQ4ODQ1ZmYzYjcxMmQ2YmIyMzFiYjk4MjczM2E5MjFjMjAzMGNkNjEwNGQ1MTc1Y2YzNmI0ZmI4MmEiLCJhcHBJZCI6Im4zejcwZW8zZjUiLCJyZWdpb25zIjpbInNlYTEiXX0='

# Application Settings
NODE_ENV=production
CORS_ORIGIN=https://your-app-domain.vercel.app
```
```

### Database URL Encoding
Our application supports both plain text and base64 encoded database URLs. For platforms like Vercel that have issues with special characters in environment variables, use the base64 encoded version (`DATABASE_URL_BASE64`).

To encode a new database URL:
```bash
node scripts/db-url-encoder.js encode "your-database-url-here"
```

To decode a base64 URL:
```bash
node scripts/db-url-encoder.js decode "base64-string-here"
```

## UploadThing Benefits

- **No Setup Required**: Your UploadThing app is already configured
- **Global CDN**: Files are delivered via fast global CDN
- **Automatic Scaling**: Handles any file volume without infrastructure
- **Built-in Security**: Secure file uploads and access controls
- **No Storage Costs**: UploadThing handles all file storage and delivery

## Pre-deployment Steps

1. **Database Migration**: Run migrations on your production database:
```bash
npx prisma migrate deploy
```

2. **Build the Application**:
```bash
npm run build
```

## Deployment via Any Platform

1. **Connect Repository**: 
   - Go to your deployment platform (Vercel, Netlify, etc.) and sign in
   - Click "New Project" and import your GitHub repository

2. **Configure Environment Variables**:
   - In your deployment platform settings, add all the environment variables listed above
   - Make sure to use the exact variable names and values
   - The UploadThing token is already provided and configured

3. **Build Settings** (for most platforms):
   - Build Command: `npm run build`
   - Output Directory: `build` (SvelteKit will auto-detect)
   - Install Command: `npm install`

4. **Deploy**: Your platform will automatically deploy your application

## Important Notes

- **File Storage**: UploadThing handles all file storage and CDN delivery
- **Adapter**: Using `@sveltejs/adapter-auto` which automatically detects the deployment platform
- **Database**: Neon database is already configured and ready to use
- **No Additional Setup**: UploadThing is pre-configured with your API token

## Post-deployment Verification

1. Check that your deployment completed successfully
2. Test file upload functionality  
3. Verify files are accessible via UploadThing CDN
4. Check database connection and data persistence

## Troubleshooting

### Common Issues:

1. **Database Connection Issues**
   - Verify the DATABASE_URL is correctly set
   - Check that Neon database allows connections

2. **UploadThing Issues**
   - Ensure the UPLOADTHING_TOKEN is correctly set
   - Check UploadThing dashboard for upload logs
   - Verify file size limits are within UploadThing constraints

3. **Build Failures**
   - Check build logs for specific errors
   - Ensure all dependencies are listed in package.json
   - Verify Prisma schema matches the database

4. **File Upload Issues**
   - Check UploadThing dashboard for error logs
   - Verify file types are supported by your configuration
   - Ensure network connectivity to UploadThing servers

## UploadThing vs Traditional Storage

**Why UploadThing is better:**
- ✅ No infrastructure setup required
- ✅ Global CDN for fast file delivery
- ✅ Automatic scaling and optimization
- ✅ Built-in security and access controls
- ✅ No storage or bandwidth costs
- ✅ Simple integration with one API token
- ✅ Automatic file processing and optimization

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| DATABASE_URL | Neon PostgreSQL connection string (plain text) | No* | postgresql://user:pass@host:5432/db |
| DATABASE_URL_BASE64 | Base64 encoded database URL (recommended for Vercel) | No* | cG9zdGdyZXNxbDov... |
| UPLOADTHING_TOKEN | UploadThing API token | Yes | eyJhcGlLZXk... |
| NODE_ENV | Environment mode | No | production |
| CORS_ORIGIN | Allowed CORS origin | No | https://yourdomain.com |
| LOG_LEVEL | Logging level | No | info |
| RATE_LIMIT_WINDOW_MS | Rate limiting window in ms | No | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | No | 100 |

*Either DATABASE_URL or DATABASE_URL_BASE64 is required. The application will automatically use the base64 encoded version if available, otherwise fall back to the plain text version.

## File Upload Limits

UploadThing provides generous limits:
- **Documents**: PDF, Word, Excel, PowerPoint (up to 16MB)
- **Images**: JPG, PNG, etc. (up to 8MB)
- **Videos**: MP4, MOV, AVI (up to 128MB)  
- **Audio**: Various formats (up to 32MB)
- **Archives**: ZIP files (up to 64MB)
- **Other**: Generic files (up to 64MB)
