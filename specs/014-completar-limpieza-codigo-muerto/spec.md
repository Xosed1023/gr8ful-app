# Feature Specification: Limpieza de Código Muerto

**Feature Branch**: `014-completar-limpieza-codigo-muerto`

**Created**: 2026-09-18

**Status**: ✅ Implementado

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

## Resultado (2026-10-02)

- **FR-001**: `src/hooks/useReactPath.ts` eliminado (cero usos confirmados con búsqueda en todo el proyecto).
- **FR-002**: decisión del usuario: **eliminar `src/mapper/`** (script `index.js`, `transformed_phrases.json` y `package.json`); su salida usaba categorías en español no sincronizadas con `TypePhraseEnum` y nada lo referenciaba. Las frases se mantienen en `src/persistence/initialData.ts`. El historial de git conserva el script. Se quitó su línea de `CLAUDE.md` y se añadieron `ads/` y `notifications/` a la estructura de `src/`.
- **FR-003**: resuelto en la spec 020 (banners por tarjeta).
- **Extra**: imports y variables sin usar eliminados (`React` en `App.test.tsx`, `useHistory` y `Home` en `App.tsx`, `IonButton` en `Gender.tsx` y `Welcome.tsx`, `useIonToast` en `MainHome.tsx`, `IonAlert` en `Settings.tsx`).
- **SC-001**: `tsc --noEmit --noUnusedLocals` sin avisos; `eslint`, `vitest` (33/33) y `vite build` sin errores.
- No se tocaron dependencias de `package.json`: varias parecen sin uso directo pero son plugins de plataforma o tipos necesarios; auditarlas es un cambio de riesgo distinto.
