@echo off
echo Starting StockSense application...

REM Start all services
docker-compose up --build

echo Application stopped.
pause