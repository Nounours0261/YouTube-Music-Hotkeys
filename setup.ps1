Write-Host "=== YouTube Music Hotkeys Setup ===" -ForegroundColor Red
$extId = Read-Host "Enter the Chrome extension ID"


$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$setupDir = [System.IO.Path]::Combine($baseDir, "setup")
$manifestPath = [System.IO.Path]::Combine($baseDir, "setup", "ytmh.keyboard.json")
$batPath = [System.IO.Path]::Combine($baseDir, "setup", "native_handler.bat")
$pyPath = [System.IO.Path]::Combine($baseDir, "src", "keyboard_handler.py")


Write-Host "Creating setup files"

New-Item -ItemType Directory -Path $setupDir -Force | Out-Null
$batContent = "@echo off`npython `"$pyPath`""
Set-Content -Path $batPath -Value $batContent -Encoding Ascii
$manifestContent = @{
    name = "ytmh.keyboard"
    description = "Native Messaging handler for YouTube Music Hotkeys"
    path = $batPath
    type = "stdio"
    allowed_origins = @("chrome-extension://$extId/")
} | ConvertTo-Json -Depth 3
Set-Content -Path $manifestPath -Value $manifestContent -Encoding Ascii


Write-Host "Adding registry key"

$regPath = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\ytmh.keyboard"
New-Item -Path $regPath -Force | Out-Null
Set-ItemProperty -Path $regPath -Name "(default)" -Value $manifestPath


Write-Host "The Native Messaging host has been registered successfully !" -ForegroundColor Green
Write-Host "You can now reload Chrome and enjoy your music !"
Read-Host "Press Enter to exit"
