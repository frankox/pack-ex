import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';
import { StorageFactory, type StorageProviderType } from '$lib/storage/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const STORAGE_PROVIDER = (process.env.STORAGE_PROVIDER as StorageProviderType) || 'LOCAL';
const storageProvider = StorageFactory.createProvider(STORAGE_PROVIDER, process.env as Record<string, string>);

export const DELETE = async ({ params }: RequestEvent) => {
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
		
		// Delete file using storage provider
		try {
			await storageProvider.deleteFile(file.filePath);
		} catch (err) {
			console.warn('Warning: Could not delete file from storage:', err);
			// Continue with database deletion even if file deletion fails
		}
		
		// Delete from database
		await prisma.uploadedFile.delete({
			where: { id }
		});
		
		return json({ success: true });
	} catch (err) {
		console.error('Error deleting file:', err);
		throw error(500, 'Failed to delete file');
	}
};
