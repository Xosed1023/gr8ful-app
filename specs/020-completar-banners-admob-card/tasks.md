---
description: "Task list: banners AdMob por tarjeta de Home"
---

# Tasks: Completar Banners AdMob por Tarjeta

**Input**: Design documents from `/specs/020-completar-banners-admob-card/` (plan.md, spec.md, research.md, data-model.md, quickstart.md)

**Tests**: `vitest` para el coordinador (plugin simulado); el resto se valida en dispositivo con quickstart.md (banner nativo, no verificable en jsdom).

**Regla transversal**: no se tocan los intersticiales ni el rewarded de `MainHome.tsx` (FR-008, Principio IV).

---

## Phase 1: Setup

- [X] T001 Verificar `git status` limpio y baseline `npm run lint && npm run build && npm run test.unit` sin errores nuevos — baseline: árbol limpio tras los commits 018/019

---

## Phase 2: Foundational — coordinador y margen (bloquea US1-US3)

- [X] T002 [P] Crear `src/ads/bannerMargin.ts`: `computeBannerMargin(rect, platform)` = `max(0, round(window.innerHeight − rect.bottom − safeAreaBottom))` con `safeAreaBottom` solo en iOS (elemento de prueba con `padding-bottom: env(safe-area-inset-bottom)`) y una constante `PLATFORM_OFFSET` por plataforma, inicialmente `0` (data-model.md VR-001, research.md R1)
- [X] T003 Crear `src/ads/cardBanner.ts` según data-model.md: `showCardBanner`, `hideCardBanner`, `setHomeVisible`; pila de tarjetas abiertas (una entrada por `ownerId`), cola de promesas serializada, reglas `apply` (hideBanner / resumeBanner / removeBanner+showBanner), opciones `ADAPTIVE_BANNER` + `BOTTOM_CENTER` + `isTesting: import.meta.env.VITE_IS_TESTING === "true"`, `adId` vacío = no-op, no-op si `!Capacitor.isNativePlatform()`, errores a `console.error`, listener único de `bannerAdFailedToLoad` con `console.warn`
- [X] T004 [P] Crear `src/ads/cardBanner.test.ts` (vitest, `@capacitor-community/admob` y `@capacitor/core` simulados): abrir una tarjeta llama `showBanner` con el margen y `isTesting` correctos; cerrar llama `hideBanner`; reabrir la misma (mismo margen) llama `resumeBanner`; abrir dos tarjetas deja solo la última y al cerrarla reanuda la anterior; `setHomeVisible(false)` oculta y `true` reanuda; `adId` vacío no llama al plugin; en web no llama al plugin; abrir/cerrar rápido no deja más de un banner creado — **Resultado**: 11 tests OK

**Checkpoint**: `npm run test.unit` en verde

---

## Phase 3: User Story 1 — Banner al abrir la tarjeta (Priority: P1) 🎯 MVP

**Independent Test**: quickstart.md §2.

- [X] T005 [US1] En `src/components/home/CardPhrase.tsx`: añadir el slot (`div` transparente, `min-h-[60px]`, `mt-4`, con `ref`) bajo la fila de chip y botones; estado `settledOpen` (`true` en `onAnimationComplete` si `isExpanded`, `false` al pulsar para cerrar); `useEffect` sobre `settledOpen` que mide el slot, calcula el margen (`computeBannerMargin`) y llama `showCardBanner({ ownerId: language, adId: adBannerId, margin })`, con limpieza que llama `hideCardBanner(language)`
- [X] T006 [US1] En `src/components/home/CardPhrase.tsx`: eliminar `bottomAdSpace` de las 6 entradas de `colorConfig` y los imports `BannerAd*` sin uso (FR-011); `isPlatform` solo si sigue usándose

**Checkpoint**: quickstart.md §2 en un dispositivo

---

## Phase 4: User Story 2 — Sin huecos ni banners fuera de Home (Priority: P1)

**Independent Test**: quickstart.md §3.

- [X] T007 [US2] En `src/components/home/CardsContainer.tsx`: `useIonViewWillLeave(() => setHomeVisible(false))` y `useIonViewDidEnter(() => setHomeVisible(true))` (junto al `useIonViewWillEnter` existente)
- [X] T008 [US2] Confirmar que ningún error de carga llega a la UI (sin toast): el único aviso es `console.warn` del listener (research.md Decisión 6)

---

## Phase 5: User Story 3 — Posición, temas y plataformas (Priority: P2)

**Independent Test**: quickstart.md §4-§5.

- [X] T009 [US3] Verificar en iOS y Android (claro/oscuro, 3 tarjetas) y, si hay desfase constante, ajustar `PLATFORM_OFFSET` en `src/ads/bannerMargin.ts` (quickstart.md §5) — **iOS verificado** en iPhone 17 Pro (2026-10-02): posición correcta sin calibrar (`PLATFORM_OFFSET` queda en 0). **Android sin verificar**: no hay dispositivo disponible; queda registrado como riesgo R1 y en `specs/BACKLOG.md`

---

## Phase 6: Polish

- [X] T010 `npm run lint && npm run build && npm run test.unit` — 0 errores nuevos — **Resultado**: `tsc`, `eslint` y `vite build` sin errores; `vitest` 16/16 (el `ReferenceError: indexedDB` de `App.test.tsx` ya existía)
- [X] T011 Búsqueda de restos: `grep -rn "bottomAdSpace\|BannerAdPluginEvents" src` — sin referencias a código obsoleto
- [X] T012 Verificación manual (quickstart.md §2-§4) — Verificación manual completa (quickstart.md §2-§4) en iOS y Android — **hecha en iOS** (iPhone 17 Pro); Android no verificado
- [X] T013 Cerrar: `Status` de `spec.md` a «Implementado (verificado en iOS)»

---

## Dependencies

Setup → Foundational (T002 ∥ T004; T003 antes de T004 pasa) → US1 (T005 → T006) → US2 (T007, T008) → US3 (T009) → Polish

## Implementation Strategy

1. **MVP**: Foundational + US1 (banner al abrir) → probar en un dispositivo.
2. US2 (ciclo de vida de Home) y calibración de posición (US3).
3. Polish y verificación manual en ambas plataformas.
