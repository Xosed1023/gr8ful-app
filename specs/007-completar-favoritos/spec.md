# Feature Specification: Completar Favoritos

**Feature Branch**: `007-completar-favoritos`

**Created**: 2026-09-18

**Status**: ⚠️ Deuda técnica — backend de datos listo, sin UI

**Input**: Deuda técnica identificada en exploración de código.

## Estado actual

- **Datos**: `Phrase.isFavorite` (modelo), `IndexedDBService.toggleFavorite(id, isFavorite)`, `IndexedDBService.getFavoritePhrases()` — completamente funcionales.
- **UI**: el botón de bookmark en `src/components/home/CardPhrase.tsx` (~líneas 164-185) está comentado. No existe ninguna pantalla que liste los favoritos guardados.
- **Bug relacionado**: `getFavoritePhrases` compara `isFavorite` con el string `"true"` en vez del booleano `true` — ver spec `010-completar-bug-favoritos-indexeddb`. Debe corregirse junto con esta feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marcar una frase como favorita (Priority: P1)

El usuario toca el ícono de bookmark en una tarjeta expandida y la frase queda guardada como favorita.

**Acceptance Scenarios**:

1. **Given** una tarjeta expandida, **When** el usuario toca bookmark, **Then** se llama `toggleFavorite(id, true)` y el ícono refleja el nuevo estado (relleno vs. outline).
2. **Given** una frase ya marcada como favorita, **When** el usuario vuelve a tocar bookmark, **Then** se desmarca (`toggleFavorite(id, false)`).

### User Story 2 - Ver lista de frases favoritas (Priority: P2)

El usuario accede a una pantalla/sección que lista todas sus frases favoritas guardadas.

**Acceptance Scenarios**:

1. **Given** el usuario tiene N frases favoritas, **When** abre la pantalla de favoritos, **Then** ve las N frases usando `getFavoritePhrases()`.

## Requirements *(mandatory)*

- **FR-001**: Descomentar y cablear el botón bookmark en `CardPhrase.tsx` a `toggleFavorite`.
- **FR-002**: El ícono de bookmark DEBE reflejar visualmente el estado actual (`isFavorite`) de la frase mostrada.
- **FR-003**: Crear una pantalla/tab de favoritos que use `getFavoritePhrases()`.
- **FR-004**: Corregir el bug de comparación `"true"` vs `true` en `getFavoritePhrases` antes o junto con esta feature.

## Success Criteria *(mandatory)*

- **SC-001**: El usuario puede marcar/desmarcar favoritos desde Home y verlos reflejados en una lista dedicada.

## Assumptions

- La ubicación de la nueva pantalla de favoritos (¿nuevo tab? ¿dentro de Settings?) no está decidida — requiere `/speckit-clarify` antes de `/speckit-plan`.
