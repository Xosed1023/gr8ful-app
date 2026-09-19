# Feature Specification: Notificaciones Push

**Feature Branch**: `005-notificaciones-push`

**Created**: 2026-09-18

**Status**: ⚠️ Parcial (línea base retroactiva) — registro implementado, sin scheduling real

**Input**: Documentación del estado actual del código, no una nueva feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registro de push notifications al abrir la app (Priority: P1)

Al iniciar, la app solicita permisos y se registra para recibir push notifications.

**Why this priority**: Es el prerequisito técnico para cualquier notificación futura (ej. frase diaria).

**Independent Test**: Abrir la app y verificar en `App.tsx` que se llaman `checkPermissions`/`requestPermissions`/`register()` de `@capacitor/push-notifications`.

**Acceptance Scenarios**:

1. **Given** la app arranca, **When** no se tienen permisos de push, **Then** se solicitan al usuario.
2. **Given** el registro es exitoso, **When** llega una notificación, **Then** los listeners (`pushNotificationReceived`, `pushNotificationActionPerformed`) capturan el evento.

---

### Edge Cases

- El registro de push en `App.tsx` corre siempre al iniciar, **desacoplado** del toggle `pushNotifications` en `Settings` — el usuario puede desactivar el toggle en la UI sin que eso desregistre nada realmente.
- El horario elegido en `QuoteTime` (`localStorage.time`) no dispara ninguna notificación local ni remota — no hay integración con `LocalNotifications` ni un servidor que envíe pushes basados en ese horario. Es un valor guardado sin consumidor real.
- El `IonAlert` de permisos en `Settings.tsx` tiene handlers vacíos en los botones "Cancelar"/"Permitir" — no ejecutan ninguna acción.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE solicitar permisos de push notifications al iniciar la app.
- **FR-002**: El sistema DEBE registrar listeners para recepción y acción sobre notificaciones push.
- **FR-003** *(no cumplido actualmente)*: El sistema DEBERÍA usar el horario seleccionado en `QuoteTime` para programar el envío de la frase diaria — **no implementado**, requiere spec de deuda técnica separada si se decide priorizar.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La app se registra correctamente para push en dispositivos reales iOS/Android (verificado manualmente, sin backend que envíe pushes reales todavía).

## Implementación actual (archivos)

- `src/App.tsx` — bootstrap de `@capacitor/push-notifications`.
- `src/pages/Settings.tsx` — toggle `pushNotifications` (solo UI, sin efecto real), `IonAlert` con handlers vacíos.
- `src/pages/QuoteTime.tsx` — captura `localStorage.time`, sin consumidor.
- `capacitor.config.ts` — configuración `presentationOptions`.

## Assumptions

- Como la app no tiene backend, cualquier notificación "push" real (enviada por un servidor) requeriría introducir infraestructura externa — fuera del alcance de "local-first" salvo decisión explícita. La alternativa local-first sería usar `LocalNotifications` de Capacitor programadas en el dispositivo según `time`, sin necesidad de servidor.
