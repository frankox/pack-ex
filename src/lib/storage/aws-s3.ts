import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { StorageProvider, StorageResult } from './types.js';

export class AWSS3StorageProvider implements StorageProvider {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string
  ) {
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
    this.bucketName = bucketName;
  }

  async uploadFile(file: File, fileName: string): Promise<StorageResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream'
      });

      await this.s3Client.send(command);

      return {
        filePath: fileName,
        success: true,
        url: `https://${this.bucketName}.s3.amazonaws.com/${fileName}`
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
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: filePath
      });

      const response = await this.s3Client.send(command);
      
      if (!response.Body) {
        throw new Error('No file body returned');
      }

      // Convert ReadableStream to Buffer
      const chunks: Uint8Array[] = [];
      const reader = response.Body.transformToWebStream().getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: filePath
    });

    await this.s3Client.send(command);
  }

  async getFileUrl(filePath: string): Promise<string> {
    // Generate a presigned URL valid for 1 hour
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}
