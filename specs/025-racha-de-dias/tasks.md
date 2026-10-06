---
description: "Task list: racha de días"
---

# Tasks: Racha de Días

## Phase 1 — Lógica
- [X] T001 `src/streak/streak.ts`: `parseStreak`, `daysBetween`, `registerOpen`, `acceptRescue`, `declineRescue`, `loadStreak`, `saveStreak`
- [X] T002 [P] `src/streak/streak.test.ts`: día siguiente, mismo día, rescate (diff 2), pérdida (≥ 3), racha 1 sin rescate, reloj atrasado, datos corruptos, mejor racha
- [X] T003 `src/ads/rewarded.ts` (`showRewarded`) y `MainHome.tsx` lo usa

## Phase 2 — Estado y UI
- [X] T004 `src/streak/useStreak.ts` (arranque + vuelta del segundo plano, solo con onboarding completo)
- [X] T005 Textos EN/ES/FR en `src/persistence/languages.ts`
- [X] T006 `StreakPill.tsx` + estilos en `HomeKit.css`
- [X] T007 `StreakRescue.tsx` (aviso con reintento y «Empezar de nuevo») y montaje en `Home.tsx`

## Phase 3 — Verificación
- [X] T008 `tsc`, `lint`, `vitest`, `npm run build`, `npx cap sync ios`
- [X] T009 probar en iPhone según `quickstart.md`
- [X] T010 Cerrar: `Status` de `spec.md`, quitar la entrada del `BACKLOG.md`
