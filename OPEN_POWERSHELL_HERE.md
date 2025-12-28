# How to Open PowerShell in This Project

## Project Path
```
C:\Users\nitis\Desktop\Web_crawl\backend
```

## Method 1: From File Explorer (Easiest)

1. Open **File Explorer** (Windows key + E)
2. Navigate to: `C:\Users\nitis\Desktop\Web_crawl\backend`
3. Click in the address bar (or press `Ctrl + L`)
4. Type: `powershell` and press Enter
   - OR right-click in the folder → "Open in Terminal" (Windows 11)
   - OR hold Shift + Right-click → "Open PowerShell window here" (Windows 10)

## Method 2: From PowerShell (Using cd command)

1. Open PowerShell (Windows key → type "PowerShell" → Enter)
2. Run this command:
   ```powershell
   cd C:\Users\nitis\Desktop\Web_crawl\backend
   ```

## Method 3: From Command Prompt

1. Press `Win + R`
2. Type: `cmd` and press Enter
3. Run:
   ```cmd
   cd C:\Users\nitis\Desktop\Web_crawl\backend
   ```

## Method 4: Quick Access - Create Shortcut

1. Right-click on desktop → New → Shortcut
2. Location: `powershell.exe -NoExit -Command "cd 'C:\Users\nitis\Desktop\Web_crawl\backend'"`
3. Name it: "Web Crawl Backend"
4. Double-click to open PowerShell in the project folder

## Verify You're in the Right Folder

Once PowerShell is open, verify with:
```powershell
pwd
```

You should see:
```
C:\Users\nitis\Desktop\Web_crawl\backend
```

## Quick Commands to Run After Opening

```powershell
# Check current directory
pwd

# List files
ls

# Run the conversion script (if you have it)
.\convert-neon-string.ps1

# Set environment variables for Neon database
$env:DATABASE_URL="jdbc:postgresql://your-host:5432/your-db?sslmode=require"
$env:DB_USERNAME="your_username"
$env:DB_PASSWORD="your_password"

# Run the Spring Boot application
mvn spring-boot:run
```

