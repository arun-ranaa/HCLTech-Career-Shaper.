@echo off
echo =====================================================================
echo  Starting Grants Management System - Spring Boot Backend (Port 8080)
echo =====================================================================
cd backend
if exist mvnw.cmd (
    call mvnw.cmd spring-boot:run
) else (
    mvn spring-boot:run
)
pause
