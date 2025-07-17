import { google } from 'googleapis';
import type { StorageProvider, StorageResult } from './types.js';

export class GoogleDriveStorageProvider implements StorageProvider {
  private drive: any;

  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    refreshToken: string,
    private folderId?: string
  ) {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    
    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  }

  async uploadFile(file: File, fileName: string): Promise<StorageResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileMetadata = {
        name: fileName,
        parents: this.folderId ? [this.folderId] : undefined
      };

      const media = {
        mimeType: file.type || 'application/octet-stream',
        body: buffer
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,webViewLink,webContentLink'
      });

      return {
        filePath: response.data.id,
        success: true,
        url: response.data.webContentLink
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
    try {
      const response = await this.drive.files.get({
        fileId: filePath,
        alt: 'media'
      }, { responseType: 'stream' });

      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        response.data.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.data.on('end', () => resolve(Buffer.concat(chunks)));
        response.data.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    await this.drive.files.delete({ fileId: filePath });
  }

  async getFileUrl(filePath: string): Promise<string> {
    try {
      const response = await this.drive.files.get({
        fileId: filePath,
        fields: 'webContentLink'
      });
      
      return response.data.webContentLink || `/api/files/${filePath}/download`;
    } catch (error) {
      // Fallback to API endpoint if direct link fails
      return `/api/files/${filePath}/download`;
    }
  }
}
