#!/usr/bin/env bash
# Instala los plugins de Claude Code que se usaron en este proyecto.
# Uso: bash scripts/setup-claude.sh
set -e

if ! command -v claude >/dev/null 2>&1; then
  echo "No encuentro el comando 'claude'. Instala Claude Code primero: https://claude.com/claude-code"
  exit 1
fi

echo "== Añadiendo marketplaces =="
claude plugin marketplace add anthropics/claude-plugins-official || true
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill || true

echo "== Instalando plugins =="
for p in \
  "ui-ux-pro-max@ui-ux-pro-max-skill" \
  "playwright@claude-plugins-official" \
  "frontend-design@claude-plugins-official" \
  "superpowers@claude-plugins-official"
do
  echo "-> $p"
  claude plugin install "$p" || echo "   (falló $p, instálalo a mano con: claude plugin install $p)"
done

echo
echo "Listo. Cierra y vuelve a abrir Claude Code."
echo "Comprueba con: claude plugin list"
