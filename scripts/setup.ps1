Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " NEXORA AI 2.0 - Local Dev Setup Script   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Check environment file
if (-not (Test-Path ".env.local")) {
    Write-Host "[1/4] Copying .env.example to .env.local..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
} else {
    Write-Host "[1/4] .env.local already exists." -ForegroundColor Green
}

# 2. Install dependencies
Write-Host "[2/4] Installing pnpm dependencies..." -ForegroundColor Yellow
pnpm install

# 3. Generate Prisma client
Write-Host "[3/4] Generating Prisma Client..." -ForegroundColor Yellow
pnpm --filter @nexora/db run db:generate

# 4. Success message
Write-Host "=========================================" -ForegroundColor Green
Write-Host " Setup complete! Ready for development.  " -ForegroundColor Green
Write-Host " Run 'pnpm dev' to start all services.   " -ForegroundColor Green
Write-Host " Web: http://localhost:3000              " -ForegroundColor Green
Write-Host " API: http://localhost:3001/api/v1       " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
