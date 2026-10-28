.PHONY: help up down restart logs build prod-up prod-down prod-logs test lint backup tf-plan tf-apply

help:
	@echo "Zestora DevOps Management Commands"
	@echo "=================================="
	@echo "  make up          - Start local dev services (docker compose)"
	@echo "  make down        - Stop dev services"
	@echo "  make restart     - Restart all dev services"
	@echo "  make logs        - Follow logs in dev mode"
	@echo "  make build       - Rebuild dev container images"
	@echo "  make prod-up     - Start production stack on EC2"
	@echo "  make prod-down   - Stop production stack on EC2"
	@echo "  make prod-logs   - Follow production logs"
	@echo "  make test        - Run backend test suite"
	@echo "  make backup BUCKET=<name> - Backup MongoDB to AWS S3"
	@echo "  make tf-init     - Initialize Terraform"
	@echo "  make tf-plan     - Preview AWS EC2 infrastructure changes"
	@echo "  make tf-apply    - Provision AWS EC2 infrastructure"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

build:
	docker compose build

prod-up:
	docker compose -f docker-compose.prod.yml up -d --build

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

test:
	docker compose exec backend python test_app.py

backup:
	@if [ -z "$(BUCKET)" ]; then echo "Error: specify BUCKET=<s3-bucket-name>"; exit 1; fi
	bash scripts/backup-mongo-s3.sh $(BUCKET)

tf-init:
	cd terraform && terraform init

tf-plan:
	cd terraform && terraform plan

tf-apply:
	cd terraform && terraform apply

