# Feature Specification: Ajustes y Edición de Perfil

**Feature Branch**: `006-ajustes-perfil`

**Created**: 2026-09-18

**Status**: ✅ Implementado (línea base retroactiva) — con deuda técnica asociada

**Input**: Documentación del estado actual del código, no una nueva feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver y editar preferencias desde Ajustes (Priority: P1)

El usuario entra al tab Settings y puede ver/editar su nombre, idioma, horario, temas y ver la versión de la app.

**Why this priority**: Único lugar donde el usuario controla su configuración después del onboarding inicial.

**Independent Test**: Navegar a `/tabs/settings` y verificar que cada opción de edición navega a la pantalla correspondiente con `backTo="/tabs/settings"`.

**Acceptance Scenarios**:

1. **Given** el usuario está en Settings, **When** toca "editar nombre", **Then** navega a `UserName` y al guardar regresa a Settings con el nombre actualizado.
2. **Given** el usuario está en Settings, **When** activa el toggle de push notifications, **Then** se guarda `localStorage.pushNotifications` y se muestra un `IonAlert` (sin efecto funcional real, ver deuda técnica).

---

### Edge Cases

- El toggle de dark mode está comentado en el JSX (`Settings.tsx` ~línea 181-198) — el `useEffect` que aplica la clase `ion-palette-dark` solo lee un valor que el usuario no puede setear desde la UI actual. Ver spec `completar-dark-mode-toggle`.
- El `IonAlert` de permisos push tiene handlers vacíos — ver spec `005-notificaciones-push`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE mostrar el nombre, idioma, horario y temas actuales del usuario en Settings.
- **FR-002**: El sistema DEBE permitir navegar a editar cada preferencia y regresar a Settings tras guardar.
- **FR-003**: El sistema DEBE mostrar la versión actual de la app en Settings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El usuario puede cambiar cualquier preferencia de onboarding desde Settings sin perder otras preferencias ya configuradas.

## Implementación actual (archivos)

- `src/pages/Settings.tsx` — pantalla principal de ajustes.
- Reutiliza `src/pages/{Languages,QuoteTime,QuoteTopics,UserName}.tsx` vía prop `backTo`.

## Assumptions

- La versión mostrada en Settings se toma de `package.json` (`version: "0.0.1"`) o equivalente — confirmar mecanismo exacto al tocar esta pantalla en una sesión futura.
