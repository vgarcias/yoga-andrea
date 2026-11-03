---
name: verify
description: Use when a change to this Next.js yoga site is finished and needs checking, before saying it is done, committing, or opening a PR. Also use after editing pages under app/, components/, lib/ or next.config.mjs.
---

# Verificar cambios

El proyecto no tiene lint ni tests, y `next.config.mjs` tiene `ignoreBuildErrors: true`. Un build exitoso NO prueba que los tipos estén bien. Verifica siempre en este orden y no declares terminado hasta que todo pase.

## Pasos

1. **Tipos** (obligatorio, el build no los revisa):
   ```bash
   pnpm exec tsc --noEmit
   ```
2. **Build de producción** (detecta errores de rutas, imports y render):
   ```bash
   pnpm build
   ```
3. **Revisión en el navegador** si el cambio es visual o de comportamiento:
   ```bash
   pnpm dev
   ```
   Abre en http://localhost:3000 las rutas tocadas.

## Rutas del sitio

| Ruta | Archivo |
|------|---------|
| `/` | app/page.tsx |
| `/calendario` | app/calendario/page.tsx |
| `/paquetes` | app/paquetes/page.tsx |
| `/mensajes` | app/mensajes/page.tsx |
| `/admin` | app/admin/page.tsx |
| `/admin/alumnas` | app/admin/alumnas/page.tsx |
| `/admin/calendario` | app/admin/calendario/page.tsx |
| `/admin/paquetes` | app/admin/paquetes/page.tsx |

Si cambiaste `app/layout.tsx`, `app/globals.css` o `components/ui/`, revisa todas las rutas.

## Qué revisar en el navegador

- La página carga sin errores en la consola del navegador ni en la terminal de `pnpm dev`.
- El diseño se ve bien en ancho móvil (~375px) y escritorio.
- Los enlaces y botones modificados funcionan y llevan a la ruta correcta.

## Errores comunes

- Confiar solo en `pnpm build`: pasa aunque haya errores de TypeScript.
- Usar `npm` o `yarn`: el proyecto usa pnpm (ver `packageManager`).
- Dejar `pnpm dev` corriendo al terminar: detenlo.

## Reporte final

Indica qué pasos corriste y su resultado. Si omitiste alguno, dilo y explica por qué.
