# Implementation Plan: Racha de Días

**Spec**: [spec.md](./spec.md)

## Summary

Lógica pura y testeable en `src/streak/`, persistida en `localStorage`, evaluada al arrancar y al volver del segundo plano. La UI añade una píldora en Home y un aviso de rescate. El anuncio recompensado se extrae de `MainHome.tsx` a un módulo reutilizable.

## Constitution Check

- **Local-first**: solo `localStorage`. ✔
- **Trilingüe**: textos EN/ES/FR en `src/persistence/languages.ts`. ✔
- **Mobile-first / AdMob**: reutiliza el rewarded existente. ✔
- **Reutilizar antes de duplicar**: se extrae `showRewarded()` y `MainHome` lo usa también. ✔

## Diseño

### Lógica (`src/streak/streak.ts`, pura)
- `StreakState = { current, best, lastDay }`; `parseStreak(raw)` tolera datos corruptos.
- `daysBetween(a, b)` sobre claves `YYYY-MM-DD` (reutiliza `dateKey` de `src/daily/dailyPlan.ts`).
- `registerOpen(state, today)` → `{ state, rescue }`:
  - sin `lastDay` → `current = 1`;
  - diff 0 → igual; diff 1 → `current + 1`;
  - diff 2 con `current ≥ 2` → `rescue = { streak }` y **el estado no cambia** (así el aviso reaparece si se cierra la app);
  - diff ≥ 2 en otro caso → `current = 1`;
  - diff < 0 → igual. `best = max(best, current)`.
- `acceptRescue(state, today)` → `current + 1`; `declineRescue(state, today)` → `current = 1`. Ambos fijan `lastDay = today`.
- `loadStreak()` / `saveStreak()` sobre `localStorage.streak`.

### Estado en React (`src/streak/useStreak.ts`)
- Evalúa al montar y con `App.addListener("appStateChange")` al pasar a activo, solo si `isOnboardingComplete()`.
- Expone `{ current, rescue, acceptRescue, declineRescue }`.

### Anuncio (`src/ads/rewarded.ts`)
- `showRewarded(): Promise<boolean>` con los IDs de prueba hoy en `MainHome.tsx`; devuelve `true` si hay recompensa. `MainHome` pasa a usarlo.

### UI
- `src/components/home/StreakPill.tsx` + estilos en `HomeKit.css`: vidrio, llama (`flame` de ionicons), número; paleta por tokens existentes.
- `src/components/home/StreakRescue.tsx`: aviso modal (mismo patrón visual que `ShareSheet`) con «Ver anuncio» y «Empezar de nuevo»; reintento si el anuncio falla.
- Se montan desde `Home.tsx`.

## Estructura

```text
src/streak/streak.ts, streak.test.ts, useStreak.ts
src/ads/rewarded.ts
src/components/home/StreakPill.tsx, StreakRescue.tsx
```

## Riesgos

- El rewarded puede no cargar sin red: siempre hay «Empezar de nuevo».
- Posición de la píldora frente a la barra superior en distintos tamaños: verificar en iPhone.
