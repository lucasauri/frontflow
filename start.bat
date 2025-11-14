@echo off
echo ========================================
echo    HORTIFLOW - SISTEMA DE GESTAO
echo ========================================




echo [3/3] Iniciando aplicacao...
echo Backend: http://localhost:8080/api
echo Frontend: http://localhost:3000
echo.

start "Backend" cmd /k "cd ..\backend && mvn spring-boot:run"
timeout /t 10 /nobreak >nul
start "Frontend" cmd /k "npm run dev"

echo.
echo ✓ Sistema iniciado com sucesso!
echo Acesse: http://localhost:3000
pause
