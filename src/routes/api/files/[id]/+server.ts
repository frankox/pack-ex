import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';
import { getStorageProvider, extractFileKey } from '$lib/server/storage';

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
		
		// Extract file key from URL
		const fileKey = extractFileKey(file.filePath);
		
		// Delete file from storage provider
		try {
			const storageProvider = getStorageProvider();
			await storageProvider.deleteFile(fileKey);
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
