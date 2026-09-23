# Instala los plugins de Claude Code que se usaron en este proyecto.
# Uso: ./scripts/setup-claude.ps1

if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
  Write-Host "No encuentro el comando 'claude'. Instala Claude Code primero: https://claude.com/claude-code"
  exit 1
}

Write-Host "== Anadiendo marketplaces =="
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill

Write-Host "== Instalando plugins =="
$plugins = @(
  "ui-ux-pro-max@ui-ux-pro-max-skill",
  "playwright@claude-plugins-official",
  "frontend-design@claude-plugins-official",
  "superpowers@claude-plugins-official"
)
foreach ($p in $plugins) {
  Write-Host "-> $p"
  claude plugin install $p
  if (-not $?) { Write-Host "   (fallo $p, instalalo a mano con: claude plugin install $p)" }
}

Write-Host ""
Write-Host "Listo. Cierra y vuelve a abrir Claude Code."
Write-Host "Comprueba con: claude plugin list"
