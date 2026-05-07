# Free local dev ports often used by Next.js (3000-3006). Run in PowerShell as Administrator if processes resist.
$ports = 3000..3006
foreach ($p in $ports) {
  Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue |
    ForEach-Object {
      try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
    }
}
Write-Host "Done. Ports 3000-3006 cleared (best effort)."
