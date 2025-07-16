import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import type { RequestEvent } from '@sveltejs/kit';

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
		
		// Delete file from disk
		if (existsSync(file.filePath)) {
			await unlink(file.filePath);
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
