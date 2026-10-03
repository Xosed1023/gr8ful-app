# Implementation Plan: Completar Favoritos

**Branch**: `develop` | **Date**: 2026-09-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/017-completar-favoritos/spec.md`

## Summary

Corrige el bug de tipo en `getFavoritePhrases()` (compara contra el string `"true"` en vez del booleano `true`), cablea el botón de bookmark ya presente pero comentado en `CardPhrase.tsx`, y agrega un tercer tab "Favoritos" a la navegación principal (`MainHome.tsx`) con una pantalla nueva que lista y permite desmarcar favoritos. Para la consistencia de estado entre Home y Favoritos (FR-009), se usa el hook de ciclo de vida nativo de Ionic `useIonViewWillEnter` en ambas pantallas — mismo patrón arquitectónico ya usado en `specs/016-auditoria-buenas-practicas` para refrescar datos al revisitar una pestaña (Home/Settings + idioma), evitando inventar un mecanismo nuevo de sincronización entre pantallas.

## Technical Context

**Language/Version**: TypeScript ~5.1, sin cambios

**Primary Dependencies**: `@ionic/react` 8.x (`useIonViewWillEnter`, `IonList`/`IonItem` para la nueva pantalla), `ionicons` (`bookmark`/`bookmarkOutline`, ya usados en el proyecto), `idb` (sin cambios de API, solo corrección de un valor de consulta)

**Storage**: IndexedDB vía `IndexedDBService` — no cambia el esquema (`Phrase.isFavorite` ya existe), solo corrige una consulta

**Testing**: `vitest` (`npm run test.unit`) para regresión; sin suite de componentes existente, verificación funcional principalmente manual (ver quickstart.md)

**Target Platform**: Navegador (`npm run dev`) + verificación en iPhone físico (patrón ya establecido en sesiones previas)

**Project Type**: Mobile-app (Ionic + Capacitor + React), sin backend — feature 100% local

**Performance Goals**: N/A — volumen de datos es el catálogo local de frases (decenas/cientos), sin paginación necesaria

**Constraints**: No debe romper la lógica de selección aleatoria de frases (`getRandomPhrase`) ni la persistencia existente de `toggleFavorite`; no se agrega ninguna dependencia nueva; el ícono de bookmark no debe interferir con el gesto de expandir/colapsar la tarjeta (FR-010)

**Scale/Scope**: 1 corrección de bug (1 línea), 1 componente existente modificado (`CardPhrase.tsx`) + su padre (`CardsContainer.tsx`), 1 pantalla nueva (`Favorites.tsx`), 1 tab nuevo en `MainHome.tsx`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Local-First / Sin Backend | No se introduce backend ni nuevo mecanismo de almacenamiento; se sigue usando IndexedDB ya existente (`toggleFavorite`, y `getFavoritePhrases` corregido). | PASS |
| II. Trilingüe Obligatorio (ES/EN/FR) | FR-008 exige que Favoritos respete el idioma seleccionado; se reusa `useAppLanguage()` (Spec 016) para esto — sin textos hardcodeados nuevos en un solo idioma. | PASS |
| III. Mobile-First vía Capacitor | Tab nuevo y pantalla nueva siguen los mismos patrones de Ionic (`IonTabButton`, `IonList`) ya usados; no depende de ninguna API nativa nueva. Se verifica en dispositivo físico (quickstart.md). | PASS |
| IV. Monetización AdMob como Restricción de Diseño | No se toca AdMob directamente. Nota de diseño: el `IonTabButton` de Home hoy dispara `loadRandomPhraseWithAd()` (rewarded ad) en cada tap, incluso al volver desde otro tab — comportamiento preexistente con un TODO ya documentado en el código (`MainHome.tsx`), no se modifica ni se depende de él para esta spec. | PASS |
| V. Reutilizar Antes de Duplicar | Se reusa `useAppLanguage()` (Spec 016) para el idioma en Favoritos, y se introduce `useIonViewWillEnter` como patrón consistente con el ya usado para refrescar idioma en Home/Settings (Spec 016) — mismo enfoque arquitectónico para el mismo tipo de problema (refrescar datos al revisitar una pestaña). | PASS |

No hay violaciones. No se requiere `Complexity Tracking`.

## Project Structure

### Documentation (this feature)

```text
specs/017-completar-favoritos/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
└── tasks.md              # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

No se genera `contracts/`: no hay interfaz externa (API/CLI) — es una feature de UI + persistencia local ya existente.

### Source Code (repository root)

```text
gr8ful-app/
└── src/
    ├── persistence/
    │   └── IndexedDBService.ts     # FIX: getFavoritePhrases() compara contra `true` booleano, no "true" string
    ├── components/home/
    │   ├── CardPhrase.tsx           # Descomenta y cablea el botón bookmark; recibe isFavorite + onToggleFavorite como props (no accede a IndexedDB directamente)
    │   └── CardsContainer.tsx       # Dueño del estado isFavorite de la frase actual; toggle vía IndexedDBService.toggleFavorite; refresca con useIonViewWillEnter (consistencia con Favorites)
    ├── pages/
    │   ├── Favorites.tsx             # NUEVA — lista de frases favoritas (IonList/IonItem), estado vacío, desmarcar in-place, useIonViewWillEnter para refrescar al revisitar
    │   └── MainHome.tsx              # Agrega Route "/tabs/favorites" + IonTabButton "favorites" (bookmark icon) a la barra de 3 tabs
    └── models/
        └── Phrase.ts                 # Sin cambios de estructura — ya tiene id/isFavorite
```

**Structure Decision**: Proyecto mobile-app único ya existente; no se reestructuran carpetas. `Favorites.tsx` se ubica junto al resto de `src/pages/` (mismo nivel que `Home.tsx`, `Settings.tsx`), consistente con la convención ya establecida del proyecto.

## Complexity Tracking

No aplica — no hay violaciones de la Constitution Check que justificar.
