# Maktaba Jamaat e Islami — GitHub Push Script
# GitHub username: Abdul-Samad56
# Run AFTER installing Git: https://git-scm.com/download/win

$ErrorActionPreference = "Stop"
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

$repoName = "maktaba-jamaat-faisalabad"
$githubUser = "Abdul-Samad56"
$remoteUrl = "https://github.com/$githubUser/$repoName.git"

Write-Host "Project: $projectPath" -ForegroundColor Cyan
Write-Host "GitHub:  https://github.com/$githubUser/$repoName" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git install nahi hai!" -ForegroundColor Red
    Write-Host "Pehle install karein: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Install ke baad PowerShell band karke dubara kholen." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

git add .
git status

$hasChanges = git diff --cached --quiet; $exitCode = $LASTEXITCODE
if ($exitCode -ne 0) {
    git commit -m "Maktaba Jamaat e Islami Faisalabad — Islamic books website"
} else {
    Write-Host "Koi nayi changes nahi — commit skip." -ForegroundColor Yellow
}

$remotes = git remote 2>$null
if ($remotes -notcontains "origin") {
    git remote add origin $remoteUrl
} else {
    git remote set-url origin $remoteUrl
}

Write-Host ""
Write-Host "Ab GitHub par pehle repo banayein (agar nahi bana):" -ForegroundColor Green
Write-Host "  1. https://github.com/new" -ForegroundColor White
Write-Host "  2. Repository name: $repoName" -ForegroundColor White
Write-Host "  3. Public select karein — README mat add karein" -ForegroundColor White
Write-Host "  4. Create repository" -ForegroundColor White
Write-Host ""
Read-Host "Repo banane ke baad Enter dabayein"

git push -u origin main

Write-Host ""
Write-Host "Done! Repo URL:" -ForegroundColor Green
Write-Host "  https://github.com/$githubUser/$repoName" -ForegroundColor Cyan
Write-Host ""
Write-Host "Agla qadam: DEPLOY.md dekhein — Render + Vercel deploy" -ForegroundColor Yellow
