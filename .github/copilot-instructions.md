# PackEx File Upload Manager - Copilot Instructions

This is a SvelteKit TypeScript application for file upload and management with the following key components:

## Project Structure
- **Framework**: SvelteKit with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: UploadThing (cloud storage with global CDN)
- **Containerization**: Docker for easy deployment

## Key Features
- File upload form with validation (title, description, category, language, provider, roles)
- File table display with click-to-download functionality
- UploadThing integration for modern file uploads
- Direct CDN links for fast file access
- Responsive design with modern UI

## Database Schema
The main entity is `UploadedFile` with:
- Basic info: title, description, fileName, fileSize, mimeType
- Categorization: category, language, provider, roles (multi-select)
- Metadata: createdAt, updatedAt, filePath (UploadThing URL)

## API Endpoints
- `POST /api/uploadthing` - UploadThing upload handler
- `POST /api/files` - Save file metadata to database
- `GET /api/files` - List all files
- `GET /api/files/[id]/download` - Redirect to UploadThing CDN URL
- `DELETE /api/files/[id]` - Delete file from UploadThing and database

## UploadThing Integration
- **File Router**: Configured in `src/lib/server/uploadthing.ts`
- **Helpers**: Generated in `src/lib/utils/uploadthing.ts`
- **Upload Form**: Uses UploadThing hooks for seamless uploads
- **File Types**: Supports documents, images, videos, audio, archives
- **Limits**: Configured per file type (e.g., images up to 8MB, videos up to 128MB)

## Development Guidelines
- Use TypeScript for all new code
- Follow SvelteKit conventions for routing and API handlers
- Ensure proper error handling and validation
- Maintain responsive design principles
- Use Prisma for all database operations
- Use UploadThing for all file operations
- Keep updated the readme and copilot-instructions if necessary
