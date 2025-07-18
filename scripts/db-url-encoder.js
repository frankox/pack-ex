#!/usr/bin/env node

/**
 * Database URL Base64 Encoder/Decoder
 * Helper script for encoding database URLs for Vercel deployment
 * 
 * Usage:
 *   node scripts/db-url-encoder.js encode "your-database-url"
 *   node scripts/db-url-encoder.js decode "base64-encoded-string"
 */

const [,, action, input] = process.argv;

if (!action || !input) {
	console.log('Usage:');
	console.log('  node scripts/db-url-encoder.js encode "your-database-url"');
	console.log('  node scripts/db-url-encoder.js decode "base64-encoded-string"');
	process.exit(1);
}

switch (action) {
	case 'encode':
		const encoded = Buffer.from(input).toString('base64');
		console.log('Encoded URL:');
		console.log(encoded);
		console.log('\nAdd this to your .env file:');
		console.log(`DATABASE_URL_BASE64="${encoded}"`);
		break;
	
	case 'decode':
		try {
			const decoded = Buffer.from(input, 'base64').toString('utf-8');
			console.log('Decoded URL:');
			console.log(decoded);
		} catch (error) {
			console.error('Error decoding base64 string:', error.message);
			process.exit(1);
		}
		break;
	
	default:
		console.error('Invalid action. Use "encode" or "decode"');
		process.exit(1);
}
