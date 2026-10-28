<#
.SYNOPSIS
    Cancels the automatic AWS destruction scheduled task.
#>

$TaskName = "Zestora_AWS_AutoDestroy"

Write-Host "Checking for scheduled task: $TaskName..." -ForegroundColor Cyan

$ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($ExistingTask) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "✅ Auto-destruction task '$TaskName' has been CANCELLED successfully." -ForegroundColor Green
    Write-Host "Your AWS resources will NOT be automatically deleted." -ForegroundColor White
} else {
    Write-Host "ℹ️ No active auto-destruction task named '$TaskName' was found." -ForegroundColor Yellow
}

