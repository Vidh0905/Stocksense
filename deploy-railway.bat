@echo off
echo Preparing StockSense for Railway deployment...

REM Create .env files if they don't exist
if not exist backend\.env (
  echo Creating backend .env file...
  copy backend\.env.example backend\.env >nul 2>&1 || (
    echo MONGODB_URI=mongodb://mongo:27017/stocksense> backend\.env
    echo REDIS_URL=redis://redis:6379>> backend\.env
    echo JWT_SECRET=stocksense_secret_key>> backend\.env
    echo ML_SERVICE_URL=http://ml-service:8000>> backend\.env
    echo ALPHA_VANTAGE_KEY=demo>> backend\.env
    echo NEWS_API_KEY=demo>> backend\.env
    echo VITE_API_URL=http://localhost:5000/api/v1>> backend\.env
  )
)

if not exist frontend\.env (
  echo Creating frontend .env file...
  copy frontend\.env.example frontend\.env >nul 2>&1 || (
    echo VITE_API_URL=http://localhost:5000/api/v1> frontend\.env
  )
)

if not exist ml-service\.env (
  echo Creating ml-service .env file...
  type NUL > ml-service\.env
)

echo StockSense is ready for Railway deployment!
echo Follow the instructions in README.md to deploy to Railway.
pause