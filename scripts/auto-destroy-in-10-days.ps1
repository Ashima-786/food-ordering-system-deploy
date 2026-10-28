<#
.SYNOPSIS
    Schedules automatic destruction of all AWS resources after 10 days on Windows.
.DESCRIPTION
    Creates a Windows Scheduled Task that automatically triggers 'terraform destroy -auto-approve'
    exactly 10 days from now, ensuring you never get billed if you forget about the project.
.EXAMPLE
    .\scripts\auto-destroy-in-10-days.ps1
    .\scripts\auto-destroy-in-10-days.ps1 -Days 7
#>

param(
    [int]$Days = 10
)

$TaskName = "Zestora_AWS_AutoDestroy"
$ProjectDir = (Get-Item $PSScriptRoot).Parent.FullName
$TerraformDir = Join-Path $ProjectDir "terraform"
$LogFile = Join-Path $ProjectDir "teardown.log"

# Calculate target destruction date & time
$TargetDate = (Get-Date).AddDays($Days)
$FormattedDate = $TargetDate.ToString("yyyy-MM-dd HH:mm:ss")

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ⏰ ZESTORA AWS AUTO-DESTRUCTION SCHEDULER" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Project Directory : $ProjectDir"
Write-Host " Terraform Folder  : $TerraformDir"
Write-Host " Current Time      : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host " Teardown Date     : $FormattedDate ($Days days from now)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Create scheduled task action
$ActionScript = "Set-Location '$TerraformDir'; terraform destroy -auto-approve *>> '$LogFile'"
$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -NoProfile -Command `"$ActionScript`""
$Trigger = New-ScheduledTaskTrigger -Once -At $TargetDate

try {
    # Register the task in Windows Task Scheduler
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Description "Auto-destroys AWS resources for Zestora after $Days days" -Force | Out-Null

    Write-Host "✅ SUCCESS: Auto-destruction task has been scheduled!" -ForegroundColor Green
    Write-Host ""
    Write-Host "On $FormattedDate, your computer will automatically execute:" -ForegroundColor White
    Write-Host "  terraform destroy -auto-approve" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "Teardown logs will be saved to:" -ForegroundColor White
    Write-Host "  $LogFile" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "👉 If you want to CANCEL this auto-destruction timer anytime, run:" -ForegroundColor Yellow
    Write-Host "   .\scripts\cancel-auto-destroy.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "👉 If you want to DESTROY EVERYTHING RIGHT NOW manually, run:" -ForegroundColor Yellow
    Write-Host "   cd terraform; terraform destroy -auto-approve" -ForegroundColor White
    Write-Host "==========================================================" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Failed to register scheduled task: $_" -ForegroundColor Red
    Write-Host "Make sure to run PowerShell as Administrator if permission is denied." -ForegroundColor Yellow
}

