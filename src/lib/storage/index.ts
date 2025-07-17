import type { StorageProvider } from './types.js';
import { LocalStorageProvider } from './local.js';
import { AWSS3StorageProvider } from './aws-s3.js';
import { GoogleDriveStorageProvider } from './google-drive.js';

export type StorageProviderType = 'LOCAL' | 'AWS_S3' | 'GOOGLE_DRIVE';

export class StorageFactory {
  static createProvider(
    providerType: StorageProviderType = 'LOCAL',
    config: Record<string, string> = {}
  ): StorageProvider {
    switch (providerType) {
      case 'LOCAL':
        return new LocalStorageProvider(config.UPLOAD_DIR || 'uploads');
      
      case 'AWS_S3':
        if (!config.AWS_REGION || !config.AWS_ACCESS_KEY_ID || !config.AWS_SECRET_ACCESS_KEY || !config.AWS_S3_BUCKET) {
          throw new Error('Missing required AWS S3 configuration');
        }
        return new AWSS3StorageProvider(
          config.AWS_REGION,
          config.AWS_ACCESS_KEY_ID,
          config.AWS_SECRET_ACCESS_KEY,
          config.AWS_S3_BUCKET
        );
      
      case 'GOOGLE_DRIVE':
        if (!config.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY) {
          throw new Error('Missing required Google Drive service account key configuration');
        }
        return new GoogleDriveStorageProvider(
          config.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY,
          config.GOOGLE_DRIVE_FOLDER_ID
        );
      
      default:
        throw new Error(`Unsupported storage provider: ${providerType}`);
    }
  }
}

// Export all types and providers
export * from './types.js';
export * from './local.js';
export * from './aws-s3.js';
export * from './google-drive.js';
