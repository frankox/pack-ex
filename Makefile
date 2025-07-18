.PHONY: dev start-docker stop-docker setup clean help local cloud

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
RED := \033[0;31m
NC := \033[0m # No Color

# Check if Docker is running
check-docker:
	@if ! docker info > /dev/null 2>&1; then \
		echo "$(RED)Docker is not running. Please start Docker Desktop first.$(NC)"; \
		exit 1; \
	fi

# Start Docker services (database) only if container doesn't exist
start-docker: check-docker
	@if ! docker ps -a --format 'table {{.Names}}' | grep -q "packex_postgres"; then \
		echo "$(YELLOW)Starting Docker services...$(NC)"; \
		docker-compose up -d db; \
		echo "$(GREEN)Docker services started successfully!$(NC)"; \
	else \
		echo "$(GREEN)Docker services already running.$(NC)"; \
		docker-compose start db > /dev/null 2>&1 || true; \
	fi
	

# =============================================================================
# LOCAL DEPLOYMENT (Docker + Local Storage)
# =============================================================================

# Complete local setup with Docker database and local file storage
local: start-docker
	@echo "$(BLUE)🐳 Setting up LOCAL deployment (Docker + Local Storage)$(NC)"
	@echo "$(YELLOW)📋 Copying local environment configuration...$(NC)"
	@cp .env.local .env
	@echo "$(YELLOW)📦 Installing dependencies...$(NC)"
	@npm install --registry https://registry.npmjs.org/ > /dev/null 2>&1 || true
	@echo "$(YELLOW)⏳ Waiting for database to be ready...$(NC)"
	@sleep 3
	@echo "$(YELLOW)🔧 Setting up database schema...$(NC)"
	@npm run db:generate > /dev/null 2>&1 || true
	@npm run db:migrate > /dev/null 2>&1 || true
	@echo "$(GREEN)✅ LOCAL setup complete!$(NC)"
	@echo "$(BLUE)📁 Storage: Local filesystem (/uploads directory)$(NC)"
	@echo "$(BLUE)🗄️  Database: Docker PostgreSQL (localhost:5432)$(NC)"
	@echo "$(YELLOW)🚀 Starting development server...$(NC)"
	@echo "$(GREEN)🌐 Access the app at: http://localhost:5173$(NC)"
	@npm run dev

# =============================================================================
# CLOUD DEPLOYMENT (No Docker + Cloud Services)
# =============================================================================

# Complete cloud setup without Docker
cloud:
	@echo "$(BLUE)☁️  Setting up CLOUD deployment (No Docker + Cloud Services)$(NC)"
	@echo "$(YELLOW)📋 Copying cloud environment configuration...$(NC)"
	@cp .env.cloud .env
	@echo "$(YELLOW)📦 Installing dependencies...$(NC)"
	@npm install --registry https://registry.npmjs.org/ > /dev/null 2>&1 || true
	@echo "$(YELLOW)🔧 Setting up database schema...$(NC)"
	@npm run db:generate > /dev/null 2>&1 || true
	@npm run db:push > /dev/null 2>&1 || true
	@echo "$(GREEN)✅ CLOUD setup complete!$(NC)"
	@echo "$(BLUE)📁 Storage: UploadThing (Global CDN)$(NC)"
	@echo "$(BLUE)🗄️  Database: Neon PostgreSQL (Cloud)$(NC)"
	@echo "$(YELLOW)📝 Remember to add your UPLOADTHING_TOKEN to .env$(NC)"
	@echo "$(YELLOW)🚀 Starting development server...$(NC)"
	@echo "$(GREEN)🌐 Access the app at: http://localhost:5173$(NC)"
	@npm run dev


# Stop Docker services
stop-docker:
	@echo "$(YELLOW)Stopping Docker services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)Docker services stopped!$(NC)"

# Clean up Docker containers and volumes
clean:
	@echo "$(YELLOW)Cleaning up Docker containers and volumes...$(NC)"
	@docker-compose down -v
	@docker system prune -f
	@echo "$(GREEN)Cleanup complete!$(NC)"

# Show help
help:
	@echo "$(GREEN)🚀 PackEx - File Upload Manager$(NC)"
	@echo ""
	@echo "$(BLUE)=== MAIN COMMANDS ===$(NC)"
	@echo "  $(GREEN)make local$(NC)       - 🐳 Complete LOCAL setup (Docker + Local Storage)"
	@echo "  $(BLUE)Features: Docker PostgreSQL + Local file storage$(NC)"
	@echo "  $(BLUE)No external accounts needed!$(NC)"
	@echo "  $(GREEN)make cloud$(NC)       - ☁️  Complete CLOUD setup (No Docker + UploadThing)"
	@echo "  $(BLUE)Features: Neon PostgreSQL + UploadThing CDN$(NC)"
	@echo "  $(YELLOW)Remember to add your UPLOADTHING_TOKEN to .env$(NC)"
	@echo ""
	@echo "$(BLUE)=== UTILITY COMMANDS ===$(NC)"
	@echo "  $(YELLOW)make start-docker$(NC) - Start only Docker services (database)"
	@echo "  $(YELLOW)make stop-docker$(NC)  - Stop Docker services"
	@echo "  $(YELLOW)make clean$(NC)        - Clean up Docker containers and volumes"
	@echo "  $(YELLOW)make help$(NC)         - Show this help message"
