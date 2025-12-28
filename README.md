# Web Crawler Dashboard

A full-stack web crawler application with React frontend and Spring Boot backend.

## Features

- **Authentication**: JWT-based user authentication
- **Dashboard**: Overview of crawl statistics
- **Start Crawl**: Configure and start web crawling jobs
- **Live Monitor**: Real-time crawl progress monitoring
- **Graph View**: Visual representation of crawled links
- **Analytics**: Detailed crawl analytics and reports

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Recharts (charts)
- Framer Motion (animations)
- D3 Force (graph visualization)

### Backend
- Spring Boot 3.3.5
- Spring Security
- Spring Data JPA
- H2 Database (development)
- JWT Authentication
- Maven

## Local Development

### Prerequisites
- Java 17+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs on: http://localhost:8080

### Frontend Setup
```bash
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

## Environment Variables

### Backend
- `JWT_SECRET_KEY`: JWT signing secret
- `CORS_ORIGINS`: Allowed CORS origins
- `PORT`: Server port (default: 8080)

### Frontend
- `VITE_API_URL`: Backend API URL

## Deployment

### Render (Free)
1. Push to GitHub
2. Create Web Service for backend
3. Create Static Site for frontend
4. Set environment variables

### Environment Variables for Production
```
# Backend
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=https://your-frontend-domain.com

# Frontend
VITE_API_URL=https://your-backend-domain.com/api/crawl
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/validate` - Token validation

### Crawl Operations
- `POST /api/crawl/start` - Start crawl job
- `GET /api/crawl/summary` - Dashboard statistics
- `GET /api/crawl/live` - Live crawl status
- `GET /api/crawl/logs` - Crawl logs
- `GET /api/crawl/graph` - Graph data
- `GET /api/crawl/analytics` - Analytics data
- `GET /api/crawl/health` - Health check

## License

MIT License