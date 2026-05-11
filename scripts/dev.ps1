[CmdletBinding()]
param(
    [int]$Port = 8080,
    [string]$HostName = "127.0.0.1",
    [switch]$SkipValidation
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")
Set-Location -LiteralPath $RepoRoot

if (-not $SkipValidation) {
    npm run validate
    if ($LASTEXITCODE -ne 0) {
        throw "Validation failed. Fix validation errors before testing the game."
    }
}

Write-Host "Starting Gravesmoke Road from $RepoRoot"
node tools/serve-static.js --host $HostName --port $Port
