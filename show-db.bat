@echo off
title Oracle Database - Grants Management System
cls
echo =====================================================================
echo   Fetching Live Applications from Oracle Database XE
echo =====================================================================
echo.
sqlplus -S / as sysdba @database\show_applications.sql
echo.
pause
