# PackEx - File Upload Manager

A modern file upload and management application built with SvelteKit, TypeScript, PostgreSQL, and flexible storage options. Simple, fast, and reliable file uploads with support for both cloud and local storage.

## 🚀 Quick Start

**Get started in seconds:**

```bash
# Local setup (no external services needed)
git clone <your-repo> && cd pack-ex && make local

# Cloud setup (with UploadThing CDN)
git clone <your-repo> && cd pack-ex && make cloud
```

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

#### Option 1: Complete Local Setup (Recommended)

**Perfect for development - no external services required!**

```bash
# 1. Clone the repository
git clone <your-repo>
cd pack-ex

# 2. One-command setup and start
make local
```

**Features:**
- 🐳 Docker PostgreSQL database
- 📁 Local file storage (persistent with Docker volumes)
- 🚀 No external accounts or API keys needed
- ⚡ Fast setup and development

#### Option 2: Cloud Setup 

**Uses cloud services for database and storage:**

```bash
# 1. Clone the repository
git clone <your-repo>
cd pack-ex

# 2. One-command setup and start
make cloud

# 3. Add your UploadThing token to .env
# UPLOADTHING_TOKEN=your_token_here
```

**Features:**
- ☁️ Neon PostgreSQL (cloud database)
- 🌐 UploadThing CDN (global file storage)
- 📈 Scalable cloud infrastructure
- 🔧 Requires UploadThing account

### Access the application
- **App**: http://localhost:5173
- **Database** (if using Docker): localhost:5432

### Available Commands

| Command | Description |
|---------|-------------|
| `make local` | 🐳 Complete LOCAL setup (Docker + Local Storage) |
| `make cloud` | ☁️ Complete CLOUD setup (No Docker + UploadThing) |
| `make start-docker` | Start only Docker services (database) |
| `make stop-docker` | Stop Docker services |
| `make clean` | Clean up Docker containers and volumes |
| `make help` | Show all available commands |

### Quick Commands

**🐳 Local Development (Recommended):**
```bash
make local     # One command setup + start
```

**☁️ Cloud Development:**
```bash
make cloud     # One command setup + start
# Remember to add UPLOADTHING_TOKEN to .env
```

### Alternative Setup (Manual)

If you prefer not to use Make:

**Local Setup:**
```bash
# 1. Copy environment configuration
cp .env.local.example .env

# 2. Install dependencies
npm install --registry https://registry.npmjs.org/

# 3. Start database
docker-compose up -d db

# 4. Set up database
npm run db:generate
npm run db:migrate

# 5. Start development server
npm run dev
```

**Cloud Setup:**
```bash
# 1. Copy environment configuration
cp .env.cloud.example .env
# Edit .env with your UPLOADTHING_TOKEN

# 2. Install dependencies
npm install --registry https://registry.npmjs.org/

# 3. Set up database
npm run db:generate
npm run db:push

# 4. Start development server
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
│   │   │   ├── UploadForm.svelte      # Smart upload form (local/cloud)
│   │   │   ├── FileTable.svelte       # File listing and management
│   │   │   ├── FileViewer.svelte      # File preview component
│   │   │   └── Modal.svelte           # Modal dialog component
│   │   ├── server/
│   │   │   ├── storage.ts             # Storage provider abstraction
│   │   │   └── uploadthing.ts         # UploadThing configuration
│   │   ├── utils/
│   │   │   ├── upload.ts              # Upload utilities
│   │   │   ├── database.ts            # Database utilities
│   │   │   ├── debounce.ts            # Debounce utility
│   │   │   └── uploadthing.ts         # UploadThing helpers
│   │   └── db.ts                      # Prisma client
│   ├── routes/
│   │   ├── api/
│   │   │   ├── config/storage/        # Storage configuration API
│   │   │   ├── upload/local/          # Local upload endpoint
│   │   │   ├── uploadthing/           # UploadThing endpoint
│   │   │   └── files/                 # File management APIs
│   │   ├── +layout.svelte             # App layout
│   │   └── +page.svelte               # Main page
│   ├── app.css                        # Global styles
│   └── app.html                       # HTML template
├── prisma/
│   └── schema.prisma                  # Database schema
├── docker-compose.yml                 # Docker services
├── Dockerfile                         # App container
├── .env.local.example                 # Local development template
├── .env.cloud.example                 # Cloud development template
├── DEPLOYMENT.md                      # Deployment guide
├── STORAGE_IMPLEMENTATION.md          # Storage system docs
└── README.md                          # This file
```

## Environment Configuration

PackEx automatically configures the appropriate environment based on your chosen setup:

### Local Storage Environment (.env.local.example)
```bash
# Storage Configuration - Use local storage by default
STORAGE_PROVIDER=local

# Database (Docker PostgreSQL)
DATABASE_URL="postgresql://packex_user:packex_password@db:5432/packex_db?schema=public"

# Local file storage settings
UPLOADS_DIR=/app/uploads
PUBLIC_URL=http://localhost:3000

# Security
SESSION_SECRET=your-strong-secret-change-in-production
```

### Cloud Environment (.env.cloud.example)
```bash
# Storage Configuration - Use UploadThing CDN
STORAGE_PROVIDER=uploadthing
UPLOADTHING_TOKEN=your_uploadthing_token_here

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_o4eBfna...@ep-bitter-cloud...neon.tech/neondb?sslmode=require"

# Security
SESSION_SECRET=your-strong-secret-change-in-production
```

### Environment Files

| File | Used By | Purpose |
|------|---------|---------|
| `.env.local.example` | `make local` | Docker + Local storage template |
| `.env.cloud.example` | `make cloud` | Cloud services template |
| `.env` | Application | Active configuration (auto-created) |

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
