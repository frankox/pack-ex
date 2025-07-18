FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

# Create uploads directory for local storage
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "build"]
