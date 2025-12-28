# Step-by-Step Neon Database Setup Guide

## Step 1: Get Your Neon Connection String

1. Go to https://console.neon.tech
2. Sign up or log in
3. Create a new project (or use existing)
4. Click on your database
5. You'll see a connection string that looks like this:

```
postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
```

## Step 2: Convert to JDBC Format

### Neon Format:
```
postgresql://username:password@host:port/database?sslmode=require
```

### JDBC Format (what we need):
```
jdbc:postgresql://host:port/database?sslmode=require
```

### Example Conversion:

**From Neon:**
```
postgresql://myuser:mypass@ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
```

**To JDBC:**
```
jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
```

**Extract these values:**
- Host: `ep-cool-darkness-123456.us-east-2.aws.neon.tech`
- Port: `5432`
- Database: `neondb`
- Username: `myuser`
- Password: `mypass`

## Step 3: Set Environment Variables (Windows)

### Option A: PowerShell (Recommended)

Open PowerShell in the `backend` folder and run:

```powershell
# Set the JDBC URL (replace with your actual values)
$env:DATABASE_URL="jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb?sslmode=require"

# Set username and password
$env:DB_USERNAME="myuser"
$env:DB_PASSWORD="mypass"

# Verify they're set
echo $env:DATABASE_URL
echo $env:DB_USERNAME
```

### Option B: Command Prompt (CMD)

Open Command Prompt in the `backend` folder and run:

```cmd
set DATABASE_URL=jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
set DB_USERNAME=myuser
set DB_PASSWORD=mypass
```

### Option C: Set Permanently (System Environment Variables)

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to "Advanced" tab → Click "Environment Variables"
3. Under "User variables", click "New"
4. Add these variables:
   - Variable: `DATABASE_URL`
     Value: `jdbc:postgresql://your-host:5432/your-db?sslmode=require`
   - Variable: `DB_USERNAME`
     Value: `your_username`
   - Variable: `DB_PASSWORD`
     Value: `your_password`

## Step 4: Alternative - Direct Configuration in application.yml

If you prefer not to use environment variables, you can edit `application.yml` directly:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
    username: myuser
    password: mypass
    driver-class-name: org.postgresql.Driver
```

⚠️ **Warning:** Don't commit credentials to git! Use environment variables for production.

## Step 5: Test the Connection

1. Make sure you're in the `backend` directory
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

Or if using an IDE, just run the `WebCrawlBackendApplication` class.

## Quick Reference: Connection String Parts

From your Neon connection string:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

Extract:
- **USERNAME**: Everything before the `:` after `postgresql://`
- **PASSWORD**: Everything between `:` and `@`
- **HOST**: Everything between `@` and `:5432`
- **PORT**: Usually `5432`
- **DATABASE**: Everything between the last `/` and `?`

## Troubleshooting

### "Connection refused" or "Connection timeout"
- Check your internet connection
- Verify the host address is correct
- Ensure SSL mode is `require`

### "Authentication failed"
- Double-check username and password
- Make sure there are no extra spaces in the connection string

### "Database does not exist"
- Verify the database name in your Neon console
- Check if you need to create the database first

### To see connection logs
Edit `application.yml` and set:
```yaml
spring:
  jpa:
    show-sql: true
```

This will show SQL queries in the console (useful for debugging).

