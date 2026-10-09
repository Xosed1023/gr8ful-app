# Plan: Ver en otros idiomas

- `src/pages/favoritesCopy.ts` (de la spec 034) ampliado: «Ver en otros idiomas», «Ocultar idiomas» y etiqueta de copiar versión.
- `src/pages/favoriteLanguages.ts`: función pura `otherLanguages(current)` (orden fijo) con test, y nombres nativos.
- `Favorites.tsx`: estado `expanded` por tarjeta, `AnimatePresence` con altura/fundido calmos (`calmTransition`), botón de copiar por versión.
- `Favorites.css`: estilos de la fila de acciones y del bloque desplegable, con tokens de movimiento.
