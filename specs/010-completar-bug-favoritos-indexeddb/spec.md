# Feature Specification: Corregir Bug en getFavoritePhrases

**Feature Branch**: `010-completar-bug-favoritos-indexeddb`

**Created**: 2026-09-18

**Status**: 🐛 Bug confirmado en código (TODO explícito del autor original)

**Input**: Deuda técnica identificada en exploración de código.

## Estado actual

En `src/persistence/IndexedDBService.ts` (línea ~36), `getFavoritePhrases()` consulta el índice `isFavorite` comparando contra el string `"true"` en vez del booleano `true`. El propio código tiene un comentario `// TODO Revisar el true en getAllFromIndex`. Dado que `Phrase.isFavorite` se define y guarda como `boolean`, esta comparación de tipos probablemente hace que la consulta nunca devuelva resultados reales.

## Requirements *(mandatory)*

- **FR-001**: `getFavoritePhrases()` DEBE consultar el índice `isFavorite` usando el tipo booleano correcto (`true`), consistente con cómo se almacena en `toggleFavorite` y en el modelo `Phrase`.
- **FR-002**: Agregar una verificación (test manual o unitario) que confirme que una frase marcada como favorita aparece en `getFavoritePhrases()`.

## Success Criteria *(mandatory)*

- **SC-001**: Tras marcar N frases como favoritas, `getFavoritePhrases()` devuelve exactamente esas N frases.

## Assumptions

- Este fix es prerequisito de `specs/007-completar-favoritos` — sin él, la pantalla de favoritos quedaría siempre vacía.
