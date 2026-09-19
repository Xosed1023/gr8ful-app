# Feature Specification: Completar Compartir Frase

**Feature Branch**: `008-completar-compartir`

**Created**: 2026-09-18

**Status**: ⚠️ Deuda técnica — sin implementación

**Input**: Deuda técnica identificada en exploración de código.

## Estado actual

El botón de compartir (`shareSocialOutline`) en `src/components/home/CardPhrase.tsx` (~líneas 164-185) está comentado en el JSX. No hay integración con ningún plugin de compartir de Capacitor (no está `@capacitor/share` en `package.json`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compartir una frase con otras apps (Priority: P1)

El usuario toca el botón de compartir en una tarjeta expandida y se abre el share sheet nativo del sistema operativo con el texto de la frase.

**Acceptance Scenarios**:

1. **Given** una tarjeta expandida, **When** el usuario toca compartir, **Then** se abre el share sheet nativo con el texto de la frase (y opcionalmente autor).

## Requirements *(mandatory)*

- **FR-001**: Agregar el plugin `@capacitor/share` como dependencia nueva (única excepción justificada al principio de "reutilizar antes de duplicar" — no existe mecanismo de compartir nativo ya implementado).
- **FR-002**: Descomentar y cablear el botón share en `CardPhrase.tsx` a la API de share.
- **FR-003**: El texto compartido DEBE incluir la frase en el idioma actualmente mostrado y el autor.

## Success Criteria *(mandatory)*

- **SC-001**: El usuario puede compartir una frase a cualquier app instalada que soporte el share sheet del sistema, en Android e iOS.

## Assumptions

- Se comparte solo texto plano en la primera versión (no imagen generada) — compartir como imagen queda en `specs/BACKLOG.md` como candidata separada de mayor esfuerzo.
