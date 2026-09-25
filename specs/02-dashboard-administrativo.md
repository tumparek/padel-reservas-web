# SPEC 02 — Dashboard administrativo

> **Status:** Implemented 
> **Depends on:** SPEC 01
> **Date:** 2026-09-25
> **Objective:** Construir el dashboard administrativo — layout aislado con sidebar y topbar propios, KPIs, gráfico de ocupación semanal y gestión CRUD de pistas — con datos mock y aspecto profesional.

## Por qué existe este spec

Reordena la hoja de ruta original: en vez de auth → catálogo/reserva → perfil → admin, se adelanta el dashboard administrativo porque es donde más valor visual aporta ahora mismo. Al no haber login todavía, `/admin` queda como ruta abierta hasta que exista un spec de autenticación que la proteja.

## Scope

**In:**

- Instalación y registro de `chart.js` + `ng2-charts` (`provideCharts(withDefaultRegisterables())` en `app.config.ts`).
- `AdminMockService` (`src/app/features/admin/admin-mock.service.ts`) con signals: `courts` (5 pistas semilla), `kpis` (reservas de hoy, ocupación %, ingresos estimados) y `weeklyOccupancy` (7 días), más `addCourt` / `updateCourt` / `deleteCourt` operando en memoria.
- `AdminSidebar`: ítems "Dashboard" y "Pistas" activos y navegables; "Reservas" y "Usuarios" visibles pero deshabilitados ("Próximamente"), resaltando la ruta activa.
- `AdminTopbar`: título de la sección actual + botón hamburguesa (visible solo por debajo de `lg`) que alterna la visibilidad del sidebar.
- `AdminLayout`: composición sidebar + topbar + `router-outlet`; sidebar oculto por defecto en móvil, siempre visible en escritorio.
- Rutas `/admin` (→ `AdminDashboard`) y `/admin/pistas` (→ `AdminCourts`), como hijas de `AdminLayout`, cargadas con `loadComponent`, sin guard.
- `App` (`app.ts`/`app.html`): oculta `<app-navbar />` y `<app-footer />` públicos cuando la URL activa empieza por `/admin`, para que el admin sea una experiencia de pantalla completa con su propio shell.
- `AdminDashboard`: 3 tarjetas KPI (reservas de hoy, ocupación %, ingresos estimados) + gráfico de barras (ng2-charts) con la ocupación semanal (lunes–domingo).
- `AdminCourts`: tabla con las 5 pistas mock (nombre, tipo, horario, precio/hora, estado) + modal Bootstrap de crear/editar con formulario reactivo + eliminar con `confirm()` nativo del navegador — todo contra `AdminMockService`, en memoria, sin persistencia real.

**Out of scope (para specs futuros):**

- Guard de autenticación / protección real de `/admin` — se añade cuando exista el spec de autenticación.
- Persistencia real (localStorage o backend) de los datos de pistas — se pierden al recargar la página.
- Gestión de franjas horarias individuales (solo horario general de apertura/cierre por pista) — corresponde al spec de catálogo/reserva.
- Páginas reales de "Reservas" y "Usuarios" — en este spec solo son ítems deshabilitados en el sidebar.
- Breadcrumbs o menú de usuario en el topbar — requieren sesión real.
- Modal de confirmación propio para eliminar — se usa `confirm()` nativo para no construir un componente de diálogo genérico solo para esto.
- Pulido del navbar/footer públicos (enlaces reales, estado de sesión) — sigue fuera de alcance, se retoma en un spec posterior según lo acordado.

## Data model

```ts
// src/app/features/admin/models/court.model.ts
export type CourtType = 'indoor' | 'outdoor';
export type CourtStatus = 'activa' | 'mantenimiento';

export interface Court {
  id: string;
  name: string;
  type: CourtType;
  openingTime: string; // '08:00'
  closingTime: string; // '22:00'
  pricePerHour: number;
  status: CourtStatus;
}
```

```ts
// Forma de AdminMockService (src/app/features/admin/admin-mock.service.ts)
courts: Signal<Court[]>; // 5 pistas semilla
kpis: Signal<{ reservasHoy: number; ocupacionPct: number; ingresosEstimados: number }>;
weeklyOccupancy: Signal<{ day: string; pct: number }[]>; // 7 entradas, Lun..Dom

addCourt(court: Omit<Court, 'id'>): void;
updateCourt(id: string, changes: Partial<Omit<Court, 'id'>>): void;
deleteCourt(id: string): void;
```

## Implementation plan

1. Instalar `chart.js` y `ng2-charts`; registrar `provideCharts(withDefaultRegisterables())` en `src/app/app.config.ts`. Verificar `npm run build`.
2. Crear `src/app/features/admin/models/court.model.ts` y `src/app/features/admin/admin-mock.service.ts` con los signals `courts` (5 pistas semilla), `kpis`, `weeklyOccupancy` y los métodos `addCourt`/`updateCourt`/`deleteCourt`.
3. Crear `AdminSidebar` (`src/app/features/admin/layout/admin-sidebar/`) con los 4 ítems (Dashboard y Pistas navegables vía `routerLink`/`routerLinkActive`; Reservas y Usuarios deshabilitados).
4. Crear `AdminTopbar` (`src/app/features/admin/layout/admin-topbar/`) con el botón hamburguesa que emite un evento de toggle del sidebar.
5. Crear `AdminLayout` (`src/app/features/admin/layout/admin-layout/`) componiendo sidebar + topbar + `router-outlet`, con un signal de colapso que controla la visibilidad del sidebar en móvil.
6. Registrar en `src/app/app.routes.ts` la ruta `admin` (→ `AdminLayout`) con hijas `''` (→ `AdminDashboard`) y `'pistas'` (→ `AdminCourts`), todas con `loadComponent`.
7. Actualizar `src/app/app.ts`/`app.html`: derivar un signal `isAdminRoute` a partir de los eventos del `Router` y envolver `<app-navbar />`/`<app-footer />` en un `@if (!isAdminRoute())`.
8. Crear `AdminDashboard` (`src/app/features/admin/dashboard/`) con las 3 tarjetas KPI y el gráfico de barras de ocupación semanal, leyendo de `AdminMockService`.
9. Crear `AdminCourts` (`src/app/features/admin/courts/`) con la tabla de pistas, el modal Bootstrap de crear/editar (formulario reactivo) y el botón eliminar con `confirm()`, todo contra `AdminMockService`.
10. Verificación manual: navegar a `/admin` y `/admin/pistas` (comprobando que el navbar/footer públicos no aparecen), crear/editar/eliminar una pista, y comprobar el colapso del sidebar en viewport móvil.

## Acceptance criteria

- [ ] `npm run build` compila sin errores ni warnings de presupuesto.
- [ ] `npm test` pasa en verde.
- [ ] Al navegar a `/admin` no se muestran el navbar ni el footer públicos del spec 01.
- [ ] `/admin` muestra el sidebar (Dashboard y Pistas activos; Reservas y Usuarios deshabilitados), el topbar, 3 tarjetas KPI y el gráfico de barras de ocupación semanal.
- [ ] `/admin/pistas` muestra una tabla con las 5 pistas mock (nombre, tipo, horario, precio, estado).
- [ ] Se puede crear una pista desde el modal y aparece en la tabla.
- [ ] Se puede editar una pista existente y los cambios se reflejan en la tabla.
- [ ] Se puede eliminar una pista (con confirmación) y desaparece de la tabla.
- [ ] En viewport móvil el sidebar está oculto por defecto y se abre/cierra con el botón hamburguesa del topbar.
- [ ] `/admin` es accesible sin necesidad de iniciar sesión.

## Decisions

- **Sí:** Chart.js + ng2-charts para los gráficos — ligera, licencia MIT, soporte standalone vía `provideCharts()`.
- **Sí:** CRUD de pistas en memoria vía signals en `AdminMockService`, en vez de una tabla puramente estática — da una demo real de "gestión" y deja la forma que tendrá el servicio real cuando exista backend.
- **Sí:** sidebar con ítems futuros deshabilitados (Reservas, Usuarios) — a diferencia del navbar público del spec 01 (donde se evitó todo enlace a páginas inexistentes), aquí sí interesa visibilizar la hoja de ruta completa del panel admin.
- **Sí:** ocultar navbar/footer públicos en rutas `/admin` — un panel administrativo profesional necesita su propio shell de pantalla completa, no convivir con la cabecera/pie públicos.
- **No:** guard de autenticación — fuera de alcance explícitamente, se añade con el spec de autenticación.
- **No:** persistencia real de los datos — los mocks se resetean al recargar, es aceptable para este spec centrado en diseño/maquetación.
- **Sí:** modal Bootstrap para crear/editar, `confirm()` nativo para eliminar — evita construir un componente de diálogo de confirmación genérico solo para este caso.

## What is **not** in this spec

- Guard de autenticación / protección real de `/admin`.
- Persistencia real de los datos de pistas.
- Gestión de franjas horarias individuales.
- Páginas reales de Reservas y Usuarios.
- Breadcrumbs o menú de usuario en el topbar.
- Pulido del navbar/footer públicos.

Cada uno de estos, si se necesita, va en su propio spec.
