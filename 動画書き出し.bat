@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ==========================================================
echo  感染症センター 人工呼吸器勉強会
echo  スピーカーノート付き MP4動画 自動書き出しツール
echo ==========================================================
echo.
echo [1/2] 必要なパッケージを確認しています...
if not exist "node_modules\ffmpeg-static" (
  call npm install
)
echo.
echo [2/2] 全スライドの音声合成と画面録画を開始します...
echo ※全42枚分の録画を行うため、再生時間と同じ約20〜30分ほどかかります。
echo   途中で中断しても、次回は音声キャッシュを利用して続きから高速実行できます。
echo.
node export_video.mjs
echo.
pause
