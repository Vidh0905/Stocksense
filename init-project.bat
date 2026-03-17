@echo off
echo Initializing StockSense project...

REM Create necessary directories
mkdir mongo-data redis-data

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
npm install
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Install ML service dependencies
echo Installing ML service dependencies...
cd ml-service
pip install -r requirements.txt
cd ..

echo Project initialization complete!
echo To start the application, run: docker-compose up --build
pause