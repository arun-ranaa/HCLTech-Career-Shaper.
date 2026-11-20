@echo off
echo =====================================================================
echo  Launching Full Stack Grants Management System (J18)
echo =====================================================================
echo 1. Starting Backend in new window...
start "GMS Backend (Spring Boot)" cmd /k "run-backend.bat"

echo 2. Starting Frontend in new window...
start "GMS Frontend (Angular / Web)" cmd /k "run-frontend.bat"

echo.
echo Both servers are launching:
echo  - Backend API: http://localhost:8082/api/v1
echo  - H2 Database Console: http://localhost:8082/h2-console
echo  - Frontend Portal: http://localhost:4200
echo.
pause
