# Implementation Plan: Auditoría de Buenas Prácticas — Reuso y Tipado

**Branch**: `develop` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/016-auditoria-buenas-practicas/spec.md`

## Summary

Auditoría de calidad sobre todo `src/` con foco priorizado en (1) reutilización antes de duplicación y (2) tipado TypeScript. La investigación previa (ver `research.md`) identificó 6 patrones de duplicación cross-file y 7 hallazgos de tipado, todos verificables con cita de archivo/línea. El plan extrae dos hooks compartidos (`useAppLanguage`, `useUserGender`), un helper de haptics, un componente `BackButton`, y corrige tipados débiles (`any` explícito en `QuoteTopics.tsx`, un tipo `Topic` sin exportar que hoy funciona como global implícito, y una inconsistencia de prop opcional/obligatoria en `backTo`). No se introduce arquitectura nueva: todo se ubica en la estructura de carpetas ya existente (`src/hooks/`, `src/models/`, y una carpeta nueva `src/components/common/` para UI compartida no ligada a `home/`).

## Technical Context

**Language/Version**: TypeScript ~5.1 (`"strict": true` ya activo en `tsconfig.json`), sin cambio de versión

**Primary Dependencies**: React 18.x, `@ionic/react` 8.x, `@capacitor/haptics` 7.x (afectado por el helper de haptics), `react-router-dom` 5.x — ninguna dependencia cambia de versión como parte de esta spec

**Storage**: `localStorage` (idioma, género — leídos hoy de forma dispersa; los hooks nuevos centralizan la lectura, no cambian el mecanismo) — sin cambios de persistencia

**Testing**: `vitest` (`npm run test.unit`) para regresión; sin tests automatizados nuevos (no hay suite de componentes hoy — ver Assumptions)

**Target Platform**: Navegador (`npm run dev`) para verificación funcional rápida; verificación manual adicional en iOS (dispositivo físico ya configurado en sesiones previas) para los call-sites de `Haptics.impact`, que solo tienen efecto real en dispositivo nativo

**Project Type**: Mobile-app (Ionic + Capacitor + React), sin backend propio — refactor interno, no se tocan `android/`/`ios/` nativos

**Performance Goals**: N/A — refactor de calidad, no de performance

**Constraints**: Ningún cambio de comportamiento observable (FR-004); ningún salto de versión de dependencias (FR-006); no duplicar `specs/007`-`014` (FR-005) — en particular A4 (botón atrás compartido) debe coordinarse con `specs/010-completar-back-button-languages` sin resolver su lógica pendiente

**Scale/Scope**: 8 pantallas con el patrón de idioma duplicado (A1/B4), 6 archivos con el patrón de género duplicado (A2/B5), 7 archivos con `Haptics.impact` repetido (A3), 4-5 archivos con botón atrás duplicado (A4), 2 usos de `any` explícito (B1/B2), 1 tipo sin exportar usado como global implícito (B3)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Local-First / Sin Backend | No se introduce backend ni nuevo mecanismo de almacenamiento; los hooks `useAppLanguage`/`useUserGender` siguen leyendo `localStorage` igual que hoy, solo centralizan el acceso. | PASS |
| II. Trilingüe Obligatorio (ES/EN/FR) | A1/B4 tocan directamente la lógica de selección de idioma en 8 pantallas — riesgo más alto de esta spec. FR-004 exige verificación manual de que EN/ES/FR siguen funcionando igual en cada pantalla afectada (ver quickstart.md). | PASS (condicionado a verificación manual por pantalla) |
| III. Mobile-First vía Capacitor | El helper de haptics (A3) toca `@capacitor/haptics` en 7 archivos; no cambia comportamiento esperado (mismo `ImpactStyle.Medium`), pero solo es verificable en dispositivo real, no en `npm run dev`. | PASS (condicionado a verificación en dispositivo) |
| IV. Monetización AdMob como Restricción de Diseño | Esta spec no toca `MainHome.tsx` en su lógica de AdMob (ya resuelta en Spec 015); `CardPhrase.tsx` sí se toca pero solo en A5 (extracción de `bottomAdSpace`), sin cambiar el valor calculado. | PASS |
| V. Reutilizar Antes de Duplicar | Es el objetivo central de esta spec (User Story 1). | PASS |

No hay violaciones. No se requiere `Complexity Tracking`.

## Project Structure

### Documentation (this feature)

```text
specs/016-auditoria-buenas-practicas/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md         # Phase 1 output (/speckit-plan command)
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

No se genera `contracts/`: esta feature no expone ni modifica ninguna interfaz externa — es un refactor interno de `src/`, validado con los scripts npm existentes y verificación manual.

### Source Code (repository root)

```text
gr8ful-app/
└── src/
    ├── hooks/
    │   ├── useAppLanguage.ts      # NUEVO — centraliza lectura de `language` de localStorage + resolución tipada de diccionarios (A1/B4)
    │   ├── useUserGender.ts       # NUEVO — centraliza lectura de `gender` de localStorage, tipado M|W (A2/B5)
    │   └── useHaptics.ts          # NUEVO — helper `hapticTap()` con el try/catch + fallback a navigator.vibrate que hoy solo existe en CardPhrase.tsx (A3)
    ├── components/
    │   ├── common/                 # NUEVA carpeta — UI compartida no ligada a home/
    │   │   └── BackButton.tsx      # NUEVO — botón atrás compartido (A4); coordina con specs/010 sin resolver su alcance
    │   └── home/
    │       ├── CardsContainer.tsx  # Migra a useUserGender(); A6 (tabla de colores por género) opcional/baja prioridad
    │       ├── CardPhrase.tsx      # Migra Haptics.impact a hapticTap(); A5 (bottomAdSpace) opcional/baja prioridad
    │       └── Greetings.tsx       # Migra a useUserGender(); agrega interface Props (B7)
    ├── models/
    │   ├── Topic.ts                 # Fix: agregar `export` (B3)
    │   └── Language.ts               # NUEVO o mover LanguageKeys aquí desde persistence/languages.ts (B4) — decisión en research.md
    ├── persistence/
    │   └── languages.ts             # Exporta LanguageKeys (o lo re-exporta desde models/Language.ts según decisión)
    └── pages/
        ├── Gender.tsx, Languages.tsx, QuoteTime.tsx, QuoteTopics.tsx,
        ├── UserName.tsx, Home.tsx, Settings.tsx, LoadingScreen.tsx
        │   # Migran a useAppLanguage()/useUserGender()/hapticTap()/BackButton según aplique a cada una (A1-A4)
        └── QuoteTopics.tsx           # Fix adicional: any -> Topic[] (B1/B2)
```

**Structure Decision**: Proyecto mobile-app único ya existente; no se reestructuran carpetas salvo la adición de `src/components/common/` para UI compartida que no pertenece a `home/`. Todos los hooks nuevos van a `src/hooks/` (carpeta ya existente, coherente con Principio V). No se toca `android/`/`ios/` nativo ni `package.json`.

## Complexity Tracking

No aplica — no hay violaciones de la Constitution Check que justificar.
