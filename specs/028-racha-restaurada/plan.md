# Implementation Plan: Mensaje de Racha Restaurada

**Spec**: [spec.md](./spec.md)

## Summary

`StreakRescue` ya es el único punto de montaje del aviso. Al completarse el anuncio guarda localmente la racha anterior y pasa a mostrar `StreakRestored` dentro del **mismo overlay** (el fondo no parpadea), con fundido cruzado entre la tarjeta del rescate y la del mensaje.

## Constitution Check

Local-first ✔ · trilingüe ✔ (textos en `streakCopy.ts`) · mobile-first ✔ · reutilizar antes de duplicar ✔ (mismo overlay y tokens del aviso).

## Diseño

- **`StreakRescue.tsx`**: nuevo estado `restored: { from } | null`. `accept` guarda `from` antes de llamar a `onAccept()`; si hay recompensa, `setRestored`. El overlay se muestra mientras `open || restored`. Dentro, `AnimatePresence mode="wait"` alterna la tarjeta del rescate y `StreakRestored`. El banner nativo se oculta mientras el overlay está visible. Tocar el overlay en modo restaurado lo cierra. Prop opcional `restoredDuration` (solo para tests).
- **`StreakRestored.tsx`** (nuevo): tarjeta con llama + halo que respira (CSS), título, número (`AnimatePresence`, de `from` a `from + 1` a los 900 ms), unidad y frase. Temporizador de ~3,5 s (`RESTORED_MS`). Curva `[0.22, 0.61, 0.36, 1]`, sin muelles. Con reduced motion: sin animaciones y ya con N+1.
- **`streakCopy.ts`** (nuevo): textos ES/EN/FR.
- **`streakHaptics.ts`** (nuevo): `hapticSoftSuccess` (notificación de éxito del sistema; respeta el interruptor de hápticos; vibración breve de respaldo en web).
- **`StreakRescue.css`**: estilos del mensaje con tokens (`--streak-tint`, `--streak-accent`, `--text-muted`); halo con `@keyframes streak-breathe`. Corrige de paso el texto del botón principal (`--btn-text`, antes blanco fijo, con poco contraste en oscuro).
- **`useStreak.ts`**: sin cambios; la racha se guarda al aceptar y la píldora de Home se actualiza detrás del fondo atenuado, así que al cerrarse el mensaje ya muestra N+1.

## Estructura

```text
src/components/home/StreakRestored.tsx, StreakRescue.test.tsx
src/streak/streakCopy.ts, streakCopy.test.ts, streakHaptics.ts
```

## Riesgos

- Las animaciones de salida de framer-motion no terminan en jsdom: los tests sustituyen framer-motion por elementos planos; el movimiento se verifica en navegador.
- El háptico solo se puede sentir en teléfono.
