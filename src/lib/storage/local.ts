import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { StorageProvider, StorageResult } from './types.js';

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor(uploadDir: string = 'uploads') {
    this.uploadDir = uploadDir;
  }

  async ensureUploadDir(): Promise<void> {
    if (!existsSync(this.uploadDir)) {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: File, fileName: string): Promise<StorageResult> {
    try {
      await this.ensureUploadDir();
      
      const filePath = path.join(this.uploadDir, fileName);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      await writeFile(filePath, buffer);
      
      return {
        filePath,
        success: true
      };
    } catch (error) {
      return {
        filePath: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async downloadFile(filePath: string): Promise<Buffer> {
    return await readFile(filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    await unlink(filePath);
  }

  async getFileUrl(filePath: string): Promise<string> {
    // For local storage, return a relative path that can be served by the app
    return `/api/files/download/${path.basename(filePath)}`;
  }
}
