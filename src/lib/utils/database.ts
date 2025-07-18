/**
 * Database utilities for handling base64 encoded connection strings
 * This is required for Vercel deployment where connection strings with special characters
 * need to be base64 encoded
 */

export function getDatabaseUrl(): string {
	const base64Url = process.env.DATABASE_URL_BASE64;
	if (base64Url) {
		try {
			return Buffer.from(base64Url, 'base64').toString('utf-8');
		} catch (error) {
			console.error('Failed to decode base64 database URL:', error);
			throw new Error('Invalid base64 encoded database URL');
		}
	}

	// Fallback to plain text URL (for local development)
	const plainUrl = process.env.DATABASE_URL;
	if (plainUrl) {
		return plainUrl;
	}

	throw new Error('No database URL found. Please set either DATABASE_URL_BASE64 or DATABASE_URL environment variable.');
}
