# Feature Specification: Frases Multi-idioma

**Feature Branch**: `002-frases-multilenguaje`

**Created**: 2026-09-18

**Status**: ✅ Implementado (línea base retroactiva)

**Input**: Documentación del estado actual del código, no una nueva feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recibir una frase motivacional en el idioma elegido (Priority: P1)

El usuario abre la app y ve una frase motivacional mostrada en el idioma que configuró, con opción de ver también sus traducciones.

**Why this priority**: Es el valor central del producto — frases para aprendizaje de idiomas.

**Independent Test**: Con `topics` y `language` seteados, cargar `MainHome` y verificar que `getRandomPhrase` devuelve una frase con contenido en `es/en/fr`.

**Acceptance Scenarios**:

1. **Given** hay frases cargadas en IndexedDB con `hasShown: false`, **When** se solicita una frase aleatoria, **Then** se filtra por los temas seleccionados por el usuario (`topics` en `localStorage`) y se marca como mostrada.
2. **Given** todas las frases de un tema ya fueron mostradas (`hasShown: true` en todas), **When** se solicita otra frase, **Then** el sistema resetea `hasShown` en todo el store para "reciclar" el mazo.

---

### Edge Cases

- Si el usuario no seleccionó ningún tema en `QuoteTopics`, ¿`getRandomPhrase` filtra sobre todas las frases o ninguna? (comportamiento a verificar contra `src/pages/MainHome.tsx`).
- Bug conocido: `getFavoritePhrases` compara `isFavorite` con el string `"true"` en vez de booleano — ver spec `completar-bug-favoritos-indexeddb`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE almacenar cada frase con traducciones embebidas `content.es`, `content.en`, `content.fr` en un único registro (no entidades separadas por idioma).
- **FR-002**: El sistema DEBE cargar un set semilla de frases (`src/persistence/initialData.ts`) en IndexedDB la primera vez que se abre la app.
- **FR-003**: El sistema DEBE permitir filtrar frases por tema (`TypePhraseEnum`) al pedir una frase aleatoria.
- **FR-004**: El sistema DEBE evitar repetir frases ya mostradas dentro de un ciclo, y reciclar el mazo cuando se agota.

### Key Entities

- **Phrase** (`src/models/Phrase.ts`): `id`, `author`, `type` (`TypePhraseEnum`), `content: {es, en, fr}`, `isFavorite`, `hasShown`.
- **TypePhraseEnum** (`src/models/TypePhraseEnum.ts`): `MOTIVATION`, `LOVE`, `HAPPINESS`, `SUCCESS`, `MINDFULNESS`, `HUMOR`, `CREATIVITY`, `SPIRITUALITY`, `LEADERSHIP`, `INVESTMENT`.
- **Topic** (`src/models/Topic.ts`): `{ key, value }` usado para mostrar/filtrar temas en la UI, catálogo trilingüe en `src/persistence/languages.ts`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El usuario nunca ve la misma frase dos veces seguidas en el mismo ciclo antes de que se agote el mazo filtrado por sus temas.
- **SC-002**: Toda frase mostrada tiene contenido no vacío en los 3 idiomas soportados.

## Implementación actual (archivos)

- `src/persistence/IndexedDBService.ts` — `initDB`, `addPhrasesBatch`, `getRandomPhrase`, `toggleFavorite`, `getFavoritePhrases`.
- `src/persistence/initialData.ts` — 60 frases semilla.
- `src/models/Phrase.ts`, `TypePhraseEnum.ts`, `Topic.ts`.
- `src/mapper/index.js` — script offline (Node, no runtime) que transforma `phrases.txt` a JSON para generar contenido nuevo; no está conectado a la app en producción.
- `src/pages/MainHome.tsx` — consumo de `getRandomPhrase` filtrado por `topics` de `localStorage`.

## Assumptions

- El pipeline de `src/mapper` es una herramienta de autoría de contenido, no parte del build/runtime de la app — cualquier frase nueva debe pasar manualmente a `initialData.ts` con el shape correcto (`TypePhraseEnum` en inglés, no las categorías en español que usa el JSON intermedio).
