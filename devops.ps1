<#
.SYNOPSIS
    DevOps Task Automation Script for Windows PowerShell
.DESCRIPTION
    Provides single-command lifecycle management for Zestora on Docker & AWS.
.EXAMPLE
    .\devops.ps1 up
    .\devops.ps1 test
    .\devops.ps1 prod-up
#>

param(
    [Parameter(Position=0, Mandatory=$true)]
    [ValidateSet("up", "down", "restart", "logs", "build", "prod-up", "prod-down", "prod-logs", "test", "schedule-destroy", "cancel-destroy", "help")]
    [string]$Command
)

switch ($Command) {
    "up" {
        Write-Host "Starting development stack..." -ForegroundColor Green
        docker compose up -d
    }
    "down" {
        Write-Host "Stopping development stack..." -ForegroundColor Yellow
        docker compose down
    }
    "restart" {
        Write-Host "Restarting all services..." -ForegroundColor Yellow
        docker compose restart
    }
    "logs" {
        docker compose logs -f
    }
    "build" {
        Write-Host "Rebuilding containers..." -ForegroundColor Green
        docker compose build
    }
    "prod-up" {
        Write-Host "Starting production stack (Port 80)..." -ForegroundColor Green
        docker compose -f docker-compose.prod.yml up -d --build
    }
    "prod-down" {
        Write-Host "Stopping production stack..." -ForegroundColor Yellow
        docker compose -f docker-compose.prod.yml down
    }
    "prod-logs" {
        docker compose -f docker-compose.prod.yml logs -f
    }
    "test" {
        Write-Host "Running backend tests inside container..." -ForegroundColor Cyan
        docker compose exec backend python test_app.py
    }
    "schedule-destroy" {
        & "$PSScriptRoot\scripts\auto-destroy-in-10-days.ps1"
    }
    "cancel-destroy" {
        & "$PSScriptRoot\scripts\cancel-auto-destroy.ps1"
    }
    "help" {
        Write-Host @"
Zestora DevOps Helper (PowerShell)
==================================
  .\devops.ps1 up               - Start local containers
  .\devops.ps1 down             - Stop local containers
  .\devops.ps1 restart          - Restart services
  .\devops.ps1 logs             - Follow container logs
  .\devops.ps1 build            - Rebuild images
  .\devops.ps1 prod-up          - Start production stack (Port 80)
  .\devops.ps1 prod-down        - Stop production stack
  .\devops.ps1 prod-logs        - View production logs
  .\devops.ps1 test             - Run test suite
  .\devops.ps1 schedule-destroy - Schedule auto-destruction in 10 days
  .\devops.ps1 cancel-destroy   - Cancel auto-destruction timer
"@ -ForegroundColor Cyan
    }
}

