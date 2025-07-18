.PHONY: dev start-docker stop-docker setup clean help dev-local setup-local

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
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
	

# Main development command
dev: start-docker
	@echo "$(YELLOW)Setting up development environment...$(NC)"
	@echo "$(YELLOW)Waiting for database to be ready...$(NC)"
	@echo "$(YELLOW)Running database migrations...$(NC)"
	@npm run db:generate > /dev/null 2>&1 || true
	@npm run db:push > /dev/null 2>&1 || true
	@echo "$(GREEN)Starting development server...$(NC)"
	@echo "$(YELLOW)Access the app at: http://localhost:5173$(NC)"
	@npm run dev

# Docker-free development command
dev-local:
	@echo "$(YELLOW)Setting up Docker-free development environment...$(NC)"
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	@npm install --registry https://registry.npmjs.org/ > /dev/null 2>&1 || true
	@echo "$(YELLOW)Running database migrations...$(NC)"
	@npm run db:generate > /dev/null 2>&1 || true
	@npm run db:push > /dev/null 2>&1 || true
	@echo "$(GREEN)Starting development server...$(NC)"
	@echo "$(YELLOW)Access the app at: http://localhost:5173$(NC)"
	@echo "$(YELLOW)Note: Make sure your DATABASE_URL in .env points to a valid database$(NC)"
	@npm run dev

# Stop Docker services
stop-docker:
	@echo "$(YELLOW)Stopping Docker services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)Docker services stopped!$(NC)"

# Setup the project with Docker (install dependencies and prepare database)
setup: check-docker
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	@npm install --registry https://registry.npmjs.org/
	@echo "$(YELLOW)Starting database...$(NC)"
	@docker-compose up -d db
	@echo "$(YELLOW)Waiting for database to be ready...$(NC)"
	@sleep 5
	@echo "$(YELLOW)Setting up database...$(NC)"
	@npm run db:generate
	@npm run db:migrate
	@echo "$(GREEN)Setup complete! Run 'make dev' to start development.$(NC)"

# Docker-free setup (for cloud database usage)
setup-local:
	@echo "$(YELLOW)Setting up Docker-free environment...$(NC)"
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	@npm install --registry https://registry.npmjs.org/
	@echo "$(YELLOW)Setting up database schema...$(NC)"
	@npm run db:generate
	@npm run db:push
	@echo "$(GREEN)Setup complete! Run 'make dev-local' to start development.$(NC)"
	@echo "$(YELLOW)Note: Make sure your DATABASE_URL in .env points to a valid database$(NC)"

# Clean up Docker containers and volumes
clean:
	@echo "$(YELLOW)Cleaning up Docker containers and volumes...$(NC)"
	@docker-compose down -v
	@docker system prune -f
	@echo "$(GREEN)Cleanup complete!$(NC)"

# Show help
help:
	@echo "$(GREEN)PackEx - Available commands:$(NC)"
	@echo ""
	@echo "  $(YELLOW)make dev$(NC)        - Start development environment (with Docker database)"
	@echo "  $(YELLOW)make dev-local$(NC)  - Start development environment (Docker-free, cloud DB)"
	@echo "  $(YELLOW)make setup$(NC)      - Initial project setup with Docker database"
	@echo "  $(YELLOW)make setup-local$(NC) - Initial project setup for Docker-free environment"
	@echo "  $(YELLOW)make start-docker$(NC) - Start only Docker services (database)"
	@echo "  $(YELLOW)make stop-docker$(NC) - Stop Docker services"
	@echo "  $(YELLOW)make clean$(NC)      - Clean up Docker containers and volumes"
	@echo "  $(YELLOW)make help$(NC)       - Show this help message"
	@echo ""
	@echo "$(GREEN)Quick start (with Docker):$(NC)"
	@echo "  1. Run '$(YELLOW)make setup$(NC)' for first-time setup"
	@echo "  2. Run '$(YELLOW)make dev$(NC)' to start development"
	@echo ""
	@echo "$(GREEN)Quick start (Docker-free):$(NC)"
	@echo "  1. Configure your DATABASE_URL: '$(YELLOW)cp .env.cloud.example .env$(NC)'"
	@echo "  2. Run '$(YELLOW)make setup-local$(NC)' for first-time setup"
	@echo "  3. Run '$(YELLOW)make dev-local$(NC)' to start development"
	@echo ""
