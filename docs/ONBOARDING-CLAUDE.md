# Abrir este proyecto en Claude Code (en otro computador)

Guía para empezar a trabajar en la web de Agosan con el mismo entorno con el que se construyó.

## 1. Clonar el proyecto

```bash
git clone https://github.com/mxp09/agosan.net.git
```

Si vas a llevarlo a tu propio repositorio:

```bash
cd agosan.net
git remote set-url origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Necesitas [Git](https://git-scm.com/), [Node.js](https://nodejs.org/) (para las herramientas de prueba) y [Claude Code](https://claude.com/claude-code).

## 2. Instalar los plugins y skills

Desde la carpeta del proyecto:

**Windows (PowerShell):**

```powershell
./scripts/setup-claude.ps1
```

**macOS o Linux:**

```bash
bash scripts/setup-claude.sh
```

El script añade los marketplaces e instala los plugins. Después, **cierra y vuelve a abrir Claude Code** para que los detecte.

Comprobar que quedaron instalados:

```bash
claude plugin list
```

## 3. Qué instala y para qué

| Plugin | Origen | Para qué se usó |
|---|---|---|
| `ui-ux-pro-max` | github: nextlevelbuilder/ui-ux-pro-max-skill | Dirección de diseño, paletas, tipografías y reglas de UX |
| `playwright` | github: anthropics/claude-plugins-official | Capturas en móvil, tablet y escritorio, y pruebas de teclado |
| `frontend-design` | github: anthropics/claude-plugins-official | Criterio visual al crear interfaces |
| `superpowers` | github: anthropics/claude-plugins-official | Flujos de trabajo (lluvia de ideas, depuración sistemática, verificación) |

Skills incluidas en el propio repositorio, en `.claude/skills/`, disponibles sin instalar nada:

| Skill | Licencia | Para qué se usó |
|---|---|---|
| `no-ai-slop` | MIT (ver su carpeta) | Evitar textos con pinta de generados por IA |

Comandos de Claude Code que se usaron y ya vienen incluidos: `/code-review` (revisión de errores) y `/security-review` (revisión de seguridad).

### Skills que no están en el repositorio

`animate` y `design-taste-frontend` son de otros autores y no traen licencia, así que no se republican aquí. Si las tienes, van en `~/.claude/skills/<nombre>/`. Si no, no pasa nada: las reglas que aplicaron ya están escritas en `CLAUDE.md` y en `docs/HISTORIAL.md`.

## 4. Trabajar

```bash
npx serve .
```

Abre la dirección que aparece en el navegador. Claude Code lee `CLAUDE.md` al arrancar, así que ya conoce el proyecto y sus reglas.

Frases útiles para empezar:

- "Lee CLAUDE.md y docs/HISTORIAL.md y dime en qué estado está la web."
- "Usa la skill ui-ux-pro-max y revisa la sección de contacto."
- "/code-review high"
- "Haz una captura en móvil y escritorio con Playwright y revisa si algo se desborda."

## 5. Publicar

El sitio son archivos estáticos: sirve con subirlos a GitHub Pages, Cloudflare Pages, Netlify o cualquier hosting.

En GitHub Pages: **Settings → Pages → Source: Deploy from a branch → main / (root)**.

Con Cloudflare Pages o Netlify, el archivo `_headers` añade además las cabeceras de seguridad (HSTS, protección contra iframes y demás).
