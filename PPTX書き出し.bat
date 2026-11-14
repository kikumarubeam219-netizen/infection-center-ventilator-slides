@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo 初回のみ必要なパッケージをインストールします...
  call npm install
)
node export_pptx.mjs
pause
