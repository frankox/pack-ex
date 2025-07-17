#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function configureStorage() {
  console.log('🚀 PackEx Storage Configuration Tool\n');
  
  const provider = await question('Choose storage provider (1: Local, 2: AWS S3, 3: Google Drive): ');
  
  let envContent = '';
  
  switch (provider) {
    case '1':
      console.log('\n📁 Configuring Local Storage...');
      const uploadDir = await question('Upload directory (default: uploads): ') || 'uploads';
      const maxSize = await question('Max file size in bytes (default: 10485760): ') || '10485760';
      
      envContent = `# Storage Configuration
STORAGE_PROVIDER=LOCAL
UPLOAD_DIR=${uploadDir}
MAX_FILE_SIZE=${maxSize}

# Database
DATABASE_URL="postgresql://packex_user:packex_password@localhost:5432/packex_db?schema=public"
`;
      break;
      
    case '2':
      console.log('\n☁️  Configuring AWS S3...');
      const region = await question('AWS Region (default: us-east-1): ') || 'us-east-1';
      const bucket = await question('S3 Bucket name: ');
      const accessKey = await question('AWS Access Key ID: ');
      const secretKey = await question('AWS Secret Access Key: ');
      const maxSizeS3 = await question('Max file size in bytes (default: 10485760): ') || '10485760';
      
      envContent = `# Storage Configuration
STORAGE_PROVIDER=AWS_S3
AWS_REGION=${region}
AWS_S3_BUCKET=${bucket}
AWS_ACCESS_KEY_ID=${accessKey}
AWS_SECRET_ACCESS_KEY=${secretKey}
MAX_FILE_SIZE=${maxSizeS3}

# Database
DATABASE_URL="postgresql://packex_user:packex_password@localhost:5432/packex_db?schema=public"
`;
      break;
      
    case '3':
      console.log('\n🔗 Configuring Google Drive...');
      const clientId = await question('Google Drive Client ID: ');
      const clientSecret = await question('Google Drive Client Secret: ');
      const redirectUri = await question('Redirect URI (default: http://localhost:3000/auth/google/callback): ') || 'http://localhost:3000/auth/google/callback';
      const refreshToken = await question('Refresh Token: ');
      const folderId = await question('Google Drive Folder ID (optional): ');
      const maxSizeGD = await question('Max file size in bytes (default: 10485760): ') || '10485760';
      
      envContent = `# Storage Configuration
STORAGE_PROVIDER=GOOGLE_DRIVE
GOOGLE_DRIVE_CLIENT_ID=${clientId}
GOOGLE_DRIVE_CLIENT_SECRET=${clientSecret}
GOOGLE_DRIVE_REDIRECT_URI=${redirectUri}
GOOGLE_DRIVE_REFRESH_TOKEN=${refreshToken}
${folderId ? `GOOGLE_DRIVE_FOLDER_ID=${folderId}` : '# GOOGLE_DRIVE_FOLDER_ID=your-folder-id'}
MAX_FILE_SIZE=${maxSizeGD}

# Database
DATABASE_URL="postgresql://packex_user:packex_password@localhost:5432/packex_db?schema=public"
`;
      break;
      
    default:
      console.log('❌ Invalid option selected');
      rl.close();
      return;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ Configuration saved to ${envPath}`);
  console.log('🔄 Please restart your application to apply the changes');
  
  rl.close();
}

configureStorage().catch(console.error);
