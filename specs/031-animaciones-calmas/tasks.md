---
description: "Task list: animaciones calmas"
---

# Tasks: Animaciones Calmas

## Fase 1 — Sistema y onboarding
- [X] T001 Tokens `--motion-*` en `variables.css` y utilidades `.calm-*` en `motion.css`
- [X] T002 `src/theme/motion.ts` (API framer-motion, resorte sobreamortiguado) y `motion.test.ts`
- [X] T003 `useCalmEnter` (entrada escalonada al mostrar cada pantalla)
- [X] T004 Transición de pantallas por fundido (`pageTransition.ts` + `navAnimation`), respetando pestañas y gesto de volver
- [X] T005 `OnboardingKit.css`: quitar overshoot, destellos lentos, entrada escalonada de opciones
- [X] T006 Welcome, Languages, Gender, QuoteTime, QuoteTopics, UserName con `calm-stagger`
- [X] T007 `OnboardingProgress`, `LoadingScreen` y `useSelectThenAdvance` alineados con los tokens
- [X] T008 Sección «Movimiento» en `stitch/DESIGN.md`
- [X] T009 Verificación: `tsc`, `lint`, `vitest`, `build` y fotogramas de las transiciones con Playwright
- [X] T010 probar en iPhone y Android (sobre todo el gesto de volver en iOS)

## Fase 2 — Resto de la app (tras integrar las ramas 028–030)
- [X] T011 Home y `CardsContainer`: entrada escalonada de saludo, tarjetas y pie; suavizar `ENTER/OPEN/CLOSE_SPRING` de `CardPhrase` a `CALM_SPRING`
- [X] T012 Favoritos: entrada de la lista y quitar un favorito con fundido
- [X] T013 Ajustes: entrada escalonada de tarjetas; el interruptor (`Settings.css:234`) usa una curva con overshoot → sin rebote
- [X] T014 Racha: `StreakPill` y `StreakRescue`/mensaje de racha restaurada con `calmFadeUp`/`CALM_SPRING`
- [X] T015 `ShareSheet` y tutorial guiado con `calmFade`/`calmFadeUp`
- [X] T016 Cerrar: `Status` de `spec.md`
