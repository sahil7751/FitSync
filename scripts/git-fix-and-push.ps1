# Safe Git cleanup, restore, commit and push for FitSync
# Run from the repository root (script sets location explicitly)

Set-Location -Path "F:\FitSync"
Write-Host "[1/8] Checking for running git processes..."
$gitProcs = Get-Process -Name git -ErrorAction SilentlyContinue
if ($gitProcs) {
  Write-Host "ERROR: Found running git processes. Close them (VSCode/Git GUI) and re-run this script." -ForegroundColor Red
  exit 1
}

Write-Host "[2/8] Removing stale index.lock if present..."
if (Test-Path .git\index.lock) {
  Remove-Item -Force .git\index.lock
  Write-Host "Removed .git/index.lock"
} else {
  Write-Host "No .git/index.lock found"
}

Write-Host "[3/8] Restoring deleted files from HEAD (if any)..."
# Try git restore, fallback to checkout for older Git
git restore --source=HEAD --staged --worktree .gitignore FEATURES_CHECKLIST.md QUICK_START.md README.md test-api.http 2>$null
if ($LASTEXITCODE -ne 0) {
  git checkout -- .gitignore FEATURES_CHECKLIST.md QUICK_START.md README.md test-api.http 2>$null
}

Write-Host "[4/8] Writing/ensuring .gitignore contains recommended entries..."
@"
# Dependencies
node_modules/
client/node_modules/

# Environment variables
.env
client/.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Production build
client/build/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
"@ | Out-File -Encoding utf8 .gitignore

Write-Host "[5/8] Staging changes..."
git add .gitignore
git add .

Write-Host "[6/8] Committing changes (if any)..."
git commit -m "Restore docs and .gitignore; update client env and startup scripts" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "Nothing to commit or commit failed (status code: $LASTEXITCODE)" }

Write-Host "[7/8] Stop tracking client/.env (if it was tracked)..."
git rm --cached client/.env 2>$null
if ($LASTEXITCODE -eq 0) {
  git commit -m "Stop tracking client/.env" 2>$null
  Write-Host "client/.env removed from index and committed"
} else {
  Write-Host "client/.env was not tracked (no action)"
}

Write-Host "[8/8] Pushing to origin/main..."
git push -u origin main

Write-Host "All done. Check GitHub to confirm the pushed commits." -ForegroundColor Green
