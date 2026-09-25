# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Frontend for a padel court reservation app (`padel-reservas-web`). Angular 22 application generated with the Angular CLI, using standalone components (no `NgModule`), signals, and the application builder (`@angular/build`). The codebase is a fresh scaffold: routes are empty (`src/app/app.routes.ts`), there's a single root `App` shell component, and no API integration, state management, or design system has been introduced yet.

## Commands

```bash
npm start            # ng serve — dev server at http://localhost:4200
npm run build        # ng build (production config by default)
npm run watch        # ng build --watch --configuration development
npm test             # ng test — Vitest via @angular/build:unit-test, jsdom environment
```

Useful `ng test` flags (Vitest-backed runner, not plain `vitest` CLI):
- Run a single file: `ng test --include src/app/app.spec.ts`
- Filter by suite/test name: `ng test --filter "^App"`
- Single run, no watch: `ng test --watch=false`
- List discovered spec files without running: `ng test --list-tests`

There is no lint script configured in `package.json`.

## Architecture

- **Bootstrap**: `src/main.ts` bootstraps the standalone `App` component with `appConfig` from `src/app/app.config.ts`. `appConfig` wires `provideRouter(routes)` and `provideBrowserGlobalErrorListeners()` — this is where future global providers (HTTP client, interceptors, etc.) should be registered.
- **Routing**: `src/app/app.routes.ts` exports the `routes` array (currently empty). New features should register their routes here.
- **Styling**: component styles use SCSS (`styleUrl: './x.scss'`), configured via `schematics.@schematics/angular:component.style: "scss"` in `angular.json`, and inline styles also resolve as SCSS (`inlineStyleLanguage`). Global styles live in `src/styles.scss`. There is no CSS/UI framework (e.g. Bootstrap) installed yet and no design tokens — don't assume one exists without checking `package.json` and `angular.json` first.
- **Static assets**: served from `public/` (mapped via the `assets` glob in `angular.json`), not `src/assets/`.
- **Testing**: Vitest runs through Angular's own `@angular/build:unit-test` builder (not a standalone `vitest.config.ts`); spec files matched by `tsconfig.spec.json` (`src/**/*.spec.ts`).

## Custom agents (`.claude/agents/`)

- **`angular-expert`** — writes/refactors Angular logic: components, services, facades, forms, signals, routing, DI. Always checks the real installed `@angular/core` version before assuming an API is available. Won't do CSS/HTML-only work or unrelated architectural changes (new Facade layer, NgModule removal, global state library) without confirmation.
- **`maquetador-expert`** — writes/refactors HTML/CSS/BEM layout only (no business logic, services, state, or routing). Its own doc currently assumes the project has plain `.css` files and Bootstrap 5 loaded globally — that doesn't match the current scaffold (SCSS, no Bootstrap dependency yet). Re-verify the project's real styling setup before relying on that agent's assumptions, since the codebase has moved on since that doc was written.

Use `angular-expert` for behavior/state/data, `maquetador-expert` for pure markup/styling, and split a task across both rather than mixing concerns in one change.

## Spec-driven workflow (`.agents/skills/`)

This repo has `spec` and `spec-impl` skills installed (synced via `skills-lock.json` from `Klerith/fernando-skills`) for larger features:
- `/spec` — clarifies requirements through targeted questions, then writes a numbered spec file to `specs/` (`specs/NN-slug.md`) in `Draft` state.
- `/spec-impl NN-slug` — only proceeds if the spec's state is `Approved`; creates a branch (`spec-NN-slug`), then implements the plan step by step, pausing for review after each step.

The `specs/` folder and `specs/.spec-config.yml` don't exist yet — they're created on first use.
