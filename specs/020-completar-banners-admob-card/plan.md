# Implementation Plan: Completar Banners AdMob por Tarjeta

**Branch**: `develop` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/020-completar-banners-admob-card/spec.md`

## Summary

Cada tarjeta de Home reserva un espacio (`slot`) bajo la fila de chip y botones. Cuando la tarjeta termina de abrirse, mide ese espacio y pide un banner nativo cuyo margen inferior lo deja encima del slot; al cerrarse (o al salir de Home) lo oculta. Como el plugin de AdMob muestra **un solo banner nativo a la vez**, un coordinador pequeño (`src/ads/cardBanner.ts`) lleva la pila de tarjetas abiertas, serializa las llamadas al plugin y garantiza que nunca haya dos banners ni un banner fantasma. Los errores de carga se registran en consola, nunca en la UI.

## Technical Context

**Language/Version**: TypeScript ~5.1, React 18, Ionic 8 (sin cambios)

**Primary Dependencies**: `@capacitor-community/admob` 5.3.1 (ya instalado: `showBanner`, `hideBanner`, `resumeBanner`, `removeBanner`, eventos `bannerAdLoaded`/`bannerAdFailedToLoad`/`bannerAdSizeChanged`). Sin dependencias nuevas.

**Storage**: N/A (sin persistencia)

**Testing**: `vitest` para el coordinador con el plugin simulado (pila, serialización, no-op en web, modo pruebas); verificación visual en iOS y Android con anuncios de prueba (el banner es nativo y no se ve en jsdom ni en el navegador)

**Target Platform**: iOS y Android vía Capacitor. En el navegador (`npm run dev`) el coordinador es no-op.

**Constraints**:
- Banner nativo superpuesto, no un nodo DOM: su posición se fija con `margin` respecto al borde inferior (Android: borde inferior del contenido de la actividad; iOS: borde inferior de la zona segura).
- Un único banner nativo a la vez (FR-004).
- Intersticiales (45 s) y rewarded intactos (FR-008, Principio IV).
- IDs de prueba cuando `VITE_IS_TESTING === "true"` (se compara con la cadena; el valor crudo de `import.meta.env` es un string y `"false"` sería verdadero).

**Scale/Scope**: 1 módulo nuevo (`src/ads/cardBanner.ts`) + su test, cambios en `CardPhrase.tsx` y `CardsContainer.tsx`, limpieza de `bottomAdSpace`. Ver [data-model.md](./data-model.md).

## Constitution Check

| Principio | Evaluación | Estado |
|---|---|---|
| I. Local-First / Sin Backend | Los anuncios son una dependencia ya aceptada del modelo de negocio; no se añaden servidores propios. | PASS |
| II. Trilingüe Obligatorio | Sin textos nuevos visibles; cada tarjeta usa el identificador de su idioma. | PASS |
| III. Mobile-First vía Capacitor | Solo funciona en nativo; verificación en iOS y Android; no-op en web. | PASS |
| IV. Monetización AdMob | Es la propia feature: decisión de producto explícita del usuario (2026-10-02) y registrada en spec.md. Intersticiales y rewarded no se tocan. | PASS |
| V. Reutilizar Antes de Duplicar | Se reutilizan `adBannerId` por tarjeta (ya calculado), las env vars existentes y el plugin ya instalado; el coordinador evita lógica duplicada por tarjeta. | PASS |

Re-evaluado tras el diseño (Fase 1): sin cambios, todos PASS.

## Project Structure

### Documentation (this feature)

```text
specs/020-completar-banners-admob-card/
├── plan.md  research.md  data-model.md  quickstart.md  tasks.md
└── checklists/requirements.md
```

### Source Code (archivos afectados)

```text
src/
├── ads/
│   ├── cardBanner.ts          # NUEVO: coordinador (pila de tarjetas abiertas, cola serializada)
│   ├── cardBanner.test.ts     # NUEVO: tests con AdMob simulado
│   └── bannerMargin.ts        # NUEVO: cálculo del margen a partir del rect del slot (+ zona segura iOS)
└── components/home/
    ├── CardPhrase.tsx         # slot reservado + efecto abrir/cerrar; quitar bottomAdSpace e imports sin uso
    └── CardsContainer.tsx     # ocultar/mostrar al salir/volver a Home (ciclo de vida de la vista Ionic)
```

**Structure Decision**: carpeta nueva `src/ads/` (la lógica de anuncios hoy vive mezclada en `MainHome.tsx`; no se refactoriza aquí, queda fuera de alcance).

## Complexity Tracking

Sin violaciones. El coordinador es la única pieza "extra" y está justificado por la restricción de banner único (research.md Decisión 2).
