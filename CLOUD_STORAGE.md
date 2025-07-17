# Cloud Storage Configuration Guide

PackEx supports multiple storage providers for file uploads. You can choose between local storage (Docker), AWS S3, or Google Drive by configuring environment variables.

## Storage Provider Options

### 1. Local Storage (Default - Docker)
This is the default option and stores files in the local filesystem.

```env
STORAGE_PROVIDER=LOCAL
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### 2. AWS S3 (Free Tier Available)
AWS offers a free tier with 5GB of storage, 20,000 GET requests, and 2,000 PUT requests per month.

```env
STORAGE_PROVIDER=AWS_S3
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
MAX_FILE_SIZE=10485760
```

#### Setup Steps for AWS S3:
1. Create an AWS account (free tier available)
2. Create an S3 bucket in your preferred region
3. Create an IAM user with S3 permissions
4. Generate access keys for the IAM user
5. Update your `.env` file with the credentials

### 3. Google Drive
Use your personal Google Drive storage.

```env
STORAGE_PROVIDER=GOOGLE_DRIVE
GOOGLE_DRIVE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-client-secret
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GOOGLE_DRIVE_REFRESH_TOKEN=your-refresh-token
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
MAX_FILE_SIZE=10485760
```

#### Setup Steps for Google Drive:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API
4. Create credentials (OAuth 2.0 Client ID)
5. Add authorized redirect URIs
6. Get refresh token using OAuth 2.0 Playground
7. Optionally create a specific folder in Google Drive and get its ID

## Configuration Files

### Development (.env)
```env
# Choose your storage provider
STORAGE_PROVIDER=LOCAL

# Local development with Docker
DATABASE_URL="postgresql://packex_user:packex_password@localhost:5432/packex_db?schema=public"
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### Production with Docker (docker-compose.yml)
The Docker configuration supports all storage providers. Simply uncomment and configure the environment variables for your chosen provider.

### Switching Between Providers
1. Update the `STORAGE_PROVIDER` environment variable
2. Configure the required credentials for your chosen provider
3. Restart the application
4. For Docker: run `docker-compose down && docker-compose up -d`

## Storage Provider Comparison

| Feature | Local Storage | AWS S3 | Google Drive |
|---------|---------------|---------|--------------|
| Cost | Free (local disk) | Free tier: 5GB | Free: 15GB |
| Setup Complexity | Low | Medium | High |
| Scalability | Limited | High | Medium |
| Backup | Manual | Automatic | Automatic |
| Access Speed | Fast | Fast | Medium |
| Docker Compatible | Yes | Yes | Yes |

## Security Notes

- Never commit credentials to version control
- Use environment variables for all sensitive configuration
- For production, consider using AWS IAM roles or Google Service Accounts
- Regularly rotate access keys and tokens
- Use principle of least privilege for permissions

## Troubleshooting

### Common Issues:
1. **Storage Provider Not Recognized**: Check that `STORAGE_PROVIDER` is set to one of: `LOCAL`, `AWS_S3`, `GOOGLE_DRIVE`
2. **AWS Credentials Invalid**: Verify your access keys and bucket permissions
3. **Google Drive API Errors**: Check that the Drive API is enabled and your refresh token is valid
4. **File Upload Fails**: Check file size limits and storage provider quotas

### Debug Mode:
Set `NODE_ENV=development` to see detailed error messages in the console.
