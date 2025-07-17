# PackEx - File Upload Manager

A modern file upload and management application built with SvelteKit, TypeScript, PostgreSQL, and Docker.

## Features

- **File Upload**: Upload various file types (PDF, TXT, DOC, DOCX, PPT, PPTX, MP4, MOV, AVI)
- **Metadata Management**: Capture title, description, category, language, provider, and roles
- **File Table**: Display uploaded files with sorting and search capabilities
- **File Download**: Click any row to download the file
- **Responsive Design**: Works on desktop and mobile devices
- **Docker Support**: Easy deployment with Docker and docker-compose

## Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Backend**: SvelteKit API routes
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Local filesystem (with cloud storage option)
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

3. **Start development** (starts database and dev server):
   ```bash
   make dev
   ```

4. **Access the application**:
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
└── README.md
```

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://packex_user:packex_password@localhost:5432/packex_db?schema=public"

# File Upload
UPLOAD_DIR="uploads"
MAX_FILE_SIZE=10485760  # 10MB
```

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
