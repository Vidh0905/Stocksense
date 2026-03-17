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