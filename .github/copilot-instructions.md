# PackEx File Upload Manager - Copilot Instructions

This is a SvelteKit TypeScript application for file upload and management with the following key components:

## Project Structure
- **Framework**: SvelteKit with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Local filesystem with uploads directory
- **Containerization**: Docker for easy deployment

## Key Features
- File upload form with validation (title, description, category, language, provider, roles)
- File table display with click-to-download functionality
- RESTful API endpoints for file operations
- Responsive design with modern UI

## Database Schema
The main entity is `UploadedFile` with:
- Basic info: title, description, fileName, fileSize, mimeType
- Categorization: category, language, provider, roles (multi-select)
- Metadata: createdAt, updatedAt, filePath

## API Endpoints
- `POST /api/upload` - Upload new files
- `GET /api/files` - List all files
- `GET /api/files/[id]/download` - Download specific file
- `DELETE /api/files/[id]` - Delete specific file

## Development Guidelines
- Use TypeScript for all new code
- Follow SvelteKit conventions for routing and API handlers
- Ensure proper error handling and validation
- Maintain responsive design principles
- Use Prisma for all database operations
