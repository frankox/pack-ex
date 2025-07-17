import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { RequestEvent } from '@sveltejs/kit';
import { StorageFactory, type StorageProviderType } from '$lib/storage/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
const STORAGE_PROVIDER = (process.env.STORAGE_PROVIDER as StorageProviderType) || 'LOCAL';

// Create storage provider instance
const storageProvider = StorageFactory.createProvider(STORAGE_PROVIDER, process.env as Record<string, string>);

export const POST = async ({ request }: RequestEvent) => {
	try {
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
		
		// Upload file using the configured storage provider
		const uploadResult = await storageProvider.uploadFile(file, fileName);
		
		if (!uploadResult.success) {
			return json({ error: uploadResult.error || 'Upload failed' }, { status: 500 });
		}
		
		// Save to database
		const uploadedFile = await prisma.uploadedFile.create({
			data: {
				title: title.trim(),
				description: description.trim(),
				category: category as any, // Type assertion for enum
				language: language as any, // Type assertion for enum
				provider: provider as any, // Type assertion for enum
				roles: roles as any, // Type assertion for enum array
				fileName: file.name,
				filePath: uploadResult.filePath,
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
