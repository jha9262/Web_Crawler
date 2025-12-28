# Quick Deployment Guide

## 🚀 Deploy Backend to Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/web-crawl.git
git push -u origin main
```

### Step 2: Create Render Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Settings:
   - **Name**: `web-crawl-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`

### Step 3: Add Environment Variables in Render
```
DATABASE_URL=jdbc:postgresql://ep-dry-rice-a4nwjq20-pooler.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_nVaOAyTfB29D
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Note**: Update `CORS_ALLOWED_ORIGINS` after you get your Vercel URL!

### Step 4: Get Backend URL
After deployment, you'll get: `https://web-crawl-backend.onrender.com`

---

## 🎨 Deploy Frontend to Vercel

### Step 1: Deploy
1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Add Environment Variable
Go to **Settings** → **Environment Variables**:
```
VITE_API_URL=https://your-backend.onrender.com/api/crawl
```

Replace `your-backend.onrender.com` with your actual Render URL!

### Step 3: Redeploy
After adding env var, trigger a new deployment.

---

## ✅ Final Steps

1. **Update CORS in Render**: Add your Vercel URL to `CORS_ALLOWED_ORIGINS`
2. **Restart Render service** to apply CORS changes
3. **Test your deployed app!**

---

## 📝 Important Notes

- Render free tier spins down after 15 min (first request will be slow)
- Vercel has instant cold starts
- Both auto-deploy on git push
- Keep your Neon database credentials secure!

