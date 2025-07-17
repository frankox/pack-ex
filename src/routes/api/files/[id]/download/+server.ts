import { error, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';

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
		
		// With UploadThing, filePath contains the direct URL
		// So we can simply redirect to it
		throw redirect(302, file.filePath);
		
	} catch (err) {
		if (err?.status) {
			// Re-throw SvelteKit errors (like redirect)
			throw err;
		}
		console.error('Error downloading file:', err);
		throw error(500, 'Failed to download file');
	}
};
