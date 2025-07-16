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
