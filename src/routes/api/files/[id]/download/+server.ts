import { error } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';
import { StorageFactory, type StorageProviderType } from '$lib/storage/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const STORAGE_PROVIDER = (process.env.STORAGE_PROVIDER as StorageProviderType) || 'LOCAL';
const storageProvider = StorageFactory.createProvider(STORAGE_PROVIDER, process.env as Record<string, string>);

export const GET = async ({ params }: RequestEvent) => {
	try {
		const { id } = params;
		
		if (!id) {
			throw error(400, 'File ID required');
		}
		
		const file = await prisma.uploadedFile.findUnique({
			where: { id }
		});
		
		if (!file) {
			throw error(404, 'File not found');
		}
		
		// Download file using storage provider
		const fileBuffer = await storageProvider.downloadFile(file.filePath);
		
		return new Response(fileBuffer, {
			headers: {
				'Content-Type': file.mimeType,
				'Content-Disposition': `attachment; filename="${file.fileName}"`,
				'Content-Length': file.fileSize.toString()
			}
		});
	} catch (err) {
		console.error('Error downloading file:', err);
		throw error(500, 'Failed to download file');
	}
};
