[CmdletBinding()]
param(
    [string]$Message,
    [switch]$SkipValidation,
    [switch]$NoPush
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")
Set-Location -LiteralPath $RepoRoot

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [string[]]$ArgumentList = @()
    )

    $PreviousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        & $FilePath @ArgumentList
        $ExitCode = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $PreviousErrorActionPreference
    }

    if ($ExitCode -ne 0) {
        throw "$FilePath $($ArgumentList -join ' ') failed with exit code $ExitCode"
    }
}

function Invoke-Capture {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [string[]]$ArgumentList = @()
    )

    $PreviousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        $Output = & $FilePath @ArgumentList 2>$null
        $ExitCode = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $PreviousErrorActionPreference
    }

    if ($ExitCode -ne 0) {
        return $null
    }

    return (($Output | Out-String).Trim())
}

function Test-RemoteBranch {
    param([Parameter(Mandatory = $true)][string]$BranchName)

    & git show-ref --verify --quiet "refs/remotes/origin/$BranchName"
    return $LASTEXITCODE -eq 0
}

$InsideWorkTree = Invoke-Capture git @("rev-parse", "--is-inside-work-tree")
if ($InsideWorkTree -ne "true") {
    throw "This script must run inside a git work tree."
}

$RemoteUrl = Invoke-Capture git @("remote", "get-url", "origin")
if ($RemoteUrl -notmatch "FSGER9326[/\\]Gravesmoke(\.git)?$") {
    throw "Origin does not point at FSGER9326/Gravesmoke: $RemoteUrl"
}

$Branch = Invoke-Capture git @("branch", "--show-current")
if ([string]::IsNullOrWhiteSpace($Branch)) {
    throw "Detached HEAD is not safe to auto-sync. Switch to main or a task branch first."
}

$ConflictedFiles = Invoke-Capture git @("diff", "--name-only", "--diff-filter=U")
if (-not [string]::IsNullOrWhiteSpace($ConflictedFiles)) {
    throw "Resolve merge conflicts before syncing: $ConflictedFiles"
}

Invoke-Checked git @("fetch", "--prune", "origin")

$RemoteBranchExists = Test-RemoteBranch -BranchName $Branch
$StatusBeforePull = Invoke-Capture git @("status", "--porcelain=v1")

if ($RemoteBranchExists) {
    $LocalCommit = Invoke-Capture git @("rev-parse", $Branch)
    $RemoteCommit = Invoke-Capture git @("rev-parse", "origin/$Branch")
    $MergeBase = Invoke-Capture git @("merge-base", $Branch, "origin/$Branch")

    if ($LocalCommit -eq $MergeBase -and $RemoteCommit -ne $MergeBase) {
        if (-not [string]::IsNullOrWhiteSpace($StatusBeforePull)) {
            throw "Remote branch has new commits and the working tree has local changes. Pull manually before auto-syncing."
        }

        Invoke-Checked git @("pull", "--ff-only")
    } elseif ($LocalCommit -ne $MergeBase -and $RemoteCommit -ne $MergeBase) {
        throw "Local branch and origin/$Branch have diverged. Resolve manually before auto-syncing."
    }
}

if (-not $SkipValidation) {
    Invoke-Checked npm @("run", "validate")
}

$Status = Invoke-Capture git @("status", "--porcelain=v1")
if (-not [string]::IsNullOrWhiteSpace($Status)) {
    Invoke-Checked git @("add", "-A")

    $StagedFiles = Invoke-Capture git @("diff", "--cached", "--name-only")
    if (-not [string]::IsNullOrWhiteSpace($StagedFiles)) {
        if ([string]::IsNullOrWhiteSpace($Message)) {
            $Timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss")
            $Message = "autosync: $Timestamp UTC"
        }

        Invoke-Checked git @("commit", "-m", $Message)
    }
} else {
    Write-Host "No local changes to commit."
}

if ($NoPush) {
    Write-Host "NoPush was set; leaving local commits unpushed."
    exit 0
}

if ($RemoteBranchExists) {
    Invoke-Checked git @("push", "origin", $Branch)
} else {
    Invoke-Checked git @("push", "-u", "origin", $Branch)
}

Write-Host "GitHub sync complete for branch $Branch."
