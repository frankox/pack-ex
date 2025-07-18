import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from './utils/database.js';

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// Get the decoded database URL
const databaseUrl = getDatabaseUrl();

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
	datasources: {
		db: {
			url: databaseUrl
		}
	}
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
