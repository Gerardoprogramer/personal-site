# Portfolio de Gerardo Martínez Monge

Portfolio bilingüe (español e inglés) con una selección de tres proyectos y sus casos de estudio: Obsidian Library, La Central y Selvática.

## Desarrollo

Requiere Node.js 20.9 o posterior y pnpm.

```sh
pnpm install
pnpm dev
```

```sh
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

El formulario utiliza Resend. Las variables de configuración se consultan en `app/api/contact/route.ts`; no deben incluirse en el repositorio.

## Contenido

- `content/projects.ts`: selección, enlaces, tecnologías y capturas.
- `lib/i18n/projects.content.ts`: relatos y estados de los proyectos en ambos idiomas.
- `components/projects/`: casos de estudio, vistas particulares y visor de capturas.
- `components/sections/`: presentación, proyectos, experiencia y contacto.
- `lib/i18n/es.json` y `en.json`: textos compartidos, formulario y privacidad.
- `public/projects/`: capturas reales de las aplicaciones. Las de La Central usan datos de demostración.

Cada caso tiene una ruta `/proyectos/[slug]`, metadatos propios y variantes `?lang=es` y `?lang=en`. Las pruebas y mediciones citadas pertenecen a los reportes documentados de cada proyecto; no se presentan como mediciones continuas.

## Implementación

Next.js App Router, React, TypeScript y Tailwind CSS. Imágenes locales optimizadas con `next/image`; Fraunces, Inter y Geist Mono con `next/font`. Navegación por teclado, visor con diálogo nativo y respeto de la preferencia de movimiento reducido.
