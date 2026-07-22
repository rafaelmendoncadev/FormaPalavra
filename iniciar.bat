@echo off
setlocal
cd /d "%~dp0"

set PORT=8000

echo Iniciando o Jogo das Silabas...

REM Verifica se o Python esta instalado
where python >nul 2>nul
if errorlevel 1 (
    echo.
    echo ERRO: Python nao encontrado. Instale o Python (https://www.python.org)
    echo e marque a opcao "Add Python to PATH" na instalacao.
    pause
    exit /b 1
)

REM Se ja houver um servidor nessa porta, nao sobe outro
netstat -ano | findstr /R ":8000.*LISTENING" >nul
if not errorlevel 1 (
    echo Servidor ja esta rodando em http://localhost:%PORT%
    start "" "http://localhost:%PORT%/index.html"
    exit /b 0
)

REM Inicia o servidor numa janela SEPARADA (nao minimizada) para garantir
REM que o processo Python continue vivo enquanto esta janela fecha.
start "JogoSilabas-Servidor (porta %PORT%)" cmd /c "python -m http.server %PORT%"
echo Aguardando o servidor subir...

REM Espera o servidor responder HTTP 200 (ate 10 segundos)
set /a TENTATIVAS=0
:esperar
set /a TENTATIVAS+=1
powershell -NoProfile -Command "try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://localhost:%PORT%/index.html).StatusCode } catch { 0 }" >temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt >nul 2>nul
if "%STATUS%"=="200" goto :abrir
if %TENTATIVAS% GEQ 10 (
    echo.
    echo ERRO: O servidor nao respondeu apos 10 segundos.
    echo Tente abrir manualmente: http://localhost:%PORT%/index.html
    pause
    exit /b 1
)
timeout /t 1 /nobreak >nul
goto :esperar

:abrir
echo Servidor pronto. Abrindo o navegador...
start "" "http://localhost:%PORT%/index.html"
echo.
echo O jogo esta rodando. Pode fechar esta janela.
echo Para parar o servidor depois, feche a janela "JogoSilabas-Servidor (porta %PORT%)".
timeout /t 3 /nobreak >nul
