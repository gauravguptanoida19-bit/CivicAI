Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "             Starting CivicAI Platform                    " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Starting Backend on http://localhost:3001..." -ForegroundColor Yellow

$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -PassThru

Start-Sleep -Seconds 3

Write-Host "Starting Frontend on http://localhost:5173..." -ForegroundColor Yellow
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -PassThru

Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "CivicAI is launching!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend:  http://localhost:3001/api/health" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
