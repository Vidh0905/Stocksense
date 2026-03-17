#!/bin/bash

echo "Initializing StockSense project..."

# Create necessary directories
mkdir -p mongo-data redis-data

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install ML service dependencies
echo "Installing ML service dependencies..."
cd ml-service
pip install -r requirements.txt
cd ..

echo "Project initialization complete!"
echo "To start the application, run: docker-compose up --build"