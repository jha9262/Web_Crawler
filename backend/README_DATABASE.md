# Database Configuration - Neon PostgreSQL

This application is configured to use Neon (serverless PostgreSQL) as the database.

## Setup Instructions

### 1. Create a Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up or log in
3. Create a new project
4. Copy your connection string from the dashboard

### 2. Configure Environment Variables

You have two options for configuration:

#### Option A: Full JDBC URL (Recommended - Easiest)
Set the `DATABASE_URL` environment variable with your full Neon connection string converted to JDBC format:

From Neon dashboard, you'll get something like:
```
postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
```

Convert to JDBC format:
```bash
DATABASE_URL=jdbc:postgresql://ep-xxx-xxx.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
```

Then set:
```bash
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Option B: Individual Components
If you prefer to set individual components, update the `application.yml` file directly or set:
```bash
DB_HOST=ep-xxx-xxx.us-east-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Note: If `DATABASE_URL` is set, it will be used and individual components will be ignored.

### 3. Set Environment Variables

#### Windows (PowerShell)
```powershell
$env:DATABASE_URL="jdbc:postgresql://ep-xxx-xxx.us-east-2.aws.neon.tech:5432/neondb?sslmode=require"
$env:DB_USERNAME="your_username"
$env:DB_PASSWORD="your_password"
```

#### Windows (Command Prompt)
```cmd
set DATABASE_URL=jdbc:postgresql://ep-xxx-xxx.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
set DB_USERNAME=your_username
set DB_PASSWORD=your_password
```

#### Linux/Mac
```bash
export DATABASE_URL="jdbc:postgresql://ep-xxx-xxx.us-east-2.aws.neon.tech:5432/neondb?sslmode=require"
export DB_USERNAME="your_username"
export DB_PASSWORD="your_password"
```

### 4. Run the Application

The application will automatically:
- Connect to your Neon database
- Create tables using JPA/Hibernate `ddl-auto: update`
- Use connection pooling with HikariCP

## Connection String Format

Neon provides connection strings in this format:
```
postgresql://username:password@hostname:port/database?sslmode=require
```

Convert it to JDBC format:
```
jdbc:postgresql://hostname:port/database?sslmode=require
```

## Troubleshooting

### Connection Issues
- Ensure SSL mode is set to `require` (Neon requires SSL)
- Check that your IP is allowed (Neon allows all IPs by default)
- Verify your credentials are correct

### SSL Certificate Issues
If you encounter SSL certificate errors, you may need to add:
```
?sslmode=require&sslfactory=org.postgresql.ssl.NonValidatingFactory
```

However, this is not recommended for production.

## Local Development

For local development, you can still use H2 by setting:
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:crawlerdb
```

Or use a local PostgreSQL instance.
