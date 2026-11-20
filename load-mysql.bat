@echo off
title Load Grants Database into MySQL
cls
echo =====================================================================
echo   Importing Grants Database into MySQL Server (for MySQL Workbench)
echo =====================================================================
echo.
echo Please enter your MySQL root password when prompted (or press Enter if blank):
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < database\mysql_schema.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================================
    echo  SUCCESS: Database 'grants_management' loaded successfully!
    echo  You can now open MySQL Workbench to view the 'applications' table.
    echo =====================================================================
) else (
    echo.
    echo =====================================================================
    echo  Could not connect. Please check your MySQL password or open
    echo  database\mysql_schema.sql directly inside MySQL Workbench.
    echo =====================================================================
)
echo.
pause
