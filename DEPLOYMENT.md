# Deployment Guide - Render (Backend) + Vercel (Frontend)

## Prerequisites
- GitHub account
- Render account (free tier available)
- Vercel account (free tier available)
- Neon database (already set up)

## Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/web-crawl.git
   git push -u origin main
   ```

### Step 2: Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `web-crawl-backend`
   - **Environment**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests` (or `mvn clean package -DskipTests`)
   - **Start Command**: `java -jar target/*.jar`
   - **Instance Type**: Free (or paid for better performance)

### Step 3: Set Environment Variables in Render
Go to your service → **Environment** tab, add:

```
DATABASE_URL=jdbc:postgresql://ep-dry-rice-a4nwjq20-pooler.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_nVaOAyTfB29D
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
PORT=8080
```

**Important**: Replace `your-frontend.vercel.app` with your actual Vercel URL after deploying frontend.

### Step 4: Get Your Backend URL
After deployment, Render will give you a URL like:
- `https://web-crawl-backend.onrender.com`

Save this URL - you'll need it for the frontend!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Environment Variables
Create a `.env.production` file (don't commit this):
```env
VITE_API_URL=https://your-backend-url.onrender.com/api/crawl
```

Or set it directly in Vercel dashboard.

### Step 2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root of repo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables in Vercel
Go to your project → **Settings** → **Environment Variables**, add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api/crawl
```

Replace `your-backend-url.onrender.com` with your actual Render backend URL.

### Step 4: Redeploy
After setting environment variables, trigger a new deployment.

---

## Part 3: Update CORS in Backend

After you get your Vercel frontend URL, update the CORS environment variable in Render:

```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

Then restart your Render service.

---

## Quick Reference

### Backend (Render)
- **URL**: `https://your-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/api/crawl/health`
- **Environment Variables Needed**:
  - `DATABASE_URL`
  - `DB_USERNAME`
  - `DB_PASSWORD`
  - `CORS_ALLOWED_ORIGINS`
  - `PORT` (auto-set by Render, but can override)

### Frontend (Vercel)
- **URL**: `https://your-app.vercel.app`
- **Environment Variables Needed**:
  - `VITE_API_URL` (your Render backend URL + `/api/crawl`)

---

## Troubleshooting

### Backend Issues
- **Build fails**: Check Maven wrapper is included, or use `mvn` command
- **Database connection fails**: Verify DATABASE_URL is correct
- **CORS errors**: Make sure CORS_ALLOWED_ORIGINS includes your Vercel URL

### Frontend Issues
- **API calls fail**: Check VITE_API_URL is set correctly
- **Build fails**: Make sure all dependencies are in package.json
- **404 errors**: Check vercel.json rewrite rules

---

## Notes
- Render free tier spins down after 15 minutes of inactivity (first request will be slow)
- Vercel has excellent free tier with no spin-down
- Both services auto-deploy on git push (if configured)

