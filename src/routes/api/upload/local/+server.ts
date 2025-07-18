import { json, error } from '@sveltejs/kit';
import { getStorageProvider, isLocalStorage } from '$lib/server/storage';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async ({ request }: RequestEvent) => {
  // Only handle local uploads - UploadThing uploads are handled by their own endpoint
  if (!isLocalStorage()) {
    throw error(400, 'Local upload endpoint called but storage provider is not local');
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw error(400, 'No file provided');
    }

    // Validate file size (64MB max for local storage)
    const maxSize = 64 * 1024 * 1024; // 64MB
    if (file.size > maxSize) {
      throw error(400, 'File too large. Maximum size is 64MB.');
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/zip',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'text/plain',
      'text/csv'
    ];

    const isImageType = file.type.startsWith('image/');
    const isVideoType = file.type.startsWith('video/');
    const isAudioType = file.type.startsWith('audio/');
    
    if (!allowedTypes.includes(file.type) && !isImageType && !isVideoType && !isAudioType) {
      throw error(400, 'File type not allowed');
    }

    const storageProvider = getStorageProvider();
    const result = await storageProvider.uploadFile(file);

    return json({
      success: true,
      file: result
    });

  } catch (err) {
    console.error('Local upload error:', err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, 'Upload failed');
  }
};
