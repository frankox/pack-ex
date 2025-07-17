# Google Drive Service Account Setup Guide

This guide walks you through setting up a Google Drive service account for PackEx file storage.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "PackEx File Storage")
5. Click "Create"

## Step 2: Enable Google Drive API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Drive API"
3. Click on "Google Drive API"
4. Click "Enable"

## Step 3: Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Enter details:
   - **Service account name**: `packex-drive-service`
   - **Description**: `Service account for PackEx file storage`
4. Click "Create and Continue"
5. Skip the role assignment (click "Continue")
6. Click "Done"

## Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Click "Create"
6. The JSON file will be downloaded to your computer
7. **Keep this file secure** - it contains private credentials

## Step 5: Set Up Google Drive Folder

1. Open [Google Drive](https://drive.google.com)
2. Create a new folder for your PackEx files (e.g., "PackEx Files")
3. Right-click the folder and select "Share"
4. Add the service account email address:
   - Open the downloaded JSON file
   - Copy the `client_email` value (looks like `packex-drive-service@your-project.iam.gserviceaccount.com`)
   - Paste it in the "Add people and groups" field
5. Set permission to "Editor"
6. Click "Send"
7. Copy the folder ID from the URL:
   - The URL looks like: `https://drive.google.com/drive/folders/1BxxxxxxxxxxxxxB`
   - The folder ID is the long string after `/folders/`: `1BxxxxxxxxxxxxxB`

## Step 6: Configure Environment Variables

1. Open the JSON key file you downloaded
2. Copy the entire content (it should start with `{"type":"service_account",...}`)
3. Set your environment variables:

```bash
# The entire JSON content as a string
GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"packex-drive-service@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'

# The folder ID you copied
GOOGLE_DRIVE_FOLDER_ID=1BxxxxxxxxxxxxxB

# Set storage provider
STORAGE_PROVIDER=GOOGLE_DRIVE
```

## Important Security Notes

- **Never commit the JSON key file to version control**
- **Store the JSON content as an environment variable only**
- **Keep the JSON file in a secure location**
- **Regularly rotate service account keys for security**

## Testing the Setup

You can test if the setup works by:

1. Setting the environment variables in your `.env.local` file
2. Running your development server: `npm run dev`
3. Trying to upload a file through your application
4. Checking if the file appears in your Google Drive folder

## Troubleshooting

### Common Issues:

1. **"Access denied" errors**
   - Make sure you shared the folder with the service account email
   - Check that the service account has "Editor" permissions

2. **"Invalid credentials" errors**
   - Verify the JSON key is properly formatted
   - Make sure you copied the entire JSON content
   - Check for any escape character issues

3. **"Folder not found" errors**
   - Verify the folder ID is correct
   - Make sure the folder is shared with the service account

4. **API quota exceeded**
   - Check your Google Cloud Console for API usage
   - Consider implementing rate limiting in your application

## Folder Permissions

The service account will be able to:
- ✅ Upload files to the shared folder
- ✅ Read files from the shared folder
- ✅ Delete files from the shared folder
- ✅ Create subfolders (if needed)

The service account will NOT be able to:
- ❌ Access other folders in your Drive
- ❌ Access your personal files
- ❌ Share folders with other users
