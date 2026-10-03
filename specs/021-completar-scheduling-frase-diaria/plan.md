# Implementation Plan: Completar Scheduling de Frase Diaria

**Branch**: `develop` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

## Summary

Se añade `@capacitor/local-notifications` y un módulo `src/notifications/dailyQuote.ts` que, con las notificaciones activadas, programa por adelantado ~30 notificaciones locales (una por día, a la hora elegida, cada una con una frase distinta en el idioma de la app) y las repone en cada apertura y cada vez que cambia la hora, el idioma o los temas. El interruptor de Ajustes pasa a controlar ese módulo; el permiso se pide al elegir la hora (onboarding) o al activar el interruptor, y deja de pedirse al arrancar la app.

## Technical Context

**Language/Version**: TypeScript ~5.1, React 18, Ionic 8

**Primary Dependencies**: `@capacitor/local-notifications` `^7.0.7` (NUEVA, misma línea mayor que el resto de `@capacitor/*`; su manifiesto Android ya declara `POST_NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED` y el receptor de reinicio). Requiere `npx cap sync`.

**Storage**: `localStorage` (`pushNotifications`, `time`, `language`, `topics`, ya existentes) + IndexedDB de frases (lectura). Sin claves nuevas.

**Testing**: `vitest` para la función pura de armado del calendario y para el flujo activar/desactivar con el plugin simulado; verificación en dispositivo para la entrega real

**Target Platform**: iOS y Android (Capacitor). En web es no-op.

**Constraints**: iOS admite 64 notificaciones pendientes por app (se usan ~30); IDs fijos `7000..7029` para reemplazar sin duplicar; sin red (Principio I).

**Scale/Scope**: 1 dependencia, 1 módulo + test, cambios en `App.tsx`, `QuoteTime.tsx`, `QuoteTopics.tsx`, `Languages.tsx`, `Settings.tsx`, `IndexedDBService.ts` y `languages.ts`.

## Constitution Check

| Principio | Evaluación | Estado |
|---|---|---|
| I. Local-First / Sin Backend | Notificaciones **locales** programadas en el dispositivo; sin servidor. | PASS |
| II. Trilingüe Obligatorio | Textos nuevos (aviso de permiso, nombre del canal) en ES/EN/FR; la notificación usa el idioma de la app. | PASS |
| III. Mobile-First vía Capacitor | Plugin nativo; verificación en dispositivo real (la entrega no es verificable en el navegador). | PASS |
| IV. Monetización AdMob | Sin cambios en anuncios. | PASS |
| V. Reutilizar Antes de Duplicar | Se reutilizan el almacén de frases, `getRandomPhrase`-style de filtro por temas, `languages.ts` y el toggle existente; la única dependencia nueva está justificada (no hay mecanismo local de notificaciones). | PASS |

## Project Structure

```text
src/
├── notifications/
│   ├── dailyQuote.ts          # NUEVO: buildSchedule (pura), enable/disable/refresh
│   └── dailyQuote.test.ts     # NUEVO
├── persistence/
│   ├── IndexedDBService.ts    # + getAllPhrases()
│   └── languages.ts           # + AppNotificationsLanguage (ES/EN/FR)
├── App.tsx                    # no pedir permiso al arrancar; refreshDailyQuotes() tras initDB
└── pages/
    ├── QuoteTime.tsx          # al elegir hora: onboarding => enable; Ajustes => refresh si activo
    ├── QuoteTopics.tsx        # al continuar: refresh
    ├── Languages.tsx          # al elegir idioma: refresh
    └── Settings.tsx           # toggle controla enable/disable + aviso de permiso denegado
```

## Complexity Tracking

Sin violaciones.
