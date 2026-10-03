---
description: "Task list: onboarding interrumpido"
---

# Tasks: Onboarding Interrumpido

- [X] T001 Crear `src/persistence/onboardingState.ts`: `isOnboardingComplete()` (con migración por `name` no vacío) y `markOnboardingComplete()` (plan.md Decisión 2)
- [X] T002 [P] Crear `src/persistence/onboardingState.test.ts`: sin marca ni nombre → false; con marca → true; con nombre y sin marca → true y guarda la marca; nombre vacío o solo espacios → false; `markOnboardingComplete` pone la marca; `gr8fulFirstTime` solo no basta
- [X] T003 [US1] `src/pages/Welcome.tsx`: redirigir a `/mainHome` solo si `isOnboardingComplete()` (en lugar de `gr8fulFirstTime === "true"`)
- [X] T004 [US1] `src/pages/UserName.tsx`: llamar `markOnboardingComplete()` en `handleFinish` tras guardar `name` y antes de navegar
- [X] T005 `npm run lint && npm run build && npm run test.unit` — 0 errores nuevos — **Resultado**: `tsc`, `eslint`, `vite build` sin errores; `vitest` 39/39 (6 tests nuevos del helper)
- [X] T006 — Verificación en dispositivo: (a) instalar de cero, elegir idioma, cerrar la app, reabrir → bienvenida; (b) terminar el onboarding, reabrir → Home; (c) con una instalación previa con nombre → Home — **verificado en iPhone (2026-10-02)**
- [X] T007 Cerrar: `Status` de `spec.md` a «Implementado»; quitar la entrada de `specs/BACKLOG.md`

## Dependencies

T001 → (T002 ∥ T003 ∥ T004) → T005 → T006 → T007
