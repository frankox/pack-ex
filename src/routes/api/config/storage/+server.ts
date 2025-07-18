import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({}: RequestEvent) => {
  const storageProvider = env.STORAGE_PROVIDER || 'local';
  
  return json({
    provider: storageProvider.toLowerCase(),
    isLocal: storageProvider.toLowerCase() === 'local'
  });
};
