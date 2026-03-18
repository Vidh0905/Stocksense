@echo off
echo Checking Dockerfile configurations...

REM Check backend Dockerfile
echo Checking backend Dockerfile...
findstr /C:"npm install" backend\Dockerfile >nul
if %errorlevel% == 0 (
  echo ✓ Backend Dockerfile uses npm install
) else (
  echo ✗ Backend Dockerfile does not use npm install
)

REM Check frontend Dockerfile
echo Checking frontend Dockerfile...
findstr /C:"npm install" frontend\Dockerfile >nul
if %errorlevel% == 0 (
  echo ✓ Frontend Dockerfile uses npm install
) else (
  echo ✗ Frontend Dockerfile does not use npm install
)

REM Check ml-service Dockerfile
echo Checking ml-service Dockerfile...
if exist ml-service\Dockerfile (
  echo ✓ ML Service Dockerfile exists
) else (
  echo ✗ ML Service Dockerfile not found
)

echo Dockerfile check complete!
pause