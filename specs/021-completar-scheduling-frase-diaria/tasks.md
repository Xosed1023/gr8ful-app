---
description: "Task list: notificaciones locales de frase diaria"
---

# Tasks: Completar Scheduling de Frase Diaria

**Input**: Design documents from `/specs/021-completar-scheduling-frase-diaria/`

**Tests**: `vitest` para `buildSchedule` y el flujo con el plugin simulado; la entrega real se verifica en dispositivo (quickstart.md).

---

## Phase 1: Setup

- [X] T001 Instalar `@capacitor/local-notifications@^7.0.7` (package.json + lockfile) y confirmar que `npm run build` sigue pasando
- [X] T002 [P] Añadir `getAllPhrases()` en `src/persistence/IndexedDBService.ts` (lectura de todas las frases)
- [X] T003 [P] Añadir `AppNotificationsLanguage` en `src/persistence/languages.ts` (ES/EN/FR): nombre del canal, título/mensaje/botón del aviso de permiso denegado

## Phase 2: Foundational — módulo de notificaciones (bloquea US1-US3)

- [X] T004 Crear `src/notifications/dailyQuote.ts`: `buildSchedule` (pura, data-model.md), `enableDailyQuotes`, `disableDailyQuotes`, `refreshDailyQuotes`; IDs `7000..7029`; cancelar los 30 antes de programar; canal `daily-quote` en Android; no-op en web; errores a `console.error`
- [X] T005 [P] Crear `src/notifications/dailyQuote.test.ts`: primera fecha hoy/mañana según la hora; 30 fechas consecutivas a la hora elegida; frases distintas y no vistas primero; respeta temas y rellena si faltan; `enable` devuelve `denied` sin programar; `refresh` no pide permiso ni programa si está desactivado; `disable` cancela los 30 IDs

## Phase 3: User Story 1 — Recibir la frase a la hora elegida (P1) 🎯 MVP

- [X] T006a [US1] `src/pages/Gender.tsx` y `src/pages/QuoteTopics.tsx`: quitar la condición `VITE_SHOW_PUSH_NOTIFICACIONS_SCREEN` (el paso de hora siempre forma parte del onboarding, FR-013) y eliminar la variable de `.env` si existe
- [X] T006 [US1] `src/pages/QuoteTime.tsx`: tras guardar `time`, si es onboarding (sin `backTo`) llamar `enableDailyQuotes()` (pide permiso) antes de navegar; si viene de Ajustes, `refreshDailyQuotes()`
- [X] T007 [US1] `src/App.tsx`: dejar de pedir el permiso al arrancar (solo registrar push remoto si ya está concedido) y llamar `refreshDailyQuotes()` tras `initDB()`
- [X] T008 [P] [US1] `src/pages/QuoteTopics.tsx` y `src/pages/Languages.tsx`: llamar `refreshDailyQuotes()` al confirmar temas/idioma

## Phase 4: User Story 2 — Controlar desde Ajustes (P1)

- [X] T009 [US2] `src/pages/Settings.tsx`: el interruptor de notificaciones usa `checked` con estado, activa/desactiva con `enableDailyQuotes`/`disableDailyQuotes`, y sustituye el `IonAlert` de botones vacíos

## Phase 5: User Story 3 — Permiso denegado (P2)

- [X] T010 [US3] `src/pages/Settings.tsx`: si `enableDailyQuotes()` devuelve `"denied"`, apagar el interruptor y mostrar el aviso traducido (T003)

## Phase 6: Polish

- [X] T011 `npm run lint && npm run build && npm run test.unit` — 0 errores nuevos
- [X] T012 `npx cap sync` y comprobar que el plugin queda registrado en `ios/App/Podfile` y `android/capacitor.settings.gradle`
- [X] T013 Verificación en dispositivo — Verificación en dispositivo (quickstart.md §2-§5) — **verificado en iPhone (2026-10-02)**: llegan con la app cerrada. Android sin verificar
- [X] T014 Cerrar: `Status` de `spec.md` y de `specs/005-notificaciones-push` (FR-003 cumplido); anotar el icono propio de notificación en `specs/BACKLOG.md`

## Dependencies

Setup (T001 ∥ T002 ∥ T003) → T004 → T005 → US1 (T006, T007, T008) → US2 (T009) → US3 (T010) → Polish
