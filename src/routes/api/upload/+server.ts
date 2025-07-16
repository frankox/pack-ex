import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { RequestEvent } from '@sveltejs/kit';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB

async function ensureUploadDir() {
	if (!existsSync(UPLOAD_DIR)) {
		await mkdir(UPLOAD_DIR, { recursive: true });
	}
}

export const POST = async ({ request }: RequestEvent) => {
	try {
		await ensureUploadDir();
		
		const formData = await request.formData();
		const file = formData.get('file') as File;
		
		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}
		
		if (file.size > MAX_FILE_SIZE) {
			return json({ error: 'File too large' }, { status: 400 });
		}
		
		// Get form fields
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const category = formData.get('category') as string;
		const language = formData.get('language') as string;
		const provider = formData.get('provider') as string;
		const rolesString = formData.get('roles') as string;
		
		// Validate required fields
		if (!title || !description || !category || !language || !provider || !rolesString) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}
		
		let roles: string[];
		try {
			roles = JSON.parse(rolesString);
		} catch {
			return json({ error: 'Invalid roles format' }, { status: 400 });
		}
		
		if (roles.length === 0) {
			return json({ error: 'At least one role must be selected' }, { status: 400 });
		}
		
		// Generate unique filename
		const fileExtension = path.extname(file.name);
		const fileName = `${uuidv4()}${fileExtension}`;
		const filePath = path.join(UPLOAD_DIR, fileName);
		
		// Save file to disk
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		await writeFile(filePath, buffer);
		
		// Save to database
		const uploadedFile = await prisma.uploadedFile.create({
			data: {
				title: title.trim(),
				description: description.trim(),
				category,
				language,
				provider,
				roles,
				fileName: file.name,
				filePath,
				fileSize: file.size,
				mimeType: file.type || 'application/octet-stream'
			}
		});
		
		return json(uploadedFile);
	} catch (error) {
		console.error('Upload error:', error);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
};
