# NETSOLCA — Sitio web (Astro)

Sitio corporativo de NETSOLCA construido con [Astro](https://astro.build): HTML estático, sin JavaScript de framework en el cliente, con SEO completo y listo para publicar en Vercel.

## Requisitos

- Node.js 22.12 o superior
- npm

## Comandos

| Comando           | Qué hace                                           |
| ----------------- | -------------------------------------------------- |
| `npm install`     | Instala las dependencias                           |
| `npm run dev`     | Servidor de desarrollo en `http://localhost:4321`  |
| `npm run build`   | Genera el sitio final en `dist/`                   |
| `npm run preview` | Sirve `dist/` para revisarlo antes de publicar     |
| `npm test`        | Pruebas del cotizador y de las validaciones        |

## Estructura

```
netsolca-astro/
├── astro.config.mjs        Dominio, sitemap y opciones de compilación
├── vercel.json             URLs limpias, redirecciones, caché y cabeceras de seguridad
├── .env.example            Variable SITE_URL (dominio de producción)
├── public/                 Archivos que se copian tal cual
│   ├── assets/img/         Logos, íconos y logos de clientes
│   ├── og-image.png        Imagen al compartir en WhatsApp/redes (1200×630)
│   ├── favicon.ico, apple-touch-icon.png, site.webmanifest
├── src/
│   ├── data/               ← CONTENIDO EDITABLE
│   │   ├── site.ts         Datos de la empresa, menú, teléfono, correo, redes y ubicación
│   │   ├── services.ts     Servicios (inicio y /servicios)
│   │   ├── projects.ts     Proyectos (inicio y /proyectos)
│   │   ├── team.ts         Equipo (página /nosotros)
│   │   ├── about.ts        Misión, visión y valores
│   │   └── faq.ts          Preguntas frecuentes (también generan datos para Google)
│   ├── components/         Header, Footer, Loader, SEO, tarjetas… y home/ (secciones del inicio)
│   ├── layouts/            BaseLayout (páginas) y LegalLayout (páginas legales)
│   ├── pages/              Una ruta por archivo + robots.txt.ts
│   ├── scripts/            JavaScript del sitio (animaciones, cotizador, mapa, formulario…)
│   │   └── config.js       ← Número de WhatsApp y punto del mapa
│   └── styles/             CSS (global.css importa todo en orden)
└── tests/                  Pruebas con node:test
```

### Rutas

| URL            | Archivo                    |
| -------------- | -------------------------- |
| `/`            | `src/pages/index.astro`    |
| `/servicios`   | `src/pages/servicios.astro`|
| `/proyectos`   | `src/pages/proyectos.astro`|
| `/nosotros`    | `src/pages/nosotros.astro` |
| `/contacto`    | `src/pages/contacto.astro` |
| `/aviso-legal`, `/privacidad`, `/terminos` | páginas legales |
| `/robots.txt`  | `src/pages/robots.txt.ts`  |
| `/sitemap-index.xml` | generado por `@astrojs/sitemap` |
| cualquier otra | `src/pages/404.astro`      |

## SEO incluido

- **Por página:** `<title>`, meta description, URL canónica, `robots`, idioma `es`, `theme-color`.
- **Redes:** Open Graph y Twitter Card con `og-image.png` (vista previa en WhatsApp, Facebook, LinkedIn y X).
- **Ubicación:** meta `geo.*` de Maracaibo, Zulia.
- **Datos estructurados (JSON-LD):**
  - Todas las páginas: `ProfessionalService` (empresa, dirección, horario 24/7) y `WebSite`.
  - Inicio: `FAQPage`, que se genera desde `src/data/faq.ts`.
  - Servicios: `ItemList` de `Service` y `BreadcrumbList`.
  - Proyectos: `CollectionPage` y `BreadcrumbList`.
  - Nosotros: `AboutPage`. Contacto: `ContactPage`.
  - Legales: `BreadcrumbList`.
- **robots.txt** con la dirección del sitemap.
- **sitemap-index.xml** con URLs limpias, prioridad y fecha de actualización. La página 404 queda excluida.
- **Rendimiento:**
  - HTML comprimido.
  - Un solo CSS por plantilla.
  - Imagen principal precargada y demás imágenes con `loading="lazy"`.
  - Anime.js se carga con `defer` y el mapa (Leaflet) solo cuando el visitante llega a esa sección.

## Publicar en Vercel

1. Sube esta carpeta (`netsolca-astro`) a un repositorio de GitHub, GitLab o Bitbucket.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio. Vercel detecta Astro automáticamente; la configuración ya está en `vercel.json`.
   Si el repositorio contiene más carpetas, en **Root Directory** elige `netsolca-astro`.
3. En **Settings → Environment Variables**, agrega:
   ```
   SITE_URL = https://www.tudominio.com
   ```
   Si no la defines, se usa el dominio de producción que asigna Vercel.
4. Pulsa **Deploy**.
5. En **Settings → Domains**, conecta el dominio propio y vuelve a desplegar para que la canónica, el sitemap y el robots.txt usen ese dominio.
6. Registra el sitio en [Google Search Console](https://search.google.com/search-console) y envía `https://www.tudominio.com/sitemap-index.xml`.

## Formulario de contacto

El formulario no usa servidor: al enviarlo se valida y se abre WhatsApp (`wa.me`) con el mensaje ya escrito para el número de `src/scripts/config.js`. La persona solo presiona **Enviar** en el chat.

## Antes de publicar (pendientes marcados como PLACEHOLDER)

- [ ] `src/data/team.ts`: nombre, cargo, descripción y foto de cada integrante. Las fotos van en `public/assets/img/equipo/`.
- [ ] `src/data/about.ts`: revisar misión, visión y valores. Son un texto sugerido.
- [ ] `SITE_URL`: el dominio real. `https://www.netsolca.com` es solo un valor de respaldo.
- [ ] `src/data/projects.ts`: nombre del cliente y resultados reales de cada proyecto.
- [ ] Páginas legales: revisión por un asesor legal.

## Editar contenido

- **Agregar un proyecto o servicio:** añade un objeto al arreglo en `src/data/projects.ts` o `src/data/services.ts`. La tarjeta, la ficha de detalle, el inicio y los datos para Google se actualizan solos.
- **Cambiar una foto (servicios, equipo, inicio):** cada foto va en dos formatos y en los tamaños que use: `nombre-640.webp` y `nombre-640.jpg`, `nombre-1200.webp` y `nombre-1200.jpg` (servicios 4:3; equipo 3:4 en 600 y 900). En los datos se pone la ruta sin tamaño ni extensión, por ejemplo `"photo": "/assets/img/servicios/erp"`. El WebP es para navegadores modernos y el JPEG para iPhone/Mac antiguos: si falta el JPEG, esos equipos no ven la foto.
- **Cambiar colores o tipografía:** edita `src/styles/tokens.css`.
- **Cambiar la imagen al compartir:** reemplaza `public/og-image.png` (1200×630 px).
