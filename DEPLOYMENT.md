# PackEx Deployment Guide

This guide will help you deploy your PackEx application with Neon PostgreSQL and Google Drive storage.

## Database Configuration

Your application is already configured to use Neon PostgreSQL with the connection string:
```
postgresql://neondb_owner:npg_o4eBfnasCY7u@ep-bitter-cloud-ab0tp6dh-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Prerequisites for Google Drive Storage

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google Drive API
   - Create credentials (OAuth 2.0 Client ID)
   - Add your domain to authorized redirect URIs
   - Generate a refresh token using the OAuth playground

## Environment Variables

When deploying, ensure these environment variables are set:

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_o4eBfnasCY7u@ep-bitter-cloud-ab0tp6dh-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Storage Configuration
STORAGE_PROVIDER=GOOGLE_DRIVE

# Google Drive API (get these from Google Cloud Console)
GOOGLE_DRIVE_CLIENT_ID=your-google-drive-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-google-drive-client-secret
GOOGLE_DRIVE_REDIRECT_URI=https://your-domain.com/auth/google/callback
GOOGLE_DRIVE_REFRESH_TOKEN=your-refresh-token
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id

# Application Settings
MAX_FILE_SIZE=10485760
NODE_ENV=production
SESSION_SECRET=your-strong-random-secret-key
```

## Pre-deployment Steps

1. **Database Migration**: Run migrations on your production database:
```bash
npx prisma migrate deploy
```

2. **Build the Application**:
```bash
npm run build
```

## Deployment via Vercel App

1. **Connect Repository**: 
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project" and import your GitHub repository

2. **Configure Environment Variables**:
   - In your Vercel project settings, add all the environment variables listed above
   - Make sure to use the exact variable names

3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `build` (SvelteKit will auto-detect)
   - Install Command: `npm install`

4. **Deploy**: Vercel will automatically deploy your application

## Important Notes

- **Adapter**: Using `@sveltejs/adapter-auto` which automatically detects the deployment platform
- **Database**: Neon database is already configured and ready to use
- **File Storage**: Files will be stored in Google Drive (make sure to configure all Google Drive environment variables)
- **Migrations**: You may need to run `npx prisma migrate deploy` manually after deployment if needed

## Post-deployment Verification

1. Check that your deployment completed successfully
2. Test file upload functionality  
3. Verify files are being stored in Google Drive
4. Check database connection and data persistence

## Troubleshooting

### Common Issues:

1. **Database Connection Issues**
   - Verify the DATABASE_URL is correctly set
   - Check that Neon database allows connections

2. **Google Drive API Issues**
   - Ensure all Google Drive environment variables are set
   - Verify the refresh token is valid
   - Check that the folder ID exists and is accessible

3. **Build Failures**
   - Check build logs for specific errors
   - Ensure all dependencies are listed in package.json
   - Verify Prisma schema matches the database

4. **File Upload Issues**
   - Check Google Drive API quotas and limits
   - Verify proper permissions
   - Check file size limits (currently set to 10MB)

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| DATABASE_URL | Neon PostgreSQL connection string | Yes | postgresql://... |
| STORAGE_PROVIDER | Storage provider type | Yes | GOOGLE_DRIVE |
| GOOGLE_DRIVE_CLIENT_ID | Google OAuth client ID | Yes | xxxxx.apps.googleusercontent.com |
| GOOGLE_DRIVE_CLIENT_SECRET | Google OAuth client secret | Yes | GOCSPX-xxxxx |
| GOOGLE_DRIVE_REDIRECT_URI | OAuth redirect URI | Yes | https://domain.com/auth/callback |
| GOOGLE_DRIVE_REFRESH_TOKEN | OAuth refresh token | Yes | 1//xxxxx |
| GOOGLE_DRIVE_FOLDER_ID | Target folder ID in Drive | No | 1BxxxxxxxxxxxxxB |
| MAX_FILE_SIZE | Maximum file size in bytes | No | 10485760 |
| SESSION_SECRET | Secret for session encryption | Yes | random-secret-key |
