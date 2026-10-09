# Implementation Plan: Animaciones Calmas

**Spec**: [spec.md](./spec.md)

## Summary

Un sistema de movimiento único (tokens CSS, utilidades, API de framer-motion), una transición de pantallas por fundido y la aplicación en las zonas que no se tocan en paralelo (bienvenida, onboarding, carga). La fase 2 lo extiende a Home, tarjetas, Favoritos, Ajustes, racha y tutorial.

## Constitution Check

Local-first ✔ · mobile-first ✔ (movimiento reducido respetado) · reutilizar antes de duplicar ✔ (una sola fuente de curvas y duraciones).

## Diseño

- **Tokens** `--motion-*` en `src/theme/variables.css`: curvas (`--motion-ease`, `--motion-ease-inout`), duraciones (300/500/700 ms, 9 s ambiental), distancias (14/10 px), escalonado 80 ms, pulsación 0.985.
- **Utilidades** `src/theme/motion.css`: `.calm-in`, `.calm-fade`, `.calm-stagger.calm-run`, `.calm-press`, `.calm-breathe`; `fill-mode: backwards` para no retener `transform`.
- **Hook** `src/theme/useCalmEnter.ts`: usa `useIonViewWillEnter` para reiniciar `.calm-run` cada vez que Ionic va a mostrar la pantalla (Ionic mantiene montadas las anteriores).
- **framer-motion** `src/theme/motion.ts`: `CALM_EASE`, `CALM_DURATION`, `CALM_SPRING` (cociente de amortiguamiento > 1), `calmTransition`, `calmFadeUp`, `calmFade`, `calmStagger`.
- **Transición de pantallas** `src/theme/pageTransition.ts` vía `setupIonicReact({ navAnimation })`: la saliente se funde (320 ms) y la entrante entra con fundido y 10 px de ascenso (solo hacia delante). Delega en la animación por defecto de Ionic para el outlet de pestañas (`baseEl.closest("ion-tabs")`) y para el gesto de volver (`progressAnimation`).
- **Aplicación fase 1**: `OnboardingKit.css` (sin overshoot, destellos lentos, entrada escalonada de opciones), `Welcome`, los cinco pasos, `OnboardingProgress`, `LoadingScreen`, `useSelectThenAdvance` (salida de 300 ms).

## Estructura

```text
src/theme/{motion.css, motion.ts, motion.test.ts, useCalmEnter.ts, pageTransition.ts}
```

## Riesgos

- La animación global afecta a cualquier pantalla del router principal, incluido `/mainHome`; las pestañas conservan la de Ionic.
- La salida de la pantalla vacía entre fundidos deja ver brevemente el fondo; es deliberado (respiro).
