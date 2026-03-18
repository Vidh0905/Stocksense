#!/bin/bash

echo "Preparing StockSense for Railway deployment..."

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
  echo "Creating backend .env file..."
  cp backend/.env.example backend/.env 2>/dev/null || echo "MONGODB_URI=mongodb://mongo:27017/stocksense
REDIS_URL=redis://redis:6379
JWT_SECRET=stocksense_secret_key
ML_SERVICE_URL=http://ml-service:8000
ALPHA_VANTAGE_KEY=demo
NEWS_API_KEY=demo
VITE_API_URL=http://localhost:5000/api/v1" > backend/.env
fi

if [ ! -f frontend/.env ]; then
  echo "Creating frontend .env file..."
  cp frontend/.env.example frontend/.env 2>/dev/null || echo "VITE_API_URL=http://localhost:5000/api/v1" > frontend/.env
fi

if [ ! -f ml-service/.env ]; then
  echo "Creating ml-service .env file..."
  touch ml-service/.env
fi

echo "StockSense is ready for Railway deployment!"
echo "Follow the instructions in README.md to deploy to Railway."