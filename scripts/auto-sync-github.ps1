[CmdletBinding()]
param(
    [int]$IntervalSeconds = 300,
    [switch]$SkipValidation
)

$ErrorActionPreference = "Stop"

if ($IntervalSeconds -lt 60) {
    throw "Use an interval of at least 60 seconds."
}

Write-Host "Starting Gravesmoke GitHub auto-sync every $IntervalSeconds seconds."
Write-Host "Press Ctrl+C to stop."

while ($true) {
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$Timestamp] Checking for changes..."

    try {
        $Arguments = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", (Join-Path $PSScriptRoot "sync-github.ps1"))
        if ($SkipValidation) {
            $Arguments += "-SkipValidation"
        }

        & powershell @Arguments
    } catch {
        Write-Warning $_.Exception.Message
    }

    Start-Sleep -Seconds $IntervalSeconds
}
