# PowerShell Script to Set Neon Database Environment Variables
# Run this script to set your Neon database credentials

Write-Host "=== Setting Neon Database Environment Variables ===" -ForegroundColor Cyan
Write-Host ""

# Set the JDBC URL
$env:DATABASE_URL = "jdbc:postgresql://ep-dry-rice-a4nwjq20-pooler.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require"

# Set username and password
$env:DB_USERNAME = "neondb_owner"
$env:DB_PASSWORD = "npg_nVaOAyTfB29D"

Write-Host "✓ Environment variables set!" -ForegroundColor Green
Write-Host ""
Write-Host "DATABASE_URL: $env:DATABASE_URL" -ForegroundColor Yellow
Write-Host "DB_USERNAME: $env:DB_USERNAME" -ForegroundColor Yellow
Write-Host "DB_PASSWORD: [hidden]" -ForegroundColor Yellow
Write-Host ""
Write-Host "Note: These variables are set for this PowerShell session only." -ForegroundColor Gray
Write-Host "To make them permanent, add them to System Environment Variables." -ForegroundColor Gray
Write-Host ""
Write-Host "You can now run: mvn spring-boot:run" -ForegroundColor Green

