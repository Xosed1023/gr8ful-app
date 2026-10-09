---
description: "Task list: tutorial guiado y aviso del widget"
---

# Tasks: Tutorial Guiado y Aviso del Widget

## Phase 1 — Base
- [X] T001 `tutorialState.ts` (flag, activo, repetición, `shouldStartTutorial`) y `tutorialState.test.ts`
- [X] T002 `tutorialLanguage.ts` (EN/ES/FR)
- [X] T003 `widgetData.ts`: `requestWidgetPin` + tests; `WidgetBridgePlugin.java`: `requestPin`

## Phase 2 — UI
- [X] T004 `WidgetGuide.tsx/.css` (cuerpo reutilizable + modal)
- [X] T005 `Tutorial.tsx/.css` (foco, pasos, bloqueadores, reduced motion)
- [X] T006 `useTutorialTrigger.ts` y montaje en `Home.tsx`
- [X] T007 `CardPhrase.tsx`: atributos `data-tutorial*` y modo sin anuncios
- [X] T008 `Settings.tsx`: filas «Añadir widget…» y «Ver el tutorial de nuevo»

## Phase 3 — Verificación
- [X] T009 `tsc`, `lint`, `vitest`, `build`, `assembleDebug`; capturas con Playwright
- [ ] T010 **Requiere a la usuaria** — probar en teléfono según `quickstart.md`
