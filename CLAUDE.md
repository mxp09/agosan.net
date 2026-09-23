# Contexto del proyecto: agosan.net

Este archivo lo lee Claude Code al abrir el proyecto. Resume qué es, cómo está hecho y qué reglas seguir.

## Qué es

Web de **Agosan**, empresa de sistemas contra incendios en Ciudad de Panamá: mantenimiento de extintores NFPA10, prueba hidrostática DOT CFR 49, recarga y certificación.

- Publicada en https://mxp09.github.io/agosan.net/
- Dominio propio: agosan.net (todavía apunta a la web antigua, hecha con Trickle)
- Repositorio: https://github.com/mxp09/agosan.net

Es un rediseño de la web original. **El contenido y las fotos son los mismos que tenía la empresa**; lo que cambió es el diseño, el SEO, el rendimiento y la seguridad. Si hay que tocar textos técnicos (años de prueba hidrostática, pasos de recarga, normas), confirma el dato con el cliente antes de cambiarlo.

## Stack

HTML, CSS y JavaScript sin frameworks, sin compilación y sin dependencias en tiempo de ejecución. Se sirve como archivos estáticos. Ver el `README.md` para la estructura de carpetas y los cambios habituales.

Probar en local:

```bash
npx serve .
```

## Reglas del proyecto

1. **Sin dependencias ni build.** Nada de React, Tailwind ni bundlers. Si algo se puede hacer con CSS o JavaScript normal, se hace así.
2. **Código simple.** Lo tiene que poder mantener una persona que no escribió esto. Comentarios en español, nombres claros, cada bloque de JS independiente.
3. **Nada de terceros en tiempo de ejecución.** Fuentes, iconos e imágenes se sirven desde el propio dominio. La política de seguridad (CSP) del `<meta>` bloquea scripts y estilos externos, y también los atributos `style="..."` y los `<script>` en línea.
4. **Diseño.** Fondo oscuro fijo (no hay modo claro), rojo extintor, amarillo de alta visibilidad solo para la acción principal y esquinas rectas. Sin degradados decorativos ni tarjetas con borde de color. Los colores y tipografías están en `:root`, arriba de `css/styles.css`.
5. **Animación.** Solo `transform` y `opacity`. Todo respeta `prefers-reduced-motion`. El fuego del inicio vive aislado en `js/fire.js` y se puede quitar borrando su `<script>`.
6. **Accesibilidad.** Contraste AA, foco visible, todo usable con teclado (menú, pestañas con flechas, ventanas con Escape).
7. **SEO.** Si cambias un texto de servicios o de preguntas frecuentes, actualiza también el bloque JSON-LD del `<head>`: lleva una copia de esos datos.
8. **Sin guiones largos** en los textos de la web.

## Antes de dar algo por terminado

1. `npx html-validate index.html 404.html` sin errores.
2. Revisar en 375, 768 y 1440 px de ancho: sin desbordes horizontales.
3. Consola del navegador sin errores (un error de CSP significa que se coló un recurso externo o código en línea).
4. Lighthouse o https://pagespeed.web.dev/ con la URL publicada. Referencia actual: 99 en móvil y 100 en escritorio, con 100 en accesibilidad, prácticas recomendadas y SEO.

## Skills y plugins que se usaron

Están listados en `docs/ONBOARDING-CLAUDE.md` junto con el instalador. En resumen: `ui-ux-pro-max` y `playwright` (plugins que se instalan con `scripts/setup-claude.*`), las skills `animate`, `design-taste-frontend` y `no-ai-slop` (ya incluidas en `.claude/skills/`), y los comandos `/code-review` y `/security-review` de Claude Code.

## Historial

`docs/HISTORIAL.md` guarda las decisiones de diseño, los fallos encontrados en las auditorías y lo que queda pendiente.
