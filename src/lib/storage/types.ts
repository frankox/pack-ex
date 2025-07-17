// Storage interface for different providers
export interface StorageProvider {
  uploadFile(file: File, fileName: string): Promise<StorageResult>;
  downloadFile(filePath: string): Promise<Buffer>;
  deleteFile(filePath: string): Promise<void>;
  getFileUrl(filePath: string): Promise<string>;
}

export interface StorageResult {
  filePath: string;
  url?: string;
  success: boolean;
  error?: string;
}

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  filePath: string;
}
