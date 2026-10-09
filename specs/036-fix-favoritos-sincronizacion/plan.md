# Plan: Sincronización de favoritos

- `src/persistence/phrasePatch.ts`: `applyPhrasePatch` y `flipPhraseFavorite` sobre un almacén mínimo (`get`/`put`), con tests y un almacén en memoria.
- `src/persistence/IndexedDBService.ts`: `patchPhrase`, `flipFavorite` y `markPhraseShown` abren UNA transacción `readwrite` y delegan en lo anterior; `toggleFavorite` pasa a usar `patchPhrase`.
- `src/components/home/CardsContainer.tsx`: `useIonViewWillEnter(…, [phrase.id])` y `flipFavorite` en el manejador del corazón.
- `src/pages/MainHome.tsx`: `markShown` usa `markPhraseShown` (solo `hasShown`).
- Verificación: `specs/036-fix-favoritos-sincronizacion/verify-favoritos.mjs` (Playwright contra `npm run dev`).

## Otros hooks de Ionic revisados
Los demás `useIonView*` del proyecto usan funciones estables, refs o no leen estado de la renderización (Streak, tutorial, calm-enter, Settings, Favoritos), así que no tienen este problema.
