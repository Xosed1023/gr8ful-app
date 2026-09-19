# Feature Specification: Completar Toggle de Dark Mode

**Feature Branch**: `009-completar-dark-mode-toggle`

**Created**: 2026-09-18

**Status**: ⚠️ Deuda técnica — lectura implementada, sin control de UI

**Input**: Deuda técnica identificada en exploración de código.

## Estado actual

`src/pages/Settings.tsx` tiene un `useEffect` que aplica la clase `ion-palette-dark` al montar según `localStorage.darkMode`, pero el `IonToggle` correspondiente (~líneas 181-198) está comentado. El usuario no tiene forma de cambiar `darkMode` desde la UI actual.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Activar/desactivar modo oscuro desde Ajustes (Priority: P1)

El usuario abre Settings, activa el toggle de dark mode, y la app cambia de tema inmediatamente y de forma persistente.

**Acceptance Scenarios**:

1. **Given** el usuario está en Settings, **When** activa el toggle, **Then** se aplica la clase `ion-palette-dark` inmediatamente (sin recargar la app) y se guarda `localStorage.darkMode = true`.
2. **Given** el usuario reabre la app, **When** carga cualquier pantalla, **Then** el tema oscuro persiste si estaba activado.

## Requirements *(mandatory)*

- **FR-001**: Descomentar el `IonToggle` de dark mode en `Settings.tsx`.
- **FR-002**: El cambio del toggle DEBE aplicar/quitar la clase de tema inmediatamente, no solo en el próximo montaje.
- **FR-003**: El valor DEBE persistir en `localStorage.darkMode`.

## Success Criteria *(mandatory)*

- **SC-001**: El usuario puede alternar entre modo claro/oscuro sin reiniciar la app, y el estado persiste entre sesiones.

## Assumptions

- El sistema de theming ya usa las clases de paleta de Ionic (`ion-palette-dark`) — no se requiere rediseño de estilos, solo cablear el control.
