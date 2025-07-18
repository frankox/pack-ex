import { browser } from '$app/environment';

export interface UploadResult {
  url: string;
  key: string;
  name: string;
  size: number;
}

// Local file upload function
export async function uploadLocalFile(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload/local', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  const result = await response.json();
  return result.file;
}

// Check storage provider from server
export async function getStorageProvider(): Promise<string> {
  const response = await fetch('/api/config/storage');
  if (!response.ok) {
    return 'local'; // fallback
  }
  const data = await response.json();
  return data.provider || 'local';
}
