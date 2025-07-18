import { env } from "$env/dynamic/private";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join, extname } from "path";
import { createReadStream, existsSync } from "fs";

export interface UploadResult {
  url: string;
  key: string;
  name: string;
  size: number;
}

export interface StorageProvider {
  uploadFile(file: File): Promise<UploadResult>;
  deleteFile(key: string): Promise<void>;
  getFileUrl(key: string): string;
}

class LocalStorageProvider implements StorageProvider {
  private uploadsDir: string;
  private publicUrl: string;

  constructor() {
    this.uploadsDir = env.UPLOADS_DIR || './uploads';
    this.publicUrl = env.PUBLIC_URL || 'http://localhost:3000';
    
    // Ensure uploads directory exists
    this.ensureUploadsDir();
  }

  private async ensureUploadsDir() {
    try {
      if (!existsSync(this.uploadsDir)) {
        await mkdir(this.uploadsDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create uploads directory:', error);
    }
  }

  async uploadFile(file: File): Promise<UploadResult> {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = extname(file.name);
    const key = `${timestamp}-${randomSuffix}${extension}`;
    const filePath = join(this.uploadsDir, key);

    try {
      const buffer = await file.arrayBuffer();
      await writeFile(filePath, new Uint8Array(buffer));

      return {
        url: this.getFileUrl(key),
        key,
        name: file.name,
        size: file.size
      };
    } catch (error) {
      console.error('Failed to save file locally:', error);
      throw new Error('Failed to upload file');
    }
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = join(this.uploadsDir, key);
    try {
      await unlink(filePath);
    } catch (error) {
      console.error('Failed to delete local file:', error);
      // Don't throw error for file deletion failures
    }
  }

  getFileUrl(key: string): string {
    return `${this.publicUrl}/api/files/serve/${key}`;
  }
}

class UploadThingProvider implements StorageProvider {
  async uploadFile(file: File): Promise<UploadResult> {
    throw new Error('UploadThing upload should be handled by the client-side component');
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const deleteResponse = await fetch(`https://api.uploadthing.com/api/deleteFile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Uploadthing-Api-Key': env.UPLOADTHING_TOKEN || '',
        },
        body: JSON.stringify({ fileKey: key }),
      });

      if (!deleteResponse.ok) {
        console.warn('Warning: Could not delete file from UploadThing:', await deleteResponse.text());
      }
    } catch (err) {
      console.warn('Warning: Could not delete file from UploadThing:', err);
    }
  }

  getFileUrl(key: string): string {
    return `https://utfs.io/f/${key}`;
  }
}

// Factory function to get the appropriate storage provider
export function getStorageProvider(): StorageProvider {
  const storageProvider = env.STORAGE_PROVIDER || 'local';
  
  switch (storageProvider.toLowerCase()) {
    case 'uploadthing':
      return new UploadThingProvider();
    case 'local':
    default:
      return new LocalStorageProvider();
  }
}

// Helper function to check if we're using local storage
export function isLocalStorage(): boolean {
  const storageProvider = env.STORAGE_PROVIDER || 'local';
  return storageProvider.toLowerCase() === 'local';
}

// Helper function to extract file key from URL
export function extractFileKey(filePath: string): string {
  if (filePath.includes('utfs.io')) {
    // UploadThing URL format: https://utfs.io/f/{fileKey}
    return filePath.split('/').pop() || '';
  } else {
    // Local storage URL format: http://localhost:3000/api/files/serve/{fileKey}
    return filePath.split('/').pop() || '';
  }
}
