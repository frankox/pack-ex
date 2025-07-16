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

- Node.js 20.19+ or Docker
- PostgreSQL (or use Docker)

### Option 1: Docker (Recommended)

1. **Clone and start**:
   ```bash
   git clone <your-repo>
   cd pack-ex
   docker-compose up -d
   ```

2. **Run database migrations**:
   ```bash
   docker-compose exec app npx prisma migrate dev
   ```

3. **Access the application**:
   - App: http://localhost:3000
   - Database: localhost:5432

### Option 2: Local Development

1. **Install dependencies**:
   ```bash
   npm install --registry https://registry.npmjs.org/
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start PostgreSQL** (if not using Docker):
   ```bash
   # Using Docker for database only
   docker run -d --name postgres \
     -e POSTGRES_USER=packex_user \
     -e POSTGRES_PASSWORD=packex_password \
     -e POSTGRES_DB=packex_db \
     -p 5432:5432 postgres:15
   ```

4. **Set up database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Access the application**:
   - App: http://localhost:5173

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
