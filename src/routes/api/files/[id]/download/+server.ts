import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
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
		
		if (!existsSync(file.filePath)) {
			throw error(404, 'File not found on disk');
		}
		
		const fileBuffer = await readFile(file.filePath);
		
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
