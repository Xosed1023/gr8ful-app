---
description: "Task list: modo oscuro completo con tokens CSS y paletas de mujer/hombre"
---

# Tasks: Completar Toggle de Dark Mode (modo oscuro completo)

**Input**: Design documents from `/specs/019-completar-dark-mode-toggle/` (plan.md, spec.md, research.md, data-model.md, quickstart.md)

**Tests**: un test unitario (`vitest`) para la función de arranque del tema; el resto se valida visualmente con quickstart.md (el color no es verificable con jsdom).

**Regla transversal**: el valor claro de cada token es exactamente el color que reemplaza (FR-010, VR-002). No se tocan `bottomAdSpace`, IDs ni posiciones de banners (Principio IV).

---

## Alcance anterior (toggle de Ajustes) — completado

- [X] T001 Verificar `git status` limpio
- [X] T002 [P] Baseline: `npm run lint`, `npm run build` — 0 errores
- [X] T003 [US1] En `src/pages/Settings.tsx`: descomentar el bloque `IonToggle` de dark mode, con `checked` además de `value` (FR-001 a FR-004)
- [X] T004 `npm run lint`/`build` final del alcance anterior, 0 errores

---

## Phase 1: Foundational — tokens y arranque (bloquea US2 y US3)

- [X] T005 En `src/theme/variables.css`: definir en `:root` los tokens de data-model.md («Comunes», «Fondos y degradados», «Por género») con el **valor claro actual**, y añadir tokens auxiliares para los grises/slate de Tailwind que usan Ajustes, Favoritos y MainHome: `--surface` (blanco → `#0F1220`), `--header-bg` (`slate-900` `#0F172A` → `#0B0F1C`), `--icon-color` (`slate-900` → `#ECEAF4`)
- [X] T006 En `src/theme/variables.css`: bloque `.ion-palette-dark { ... }` con los valores oscuros de data-model.md; los fondos por género se redefinen en `.ion-palette-dark .background-woman` (`--background-color: #0F1220`, gradiente `#4A27A8` atenuado) y `.ion-palette-dark .background-man` (`--background-color: #0C1520`, gradiente `#1E5F8A` atenuado); `.background`, `.background-waiting`, `.loading-man`, `.backgroundHome` usan la base de mujer. Reconocer que `.background-woman/man` están duplicados en `QuoteTime.css` y `UserName.css` (se limpian en T012 y T015) — **Implementado**: la base de hombre se aplica en `.ion-palette-dark .background-man`, `.loading-man` y `.backgroundHome.home-man`; para esto último se añadió en `src/pages/Home.tsx` la clase `home-man` cuando `useUserGender().isMale`.
- [X] T007 [P] Crear `src/theme/applyStoredTheme.ts` con `applyStoredTheme()`: lee `localStorage.darkMode` (insensible a mayúsculas, ausente = claro) y alterna `ion-palette-dark` en `document.documentElement`; envolver el acceso a `localStorage` en `try/catch` (research.md Decisión 2)
- [X] T008 [P] Crear `src/theme/applyStoredTheme.test.ts` (vitest): `"true"` añade la clase, `"false"`/ausente la quita, `"TRUE"` también la añade
- [X] T009 En `src/main.tsx`: llamar `applyStoredTheme()` **antes** de `createRoot(...).render(...)` (FR-011)
- [X] T010 En `src/pages/Settings.tsx`: reemplazar el `useEffect` de montaje (líneas ~37-42) por `applyStoredTheme()` reutilizada también dentro de `onIonChange` del toggle tras escribir `localStorage.darkMode` (misma función, una sola fuente de verdad)

**Checkpoint**: `npm run lint && npm run build && npm run test.unit`; en `npm run dev`, activar el toggle y recargar Home → debe abrir oscuro (quickstart §2)

---

## Phase 2: User Story 2 — Todas las pantallas en oscuro (Priority: P1) 🎯 MVP

**Goal**: ninguna pantalla muestra zonas claras fijas ni texto ilegible (FR-005, FR-006, FR-009).

**Independent Test**: quickstart.md §3 (tabla de pantallas) con el modo oscuro activo.

- [X] T011 [P] [US2] `src/pages/Welcome.css`: `.background` y `.description` usan tokens (`--background-color`, `--text-muted`, degradados morado + cian atenuados en oscuro)
- [X] T012 [P] [US2] `src/pages/Languages.css`: `.language-button` (borde, texto, `:hover`, `:active`) con `--text-color`, `--btn-bg`, `--btn-text`; sin `#000000`/`#ffffff` fijos
- [X] T013 [P] [US2] `src/pages/Gender.css`: `.gender-button` con `--btn-bg` y `--btn-text` (corrige «A woman»/«A man» claro sobre claro — research.md Decisión 5); `.text-normal` y `.text-highlight` ya usan `--text-color`
- [X] T014 [P] [US2] `src/pages/QuoteTime.css`: `.time-button`, `.note-container` con tokens (`--woman-dark-purple`/`--woman-light-purple` pasan a tokens con valor oscuro `--accent-text`/`--text-muted`); eliminar los `.background-woman/.background-man` duplicados en favor de `variables.css` — **Nota**: los `.background-woman/.background-man` duplicados se conservaron (solo se tokenizaron sus degradados) para no alterar el tema claro; consolidarlos queda como limpieza futura.
- [X] T015 [P] [US2] `src/pages/QuoteTopics.css`: `.topic-button`, `.topic-button.selected.*`, `.next-button*`, `.note-container-topics` con tokens (chip seleccionado, botón morado de acento sin cambio, deshabilitado `--chip-off-bg`)
- [X] T016 [P] [US2] `src/pages/UserName.css`: `.name-input` (fondo y texto), `.finish-button`, `.next-button*`, `.note-container` con tokens; eliminar `.background-woman/.background-man` duplicados — **Nota**: igual que T014.
- [X] T017 [P] [US2] `src/pages/LoadingScreen.css`: `.background-waiting`, `.loading-man` con tokens de degradado; texto con `--text-color`
- [X] T018 [US2] `src/theme/variables.css`: `.ionic-button` (fondo `--btn-bg`, texto `--btn-text`, `:hover`/`:active` coherentes) y `ion-toast.custom-toast` (`--background: var(--toast-bg)`, `--color: var(--toast-text)`, borde del botón) (FR-006, FR-009)
- [X] T019 [P] [US2] `src/components/common/BackButton.tsx` y `src/pages/Languages.tsx`: `text-black` → `text-[var(--text-color)]`
- [X] T020 [P] [US2] `src/pages/Settings.tsx`: `bg-slate-900` → `bg-[var(--header-bg)]`, `bg-white` → `bg-[var(--surface)]`, `text-black` → `text-[var(--text-color)]`, `border-slate-900` y `text-slate-900` → `var(--icon-color)`; el `h1` blanco del encabezado no cambia
- [X] T021 [P] [US2] `src/pages/Favorites.tsx`: mismos reemplazos que T020 (`bg-slate-900`, `bg-white` en `IonContent`, `text-slate-900`, `text-slate-500` → `--text-muted`)
- [X] T022 [P] [US2] `src/pages/MainHome.tsx`: `bg-indigo-950` e `bg-slate-900` de `IonTabs`/`IonTabBar` → `bg-[var(--nav-bg)]` — `IonTabs` usa `--tabs-bg` y `IonTabBar`/botones `--nav-bg`.
- [X] T023 [P] [US2] `src/pages/Settings.css`, `src/pages/Home.css`, `src/pages/MainHome.css`: confirmar que no quedan colores fijos (solo hay un bloque comentado y `var(--background-color)`); sin cambios si es así

**Checkpoint**: quickstart.md §3 en modo mujer y §5 (tema claro idéntico)

---

## Phase 3: User Story 3 — Cada género conserva su identidad (Priority: P2)

**Goal**: Home en oscuro con la paleta de mujer o de hombre (FR-007, FR-008).

**Independent Test**: quickstart.md §4.

- [X] T024 [P] [US3] `src/components/home/CardPhrase.tsx`: en `colorConfig`, reemplazar `background`/`text` por clases con tokens de tarjeta (`bg-[var(--card-woman-blue-bg)]`, `text-[var(--card-woman-blue-text)]`, … una pareja por `CardColors`, 6 en total); definir los 6 pares en `variables.css` (claro = clases Tailwind actuales: `sky-500`/`sky-900`, `violet-400`/`purple-900`, `violet-300`/`indigo-900`, `#61B2E4`/`#17537A`, `#5A9ABE`/`#154C6B`, `#95C5DE`/`#0D4461`; oscuro = data-model.md «Tarjetas de Home»). **No tocar** `initialPosition`, alturas ni `bottomAdSpace`
- [X] T025 [P] [US3] `src/components/home/CardsContainer.tsx`: barra del autor `isMale ? "bg-[#1C2742]" : "bg-indigo-950"` → clases `author-bar-man` / `author-bar-woman` (o `bg-[var(--author-bar-bg)]`) con token por género; claro = valores actuales, oscuro = `#101A2E` / `#141830`
- [X] T026 [P] [US3] `src/components/home/Greetings.tsx`: `text-[#1C2742]` / `text-violet-950` → tokens `--greeting-man` / `--greeting-woman` (oscuro `#ECEAF4`)
- [X] T027 [US3] En `src/theme/variables.css`: confirmar que los tokens por género (T024-T026) están definidos en `:root` (claro) y `.ion-palette-dark` (oscuro) y que `--background-color` por género sale de `.ion-palette-dark .background-woman/man` (T006)
- [X] T034 [US2] (hallazgo en dispositivo) `src/theme/variables.css`: filtros de inversión en oscuro para `.logo` (`invert(1)`) y `.dots1`, `.dots-top`, `.feather`, `.img-themed` (`invert(1) hue-rotate(180deg)`); `Greetings.tsx` añade `img-themed` al adorno (flor/comillas)
- [X] T035 [US2] (hallazgo en dispositivo) `src/theme/variables.css`: variables de Ionic (`--ion-background-color`, `--ion-item-background`, …) sobrescritas bajo `:root.ion-palette-dark.ios|.md` — la paleta de Ionic usa negro puro con mayor especificidad

**Checkpoint**: quickstart.md §4 y §6 (banners AdMob sin cambios de posición)

---

## Phase 4: Polish & verificación

- [X] T028 `npm run lint && npm run build && npm run test.unit` — 0 errores — **Resultado**: `tsc` y `eslint` sin errores; `vitest` 5/5 tests OK (el `ReferenceError: indexedDB` no capturado de `App.test.tsx` ya existía antes de esta spec); `vite build` OK.
- [X] T029 Búsqueda final de colores fijos: `grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(" src --include='*.css' --include='*.tsx'` — solo deben quedar los permitidos por VR-001 (`#FF709D`, botón de acento morado, definiciones de tokens, sombras) — **Resultado**: quedan solo excepciones permitidas (sombras de tarjeta/barra, hover de botones de acento en `QuoteTopics.css`/`UserName.css`, bloque comentado de `Settings.css`).
- [X] T030 Medir contraste del texto de las 6 tarjetas en oscuro (≥ 4.5:1, SC-004) en `npm run dev`; ajustar el token y data-model.md/spec.md si alguno falla (R3) — **Resultado**: woman-blue 6.44, woman-purple 8.99, woman-violette 7.04, man-sky 6.07, man-light 7.6, man-deep 4.87 (todas ≥ 4.5:1, SC-004 cumplido sin ajustar colores).
- [X] T031 Verificación manual completa — Verificación manual completa (quickstart.md §2-§6) en emulador, incluyendo reabrir la app con modo oscuro persistido (destello, R2) y el tema claro sin cambios — **verificado por el usuario en dispositivo iOS (2026-10-02)**: dark mode OK tras corregir T034 y T035
- [X] T032 Hallazgo de Calidad (alcance anterior): `IonToggle` requiere la prop `checked` (no solo `value`) para reflejar su estado real al montar — ver T003. **Nota, no corregido aquí (fuera de alcance)**: el toggle de `pushNotifications` del mismo archivo tiene el mismo problema (solo usa `value`); candidato de fix futuro
- [X] T033 Cerrar (nota del logo en `specs/BACKLOG.md`; `Status` pasado a «Implementado»): actualizar `Status` de `spec.md` a «Implementado» y anotar en `specs/BACKLOG.md` la vectorización del logo (candidata futura)

---

## Dependencies

Setup (hecho) → Phase 1 (T005 → T006; T007 → T008, T009, T010) → Phase 2 (US2) y Phase 3 (US3) en paralelo entre sí tras T005/T006 → Phase 4 (T028-T033)

- T018, T027 tocan `variables.css`: ejecutar en serie con T005/T006/T024.
- Las tareas `[P]` tocan archivos distintos y se pueden hacer en paralelo.

## Parallel Example

```text
T011 Welcome.css ∥ T012 Languages.css ∥ T013 Gender.css ∥ T014 QuoteTime.css ∥ T015 QuoteTopics.css ∥ T016 UserName.css ∥ T017 LoadingScreen.css
T020 Settings.tsx ∥ T021 Favorites.tsx ∥ T022 MainHome.tsx
T024 CardPhrase.tsx ∥ T025 CardsContainer.tsx ∥ T026 Greetings.tsx
```

## Implementation Strategy

1. **MVP**: Phase 1 + US2 en paleta de mujer (tema claro intacto) → validar en `npm run dev`.
2. Añadir US3 (paleta de hombre y tarjetas por género).
3. Polish y verificación manual en emulador.
