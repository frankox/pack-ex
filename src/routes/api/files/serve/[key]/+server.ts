import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createReadStream, existsSync, statSync } from 'fs';
import { join } from 'path';
import { lookup } from 'mime-types';
import { Readable } from 'stream';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ params }: RequestEvent) => {
  const { key } = params;
  
  if (!key) {
    throw error(400, 'File key is required');
  }

  const uploadsDir = env.UPLOADS_DIR || './uploads';
  const filePath = join(uploadsDir, key);

  // Security check: ensure the file path is within the uploads directory
  if (!filePath.startsWith(uploadsDir)) {
    throw error(403, 'Access denied');
  }

  if (!existsSync(filePath)) {
    throw error(404, 'File not found');
  }

  try {
    const stats = statSync(filePath);
    const mimeType = lookup(filePath) || 'application/octet-stream';
    
    // Create a readable stream and convert to web stream
    const nodeStream = createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream);
    
    return new Response(webStream, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': stats.size.toString(),
        'Content-Disposition': `inline; filename="${key}"`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (err) {
    console.error('Error serving file:', err);
    throw error(500, 'Failed to serve file');
  }
};
