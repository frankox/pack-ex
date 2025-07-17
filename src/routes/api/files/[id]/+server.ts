import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';
import { env } from "$env/dynamic/private";

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
		
		// Extract file key from UploadThing URL
		// UploadThing URLs follow the format: https://utfs.io/f/{fileKey}
		const urlParts = file.filePath.split('/');
		const fileKey = urlParts[urlParts.length - 1];
		
		// Delete file from UploadThing using their API
		try {
			const deleteResponse = await fetch(`https://api.uploadthing.com/api/deleteFile`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Uploadthing-Api-Key': env.UPLOADTHING_TOKEN,
				},
				body: JSON.stringify({
					fileKeys: [fileKey]
				})
			});
			
			if (!deleteResponse.ok) {
				console.warn('Warning: Could not delete file from UploadThing:', await deleteResponse.text());
				// Continue with database deletion even if file deletion fails
			}
		} catch (err) {
			console.warn('Warning: Could not delete file from UploadThing:', err);
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
