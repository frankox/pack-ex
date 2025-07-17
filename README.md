# PackEx - File Upload Manager

A modern file upload and management application built with SvelteKit, TypeScript, PostgreSQL, and Docker. Supports multiple storage providers including local storage, AWS S3, and Google Drive.

## Features

- **File Upload**: Upload various file types (PDF, TXT, DOC, DOCX, PPT, PPTX, MP4, MOV, AVI)
- **Multiple Storage Providers**: Choose between local storage, AWS S3, or Google Drive
- **Metadata Management**: Capture title, description, category, language, provider, and roles
- **File Table**: Display uploaded files with sorting and search capabilities
- **File Download**: Click any row to download the file
- **Responsive Design**: Works on desktop and mobile devices
- **Docker Support**: Easy deployment with Docker and docker-compose
- **Configurable Storage**: Switch between storage providers via configuration

## Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Backend**: SvelteKit API routes
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Local filesystem, AWS S3, or Google Drive
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Node.js 20.19+
- Docker Desktop (for database)
- Make (for using Makefile commands)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <your-repo>
   cd pack-ex
   ```

2. **First-time setup** (installs dependencies and sets up database):
   ```bash
   make setup
   ```

3. **Configure storage provider** (optional - defaults to local storage):
   ```bash
   npm run configure-storage
   ```

4. **Start development** (starts database and dev server):
   ```bash
   make dev
   ```

5. **Access the application**:
   - App: http://localhost:5173
   - Database: localhost:5432

### Available Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make setup` | Initial project setup (first-time only) |
| `make dev` | Start development environment |
| `make start-docker` | Start only the database container |
| `make stop-docker` | Stop Docker services |
| `make clean` | Clean up Docker containers and volumes |
| `npm run configure-storage` | Interactive storage provider configuration |

### Alternative Setup (Manual)

If you prefer not to use Make:

1. **Install dependencies**:
   ```bash
   npm install --registry https://registry.npmjs.org/
   ```

2. **Start database**:
   ```bash
   docker-compose up -d db
   ```

3. **Set up database**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload a new file with metadata |
| GET | `/api/files` | Get list of all uploaded files |
| GET | `/api/files/[id]/download` | Download a specific file |
| DELETE | `/api/files/[id]` | Delete a specific file |

## Database Schema

### UploadedFile Model

```prisma
model UploadedFile {
  id          String   @id @default(cuid())
  title       String   @db.VarChar(200)
  description String   @db.VarChar(1000)
  category    Category
  language    Language
  provider    Provider
  roles       Role[]
  fileName    String
  filePath    String
  fileSize    Int
  mimeType    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Enums

- **Category**: Leadership, Managing Complexity, Innovation, Strategy, Communication, Teamwork, Problem Solving, Technical Skills
- **Language**: EN, IT, ES, FR, DE
- **Provider**: Skilla, LinkedIn, Pack, Mentor, External
- **Role**: Mentor, Coach, Mentee, Coachee

## Project Structure

```
pack-ex/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── UploadForm.svelte
│   │   │   └── FileTable.svelte
│   │   ├── storage/           # Storage abstraction layer
│   │   │   ├── index.ts
│   │   │   ├── local.ts
│   │   │   ├── aws-s3.ts
│   │   │   └── google-drive.ts
│   │   └── db.ts
│   ├── routes/
│   │   ├── api/
│   │   │   ├── upload/
│   │   │   └── files/
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   ├── app.css
│   └── app.html
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
├── Dockerfile
├── configure-storage.js      # Storage configuration script
├── CLOUD_STORAGE.md         # Cloud storage setup guide
└── README.md
```

## Environment Configuration

PackEx provides multiple environment configuration files for different deployment scenarios:

### Environment Files

| File | Purpose | Usage |
|------|---------|-------|
| `.env` | Default configuration | Development fallback |
| `.env.local` | Local development | Docker development environment |
| `.env.production` | Production deployment | Google Drive storage configuration |
| `.env.example` | Template file | Shows all available options |

### Setup Instructions

1. **For Local Development with Docker**:
   ```bash
   cp .env.local .env
   # Edit .env if needed, then start development
   make dev
   ```

2. **For Production with Google Drive**:
   ```bash
   cp .env.production .env
   # Configure Google Drive credentials (see CLOUD_STORAGE.md)
   # Deploy to your production environment
   ```

### Storage Configuration

PackEx supports multiple storage providers. Configure your preferred option:

```bash
# Storage Provider (LOCAL, AWS_S3, GOOGLE_DRIVE)
STORAGE_PROVIDER=LOCAL

# Database
DATABASE_URL="postgresql://packex_user:packex_password@localhost:5432/packex_db?schema=public"

# File Upload Settings
MAX_FILE_SIZE=10485760  # 10MB

# Local Storage (when STORAGE_PROVIDER=LOCAL)
UPLOAD_DIR="uploads"

# AWS S3 Storage (when STORAGE_PROVIDER=AWS_S3)
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Google Drive Storage (when STORAGE_PROVIDER=GOOGLE_DRIVE)
GOOGLE_DRIVE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-client-secret
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GOOGLE_DRIVE_REFRESH_TOKEN=your-refresh-token
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
```

### Quick Configuration

Use the interactive configuration tool:
```bash
npm run configure-storage
```

For detailed setup instructions, see [CLOUD_STORAGE.md](./CLOUD_STORAGE.md).

## Development

### Database Operations

```bash
# Generate Prisma client
npm run db:generate

# Apply schema changes to database
npm run db:push

# Create and apply migrations
npm run db:migrate
```

### File Upload Validation

- **File Size**: Maximum 10MB (configurable)
- **File Types**: PDF, TXT, DOC, DOCX, PPT, PPTX, MP4, MOV, AVI
- **Required Fields**: Title, Description, Category, Language, Provider, Roles
- **Character Limits**: Title (200 chars), Description (1000 chars)

## Deployment

### Production Build

```bash
npm run build
node build
```

### Docker Production

```bash
docker-compose -f docker-compose.yml up -d
```

## Security Considerations

- File type validation
- File size limits
- Input sanitization
- Path traversal protection
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please open an issue in the repository.
