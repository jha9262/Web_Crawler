# PowerShell Script to Convert Neon Connection String to JDBC Format
# Usage: .\convert-neon-string.ps1

Write-Host "=== Neon Connection String Converter ===" -ForegroundColor Cyan
Write-Host ""

# Get connection string from user
$neonString = Read-Host "Paste your Neon connection string (postgresql://...)"

if ($neonString -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^\?]+)") {
    $username = $matches[1]
    $password = $matches[2]
    $host = $matches[3]
    $port = $matches[4]
    $database = $matches[5]
    
    # Build JDBC URL
    $jdbcUrl = "jdbc:postgresql://${host}:${port}/${database}?sslmode=require"
    
    Write-Host ""
    Write-Host "=== Extracted Information ===" -ForegroundColor Green
    Write-Host "Host: $host"
    Write-Host "Port: $port"
    Write-Host "Database: $database"
    Write-Host "Username: $username"
    Write-Host "Password: [hidden]"
    Write-Host ""
    
    Write-Host "=== JDBC Connection String ===" -ForegroundColor Yellow
    Write-Host $jdbcUrl
    Write-Host ""
    
    Write-Host "=== Environment Variables to Set ===" -ForegroundColor Cyan
    Write-Host '$env:DATABASE_URL="' + $jdbcUrl + '"'
    Write-Host '$env:DB_USERNAME="' + $username + '"'
    Write-Host '$env:DB_PASSWORD="' + $password + '"'
    Write-Host ""
    
    # Ask if user wants to set them automatically
    $setNow = Read-Host "Set these environment variables now? (y/n)"
    if ($setNow -eq "y" -or $setNow -eq "Y") {
        $env:DATABASE_URL = $jdbcUrl
        $env:DB_USERNAME = $username
        $env:DB_PASSWORD = $password
        
        Write-Host ""
        Write-Host "✓ Environment variables set for this session!" -ForegroundColor Green
        Write-Host "Note: These will be lost when you close this PowerShell window." -ForegroundColor Yellow
        Write-Host "To make them permanent, add them to System Environment Variables." -ForegroundColor Yellow
    }
} else {
    Write-Host "Error: Invalid connection string format!" -ForegroundColor Red
    Write-Host "Expected format: postgresql://username:password@host:port/database?sslmode=require" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

