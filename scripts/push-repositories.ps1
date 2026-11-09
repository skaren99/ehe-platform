param([string]$Owner = 'skaren99', [switch]$Push)
$ErrorActionPreference = 'Stop'
if ($Owner -notmatch '^[a-zA-Z0-9][a-zA-Z0-9-]*$') { throw 'Use a GitHub username or organisation name.' }
$platformRoot = Split-Path $PSScriptRoot -Parent
$repos = Get-Content -LiteralPath (Join-Path $platformRoot 'repositories.json') -Raw | ConvertFrom-Json
# Preflight every repository before making any remote changes.
foreach ($repo in $repos) {
  $directory = [IO.Path]::GetFullPath((Join-Path $platformRoot $repo.directory))
  $status = & git -C $directory status --porcelain
  if ($LASTEXITCODE -ne 0 -or $status) { throw "Repository is missing or dirty: $($repo.name)" }
  & git -C $directory rev-parse --verify HEAD *> $null
  if ($LASTEXITCODE -ne 0) { throw "No initial commit: $($repo.name)" }
  $expected = @("https://github.com/$Owner/$($repo.name).git", "git@github.com:$Owner/$($repo.name).git")
  $remoteNames = & git -C $directory remote
  if ($remoteNames -contains 'origin') {
    $existing = & git -C $directory remote get-url origin
    if ($expected -notcontains $existing) { throw "Unexpected origin in $($repo.name); review it manually." }
  }
}
foreach ($repo in $repos) {
  $directory = [IO.Path]::GetFullPath((Join-Path $platformRoot $repo.directory))
  $url = "https://github.com/$Owner/$($repo.name).git"
  $remoteNames = & git -C $directory remote
  if ($remoteNames -contains 'origin') { $url = & git -C $directory remote get-url origin }
  if (-not $Push) { Write-Output "Would push $($repo.name) to $url"; continue }
  if ($remoteNames -notcontains 'origin') { & git -C $directory remote add origin $url; if ($LASTEXITCODE -ne 0) { throw 'Could not add origin.' } }
  & git -C $directory push -u origin main
  if ($LASTEXITCODE -ne 0) { throw "Push failed for $($repo.name). Existing remotes and remote history were not overwritten." }
}
