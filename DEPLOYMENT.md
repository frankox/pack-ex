# PackEx Deployment Guide

This guide will help you deploy your PackEx application with Neon PostgreSQL and Google Drive storage using service account authentication.

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
   - Create a Service Account (IAM & Admin > Service Accounts)
   - Generate and download a JSON key file for the service account
   - Share your target Google Drive folder with the service account email address

## Environment Variables

When deploying, ensure these environment variables are set:

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_o4eBfnasCY7u@ep-bitter-cloud-ab0tp6dh-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Storage Configuration
STORAGE_PROVIDER=GOOGLE_DRIVE

# Google Drive Service Account (paste the entire JSON key file content)
GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project",...}'

# Google Drive Folder ID (optional - if not provided, files will be stored in root)
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id

# Application Settings
MAX_FILE_SIZE=10485760
NODE_ENV=production
SESSION_SECRET=your-strong-random-secret-key
```

## Setting up Google Drive Service Account

1. **Create Service Account**:
   - Go to Google Cloud Console → IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Give it a name like "packex-drive-service"
   - Skip role assignment (not needed)
   - Click "Done"

2. **Generate Key**:
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Download the JSON file

3. **Share Drive Folder**:
   - Create a folder in Google Drive for your files
   - Right-click the folder → "Share"
   - Add the service account email (found in the JSON file as `client_email`)
   - Give it "Editor" permissions
   - Copy the folder ID from the URL (the long string after `/folders/`)

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
   - Make sure to paste the entire JSON service account key as the `GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY` value
   - Use the exact variable names

3. **Build Settings** (for most platforms):
   - Build Command: `npm run build`
   - Output Directory: `build` (SvelteKit will auto-detect)
   - Install Command: `npm install`

4. **Deploy**: Your platform will automatically deploy your application

## Important Notes

- **Authentication**: Using Service Account authentication (simpler and more secure for server-side apps)
- **Adapter**: Using `@sveltejs/adapter-auto` which automatically detects the deployment platform
- **Database**: Neon database is already configured and ready to use
- **File Storage**: Files will be stored in Google Drive using service account permissions
- **Permissions**: The service account must have access to the target Google Drive folder

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
   - Ensure the service account JSON key is properly formatted
   - Verify the service account has access to the target folder
   - Check that the Google Drive API is enabled in your project
   - Ensure the folder ID is correct

3. **Build Failures**
   - Check build logs for specific errors
   - Ensure all dependencies are listed in package.json
   - Verify Prisma schema matches the database

4. **File Upload Issues**
   - Check Google Drive API quotas and limits
   - Verify service account permissions on the folder
   - Check file size limits (currently set to 10MB)
   - Ensure the service account JSON is valid and properly escaped in environment variables

## Service Account vs OAuth2

**Why Service Account is better for your use case:**
- ✅ No user interaction required
- ✅ More secure for server-side applications
- ✅ No token refresh needed
- ✅ Simpler to configure and deploy
- ✅ Better for automated processes

The service account will have its own Google Drive space, or you can share specific folders with it.

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| DATABASE_URL | Neon PostgreSQL connection string | Yes | postgresql://... |
| STORAGE_PROVIDER | Storage provider type | Yes | GOOGLE_DRIVE |
| GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY | Service account JSON key | Yes | {"type":"service_account",...} |
| GOOGLE_DRIVE_FOLDER_ID | Target folder ID in Drive | No | 1BxxxxxxxxxxxxxB |
| MAX_FILE_SIZE | Maximum file size in bytes | No | 10485760 |
| SESSION_SECRET | Secret for session encryption | Yes | random-secret-key |
