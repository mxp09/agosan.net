# agosan.net

Web de **Agosan**, empresa de sistemas contra incendios en Ciudad de Panamá (mantenimiento NFPA10, prueba hidrostática DOT CFR 49, recarga de extintores).

Sitio estático: HTML, CSS y JavaScript sin frameworks, sin compilación y sin dependencias. Basta con subir los archivos a cualquier hosting.

## Estructura

```
index.html              Todo el contenido de la página (textos, servicios, contacto, SEO)
404.html                Página de "no encontrado"
css/styles.css          Estilos. Los colores y fuentes están arriba, en :root
js/main.js              Menú, pestañas, ventanas de detalle, contadores y animaciones de entrada
js/fire.js              Brasas del hero y efecto de extintor (opcional)
assets/img/             Fotos optimizadas (WebP + JPG de respaldo), logo e imagen para redes
assets/src/             Fotos originales, por si hay que regenerar tamaños
assets/fonts/           Fuentes alojadas en el propio sitio
assets/icons.svg        Iconos (Tabler Icons, licencia MIT)
robots.txt, sitemap.xml, site.webmanifest, favicon.ico, icon-*.png
.well-known/security.txt
_headers                Cabeceras de seguridad (solo para Cloudflare Pages o Netlify)
```

## Cambios habituales

| Quiero cambiar... | Dónde |
|---|---|
| Un texto, teléfono o email | `index.html`. Los teléfonos y emails aparecen en la cabecera, contacto, pie y en el bloque JSON-LD del `<head>` |
| El detalle de un servicio ("Más Información") | `index.html`, sección `VENTANAS DE DETALLE`: un `<dialog>` por servicio |
| Colores o fuentes | `css/styles.css`, bloque `:root` |
| Una foto | Sustituye los archivos de `assets/img/` con el mismo nombre y tamaño (480, 640, 800 y 1200 px de ancho) |
| Un icono | `assets/icons.svg`: copia el `<path>` de [tabler.io/icons](https://tabler.io/icons) dentro de un `<symbol id="i-nombre">` y úsalo con `<use href="assets/icons.svg#i-nombre"/>` |
| Quitar el efecto de fuego | Borra la línea `<script src="js/fire.js" defer></script>` de `index.html` |
| Una pregunta frecuente | `index.html`: el bloque `<details>` y también su copia en el JSON-LD (`FAQPage`) |

Si cambias la fecha de algo importante, actualiza también `lastmod` en `sitemap.xml`.

## Probar en local

```bash
npx serve .
```

Abre la dirección que aparece (por ejemplo http://localhost:3000).

## Seguridad

- No hay formularios, backend ni scripts de terceros. Todo (fuentes, iconos, imágenes) se sirve desde el propio dominio.
- Política de seguridad de contenido (CSP) en el `<meta>` de cada HTML. Si añades un script o estilo externo, hay que permitirlo ahí o el navegador lo bloqueará.
- No uses atributos `style="..."` ni `<script>` en línea: la CSP los bloquea a propósito. Pon los estilos en `css/styles.css` y el código en `js/`.
- Con Cloudflare Pages o Netlify, `_headers` añade HSTS, protección contra iframes (clickjacking) y más.

## Accesibilidad y movimiento

Las animaciones respetan la opción del sistema "reducir movimiento". Todo se puede usar con teclado: el menú, las pestañas (con las flechas) y las ventanas (Escape para cerrar).

## Créditos

- Iconos: [Tabler Icons](https://tabler.io/icons) (MIT)
- Fuentes: Big Shoulders Display, Archivo e IBM Plex Mono (SIL Open Font License)
