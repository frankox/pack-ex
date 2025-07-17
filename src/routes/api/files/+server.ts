import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async () => {
	try {
		const files = await prisma.uploadedFile.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		});
		
		return json(files);
	} catch (error) {
		console.error('Error fetching files:', error);
		return json({ error: 'Failed to fetch files' }, { status: 500 });
	}
};

export const POST = async ({ request }: RequestEvent) => {
	try {
		const data = await request.json();
		
		// Validate required fields
		const { title, description, category, language, provider, roles, fileName, filePath, fileSize, mimeType } = data;
		
		if (!title || !description || !category || !language || !provider || !roles || !fileName || !filePath || !fileSize || !mimeType) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}
		
		if (roles.length === 0) {
			return json({ error: 'At least one role must be selected' }, { status: 400 });
		}
		
		// Save to database
		const uploadedFile = await prisma.uploadedFile.create({
			data: {
				title: title.trim(),
				description: description.trim(),
				category: category as any,
				language: language as any,
				provider: provider as any,
				roles: roles as any,
				fileName,
				filePath, // This will be the UploadThing URL
				fileSize,
				mimeType
			}
		});
		
		return json(uploadedFile);
	} catch (error) {
		console.error('Database error:', error);
		return json({ error: 'Failed to save file metadata' }, { status: 500 });
	}
};
