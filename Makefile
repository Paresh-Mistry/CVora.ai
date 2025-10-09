# Makefile for CV-Gen Project with virtual environment support

# Colors for printing
GREEN := \033[0;32m
NC := \033[0m

# Directories
CLIENT_DIR := client
SERVER_DIR := server
VENV_DIR := env

.PHONY: all help install-client install-server start-client start-server start clean

all: help

help:
	@echo -e "${GREEN}Available commands:${NC}"
	@echo "  install-client     Install frontend dependencies"
	@echo "  install-server     Install backend dependencies (inside virtual env)"
	@echo "  start-client       Start the frontend (React/Vite)"
	@echo "  start-server       Start the backend (FastAPI inside virtual env)"
	@echo "  start              Start both frontend and backend"
	@echo "  clean              Remove node_modules, __pycache__, and virtual env"

# -------------------------
# Install dependencies
# -------------------------

install-client:
	@echo -e "${GREEN}Installing frontend dependencies...${NC}"
	cd $(CLIENT_DIR) && npm install

install-server:
	@echo -e "${GREEN}Setting up backend virtual environment...${NC}"
	cd $(SERVER_DIR) && python -m venv $(VENV_DIR)
	@echo -e "${GREEN}Installing backend dependencies...${NC}"
	cd $(SERVER_DIR) && $(VENV_DIR)/Scripts/activate && pip install --upgrade pip && pip install -r requirements.txt

# -------------------------
# Start servers
# -------------------------

start-client:
	@echo -e "${GREEN}Starting frontend...${NC}"
	cd $(CLIENT_DIR) && npm run dev

start-server:
	@echo -e "${GREEN}Starting backend inside virtual environment...${NC}"
	cd $(SERVER_DIR) && $(VENV_DIR)/Scripts/activate && uvicorn main:app --reload

start:
	@echo -e "${GREEN}Starting both frontend and backend...${NC}"
	# Run frontend and backend in parallel (requires GNU make)
	$(MAKE) -j2 start-client start-server

# -------------------------
# Clean
# -------------------------

clean:
	@echo -e "${GREEN}Cleaning project...${NC}"
	rm -rf $(CLIENT_DIR)/node_modules
	rm -rf $(SERVER_DIR)/__pycache__
	rm -rf $(SERVER_DIR)/$(VENV_DIR)
