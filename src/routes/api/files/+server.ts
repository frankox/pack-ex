import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ url }: RequestEvent) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
		
		const validatedPage = Math.max(1, page);
		const validatedPageSize = Math.min(Math.max(1, pageSize), 100);
		
		const skip = (validatedPage - 1) * validatedPageSize;
		
		const totalCount = await prisma.uploadedFile.count();
		
		const files = await prisma.uploadedFile.findMany({
			skip,
			take: validatedPageSize,
			orderBy: {
				createdAt: 'desc'
			}
		});
		
		const totalPages = Math.ceil(totalCount / validatedPageSize);
		const hasNextPage = validatedPage < totalPages;
		const hasPreviousPage = validatedPage > 1;
		
		return json({
			files,
			pagination: {
				currentPage: validatedPage,
				pageSize: validatedPageSize,
				totalCount,
				totalPages,
				hasNextPage,
				hasPreviousPage
			}
		});
	} catch (error) {
		console.error('Error fetching files:', error);
		return json({ error: 'Failed to fetch files' }, { status: 500 });
	}
};

export const POST = async ({ request }: RequestEvent) => {
	try {
		const data = await request.json();
		
		const { title, description, category, language, provider, roles, fileName, filePath, fileSize, mimeType } = data;
		
		if (!title || !description || !category || !language || !provider || !roles || !fileName || !filePath || !fileSize || !mimeType) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}
		
		if (roles.length === 0) {
			return json({ error: 'At least one role must be selected' }, { status: 400 });
		}
		
		const uploadedFile = await prisma.uploadedFile.create({
			data: {
				title: title.trim(),
				description: description.trim(),
				category: category as any,
				language: language as any,
				provider: provider as any,
				roles: roles as any,
				fileName,
				filePath,
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
