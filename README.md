# PackEx - File Upload Manager

A modern file upload and management application built with SvelteKit, TypeScript, PostgreSQL, and flexible storage options. Simple, fast, and reliable file uploads with support for both cloud and local storage.

## Features

- **File Upload**: Upload various file types (PDF, TXT, DOC, DOCX, PPT, PPTX, MP4, MOV, AVI, ZIP, Images)
- **Flexible Storage**: Choose between UploadThing (cloud CDN) or local file storage
- **Metadata Management**: Capture title, description, category, language, provider, and roles
- **File Table**: Display uploaded files with sorting and search capabilities
- **Fast Downloads**: Direct CDN links (UploadThing) or local serving for optimal performance
- **Responsive Design**: Works on desktop and mobile devices
- **Docker Support**: Easy deployment with Docker and docker-compose
- **Local Storage Option**: Run completely locally without external dependencies

## Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Backend**: SvelteKit API routes
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: UploadThing (global CDN) OR Local filesystem
- **Containerization**: Docker & Docker Compose

## Storage Options

PackEx supports two storage providers:

### 1. Local Storage (Default)
- Files stored on your server's filesystem
- No external dependencies or API keys required
- Perfect for self-hosted deployments
- Uses Docker volumes for persistence

### 2. UploadThing (Cloud CDN)
- Global CDN delivery for fast downloads
- Requires UploadThing account and API token
- Automatic file optimization and processing
- Built-in security and access controls

## Quick Start

### Prerequisites

- Node.js 20.19+
- Docker Desktop (for local database and file storage)
- Make (optional - for using Makefile commands)

### Setup Instructions

#### Option 1: Complete Local Setup with Docker (Recommended)

This option uses local PostgreSQL database and local file storage - no external services required!

1. **Clone the repository**:
   ```bash
   git clone <your-repo>
   cd pack-ex
   ```

2. **Copy environment file**:
   ```bash
   cp .env.local.example .env
   ```

3. **First-time setup** (installs dependencies and sets up database):
   ```bash
   make setup
   ```

4. **Start development** (starts database and dev server):
   ```bash
   make dev
   ```

#### Option 2: Docker Database + UploadThing Storage

1. **Clone the repository**:
   ```bash
   git clone <your-repo>
   cd pack-ex
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your UPLOADTHING_TOKEN
   # Set STORAGE_PROVIDER=uploadthing
   ```

3. **First-time setup**:
   ```bash
   make setup
   ```

4. **Start development**:
   ```bash
   make dev
   ```

4. **Start development** (starts database and dev server):
   ```bash
   make dev
   ```

#### Option 2: Without Docker (Cloud Database)

1. **Clone the repository**:
   ```bash
   git clone <your-repo>
   cd pack-ex
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment** (for cloud database):
   ```bash
   cp .env.cloud.example .env
   # Edit .env with your DATABASE_URL and UPLOADTHING_TOKEN
   ```

4. **Set up database schema**:
   ```bash
   npm run db:push
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

### Access the application
- **App**: http://localhost:5173
- **Database** (if using Docker): localhost:5432

### Available Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make setup` | Initial project setup with Docker database |
| `make setup-local` | Initial project setup for Docker-free environment |
| `make dev` | Start development environment (with Docker database) |
| `make dev-local` | Start development environment (Docker-free, cloud DB) |
| `make start-docker` | Start only the database container |
| `make stop-docker` | Stop Docker services |
| `make clean` | Clean up Docker containers and volumes |

### Quick Commands

**With Docker (Local Database):**
```bash
make setup     # First-time setup
make dev       # Start development
```

**Docker-free (Cloud Database):**
```bash
# Configure your DATABASE_URL in .env first
make setup-local  # First-time setup
make dev-local    # Start development
```

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

## Storage Configuration

PackEx automatically detects your storage configuration from environment variables:

### Local Storage Configuration

```bash
# .env
STORAGE_PROVIDER=local
UPLOADS_DIR=/app/uploads  # (Docker) or ./uploads (local dev)
PUBLIC_URL=http://localhost:3000
```

- Files are stored in the specified directory
- Docker volume ensures file persistence
- No external API keys required

### UploadThing Configuration

```bash
# .env
STORAGE_PROVIDER=uploadthing
UPLOADTHING_TOKEN=your_uploadthing_token_here
```

- Get your token from [UploadThing Dashboard](https://uploadthing.com/dashboard)
- Files are stored on UploadThing's global CDN
- Automatic file optimization and processing

### Switching Storage Providers

You can switch between storage providers by changing the `STORAGE_PROVIDER` environment variable and restarting the application. **Note**: Existing files will remain in their current storage location.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/config/storage` | Get current storage provider configuration |
| POST | `/api/upload/local` | Upload file to local storage (local provider only) |
| POST | `/api/uploadthing` | UploadThing upload endpoint (uploadthing provider only) |
| GET | `/api/files` | Get list of all uploaded files |
| GET | `/api/files/serve/[key]` | Serve local files (local provider only) |
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

PackEx provides different environment templates for different setups:

| File | Purpose | Usage |
|------|---------|-------|
| `.env.example` | Docker setup template | Local development with Docker PostgreSQL |
| `.env.cloud.example` | Cloud setup template | Docker-free development with cloud database |
| `.env.local` | Local development | Current local configuration |
| `.env.production` | Production deployment | Production environment with Neon database |

Choose the appropriate template based on your development approach:

- **Docker development**: `cp .env.example .env`
- **Cloud development**: `cp .env.cloud.example .env`

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
