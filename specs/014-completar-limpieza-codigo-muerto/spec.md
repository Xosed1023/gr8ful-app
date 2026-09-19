# Feature Specification: Limpieza de Código Muerto

**Feature Branch**: `014-completar-limpieza-codigo-muerto`

**Created**: 2026-09-18

**Status**: 🧹 Deuda técnica — limpieza, no afecta comportamiento

**Input**: Deuda técnica identificada en exploración de código.

## Estado actual

- `src/hooks/useReactPath.ts` — hook que escucha `popstate` y devuelve el pathname actual. No está importado en ningún archivo del proyecto.
- `src/mapper/transformed_phrases.json` y `src/mapper/index.js` — artefacto/script offline de generación de contenido, no referenciado desde `src/App.tsx` ni ningún componente. Usa categorías en español no sincronizadas con `TypePhraseEnum` (ver `specs/002-frases-multilenguaje`).
- Imports sin usar de `BannerAdOptions/Position/Size` en `CardPhrase.tsx` (relacionado con `specs/011-completar-banners-admob-card`, se resuelve junto con esa spec).

## Requirements *(mandatory)*

- **FR-001**: Eliminar `src/hooks/useReactPath.ts` si tras una búsqueda confirmada no tiene ningún uso, o documentar por qué se mantiene si hay un plan concreto de usarlo.
- **FR-002**: Decidir el futuro de `src/mapper/`: ¿se mantiene como herramienta de autoría de contenido (documentarlo en `README.md` o `CLAUDE.md`) o se elimina si ya no se usa para generar frases nuevas?
- **FR-003**: Resolver los imports sin usar de AdMob en `CardPhrase.tsx` como parte de `specs/011-completar-banners-admob-card`.

## Success Criteria *(mandatory)*

- **SC-001**: `npm run lint` no reporta imports/variables sin usar relacionados a estos hallazgos.

## Assumptions

- Ninguna de estas eliminaciones afecta comportamiento visible de la app — es limpieza segura de bajo riesgo, salvo `src/mapper/` si todavía se usa manualmente para generar contenido nuevo (confirmar con el usuario antes de borrar).
