# SPEC 01 — Sistema de diseño y shell de la app

> **Status:** Implemented 
> **Depends on:** Ninguno
> **Date:** 2026-09-25
> **Objective:** Establecer el shell visual de la aplicación (navbar, footer y layout base) con los tokens de color de Bootstrap y la convención de carpetas que usarán los specs futuros.

## Por qué existe este spec

Es el primer spec del proyecto: sienta las convenciones (paleta de color, estructura de carpetas, patrón de layout) que reutilizarán los specs 02–05. Se mantiene deliberadamente pequeño — solo shell visual, sin ninguna feature de negocio — para no bloquear esas convenciones detrás de decisiones que todavía no se han tomado (auth, reservas, admin).

## Scope

**In:**

- Componente `navbar` standalone que muestra únicamente la marca "Padel Reservas" sobre fondo `$primary`, sin enlaces de navegación.
- Componente `footer` standalone que muestra "© {año actual} Padel Reservas", con el año calculado en tiempo de ejecución (no hardcodeado).
- Composición del shell en el componente raíz `App`: `navbar` + `<router-outlet />` + `footer`, con patrón sticky-footer (el footer queda pegado al fondo aunque el contenido de la ruta activa sea corto).
- Tokens de color: override de `$primary` (verde pista, `#2E7D32`) y `$secondary` (azul cielo, `#1565C0`) de Bootstrap vía `@use "bootstrap/scss/bootstrap" with (...)` en `src/styles.scss`.
- Limpieza del boilerplate por defecto del Angular CLI (logo, pills, enlaces de documentación) en `app.html`/`app.ts`/`app.scss`.
- Actualización de `src/app/app.spec.ts` para testear el shell nuevo en vez del boilerplate del CLI.
- Documentar la convención de carpetas `core/` / `shared/` / `features/{auth,booking,profile,admin}/` para que los specs 02–05 la reutilicen sin redefinirla (ver Decisiones).

**Out of scope (para specs futuros):**

- Enlaces de navegación reales (Inicio, Reservas, Mis reservas, Admin, Login) — cada uno se añade en el spec que construya esa página.
- Botón/estado de sesión (login/logout) en el navbar — spec 02 (autenticación).
- Botón hamburguesa/collapse del navbar de Bootstrap — no hay enlaces que colapsar todavía; se añade cuando el primer spec incorpore enlaces reales.
- Modo oscuro (Bootstrap 5.3 color modes).
- Logo gráfico/SVG — solo texto por ahora.
- Contenido adicional del footer (enlaces, redes sociales, contacto).
- Creación de carpetas o componentes "stub" para `auth`, `booking`, `profile` o `admin` — cada spec crea lo que necesita cuando lo necesita.

## Data model

Este spec no introduce estructuras de datos de aplicación. Introduce tokens de diseño (variables SCSS), que no son estado en tiempo de ejecución:

```scss
// src/styles.scss
@use "bootstrap/scss/bootstrap" with (
  $primary: #2E7D32,   // verde pista
  $secondary: #1565C0  // azul cielo
);
@use "bootstrap-icons/font/bootstrap-icons.css";
```

## Implementation plan

1. Modificar `src/styles.scss`: cambiar `@use "bootstrap/scss/bootstrap" as *;` por `@use "bootstrap/scss/bootstrap" with ($primary: #2E7D32, $secondary: #1565C0);`. Verificar con `npm run build` que compila y que un `.btn-primary` de Bootstrap se ve verde.
2. Crear `src/app/shared/layout/navbar/navbar.ts` (+ `.html` + `.scss`), componente standalone con un `navbar bg-primary` que muestra el texto "Padel Reservas" como marca, sin enlaces.
3. Crear `src/app/shared/layout/footer/footer.ts` (+ `.html` + `.scss`), componente standalone que muestra `© {{ currentYear }} Padel Reservas`, con `currentYear` calculado con `new Date().getFullYear()`.
4. Actualizar `src/app/app.ts`: importar `Navbar` y `Footer` junto a `RouterOutlet`, eliminar el signal `title` y cualquier import del boilerplate del CLI que deje de usarse.
5. Reescribir `src/app/app.html` con `<app-navbar />`, un `<main>` que envuelve `<router-outlet />`, y `<app-footer />`; ajustar `src/app/app.scss` para que `App` ocupe `min-height: 100vh` en columna flex y el `<main>` crezca (`flex: 1 0 auto`), logrando el sticky-footer.
6. Actualizar `src/app/app.spec.ts`: sustituir los tests del boilerplate (título, pills) por tests que verifiquen que `app-navbar` y `app-footer` se renderizan dentro de `App`.
7. Verificación manual con `npm start`: confirmar visualmente que el navbar es verde con la marca, el contenido central está vacío, y el footer con el copyright queda al fondo de la ventana incluso sin contenido, tanto en escritorio como en móvil.

## Acceptance criteria

- [ ] `npm run build` compila sin errores ni warnings de presupuesto.
- [ ] `npm test` pasa en verde con los tests actualizados de `app.spec.ts`.
- [ ] Al ejecutar `npm start`, la barra de navegación superior muestra el texto "Padel Reservas" sobre fondo verde (`$primary`).
- [ ] El pie de página muestra "© 2026 Padel Reservas" con el año calculado dinámicamente, no escrito a mano.
- [ ] Con poco contenido en la página, el footer queda pegado al fondo de la ventana, no a mitad de pantalla.
- [ ] La barra de navegación no contiene enlaces ni botón de inicio de sesión.
- [ ] El boilerplate por defecto del Angular CLI (logo, pills, enlaces de documentación) ha desaparecido de `app.html`.

## Decisions

- **Sí:** override de variables Bootstrap con `@use "bootstrap/scss/bootstrap" with (...)` en vez de `@import` clásico — es la API de módulos de Dart Sass recomendada por Bootstrap 5.3+, y ya usábamos `@use` desde la Fase A de instalación.
- **Sí:** paleta `$primary` verde pista / `$secondary` azul cielo fijada ya, para no retocar todos los componentes más adelante cuando existan más pantallas.
- **No:** modo oscuro ahora — queda fuera de alcance explícitamente; se evaluará en un spec de theming si llega a hacer falta.
- **No:** crear ya carpetas o componentes stub para `auth`/`booking`/`profile`/`admin` — cada spec crea lo que necesita cuando lo necesita, evita carpetas vacías sin contenido en el repo.
- **Sí:** convención de carpetas `src/app/core/` (servicios y guards transversales), `src/app/shared/` (componentes de layout reutilizables, como el navbar y el footer de este spec) y `src/app/features/{auth,booking,profile,admin}/` (una por área, creada por su propio spec) — documentada aquí para que los specs 02–05 la reutilicen sin redefinirla.
- **No:** botón hamburguesa/collapse del navbar — no hay enlaces que colapsar todavía; se añade en el spec que incorpore los primeros enlaces reales.
- **No:** logo gráfico — solo texto por ahora, para no bloquear el spec en un asset que no existe.

## What is **not** in this spec

- Enlaces de navegación reales y su routing.
- Estado de sesión (login/logout) en el navbar.
- Modo oscuro / toggle de tema.
- Logo gráfico.
- Carpetas o componentes stub de `auth`, `booking`, `profile` o `admin`.

Cada uno de estos, si se necesita, va en su propio spec.
