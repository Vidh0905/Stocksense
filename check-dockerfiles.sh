#!/bin/bash

echo "Checking Dockerfile configurations..."

# Check backend Dockerfile
echo "Checking backend Dockerfile..."
if grep -q "npm install" backend/Dockerfile; then
  echo "✓ Backend Dockerfile uses npm install"
else
  echo "✗ Backend Dockerfile does not use npm install"
fi

# Check frontend Dockerfile
echo "Checking frontend Dockerfile..."
if grep -q "npm install" frontend/Dockerfile; then
  echo "✓ Frontend Dockerfile uses npm install"
else
  echo "✗ Frontend Dockerfile does not use npm install"
fi

# Check ml-service Dockerfile
echo "Checking ml-service Dockerfile..."
if [ -f ml-service/Dockerfile ]; then
  echo "✓ ML Service Dockerfile exists"
else
  echo "✗ ML Service Dockerfile not found"
fi

echo "Dockerfile check complete!"