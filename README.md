# StockSense - AI-Powered Stock Prediction App

## Prerequisites

Before running the application, ensure you have the following installed:
- Docker and Docker Compose
- Node.js (for local development)
- Python 3.9+ (for local development)

## Running with Docker (Recommended)

1. Install Docker Desktop for Windows from https://www.docker.com/products/docker-desktop

2. Open a terminal in the project directory

3. Run the application:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - ML Service: http://localhost:8000

## Deploying to Railway

### Method 1: Deploy Individual Services (Recommended)

1. Create a new project on Railway (https://railway.app/)

2. Deploy MongoDB:
   - Add a new service
   - Choose "MongoDB" from the template gallery
   - Configure as needed

3. Deploy Redis:
   - Add a new service
   - Choose "Redis" from the template gallery
   - Configure as needed

4. Deploy Backend:
   - Add a new service
   - Select the backend directory
   - Railway will automatically detect and use the Dockerfile
   - Set environment variables:
     - MONGODB_URI=mongodb://your-mongodb-url
     - REDIS_URL=redis://your-redis-url
     - JWT_SECRET=your-secret-key
     - ML_SERVICE_URL=https://your-ml-service-url
     - ALPHA_VANTAGE_KEY=your-key (optional)
     - NEWS_API_KEY=your-key (optional)

5. Deploy ML Service:
   - Add a new service
   - Select the ml-service directory
   - Railway will automatically detect and use the Dockerfile

6. Deploy Frontend:
   - Add a new service
   - Select the frontend directory
   - Railway will automatically detect and use the Dockerfile
   - Set environment variables:
     - VITE_API_URL=https://your-backend-url

### Method 2: Deploy with Docker Compose

Railway also supports deploying entire docker-compose.yml files:
1. Create a new project on Railway
2. Connect your GitHub repository
3. Select the docker-compose.yml file
4. Configure environment variables as needed

## Local Development Setup

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### ML Service
```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

## Environment Variables

Copy `.env.example` to `.env` in each service directory and update the values as needed.

## Health Checks

Each service includes health check endpoints:
- Backend: http://localhost:5000/health
- ML Service: http://localhost:8000/health
- Frontend: http://localhost:3000/health

## Project Structure

- `backend/` - Node.js Express API
- `frontend/` - React + Vite frontend
- `ml-service/` - Python FastAPI ML service
- `docker-compose.yml` - Docker orchestration
- `README.md` - This file

## Features

- Real-time stock data visualization
- AI-powered price predictions
- News sentiment analysis
- Technical indicator calculations
- User authentication and watchlists
- Responsive dashboard with dark theme