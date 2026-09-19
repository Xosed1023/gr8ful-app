# Feature Specification: Completar Scheduling Real de Frase Diaria

**Feature Branch**: `013-completar-scheduling-frase-diaria`

**Created**: 2026-09-18

**Status**: ⚠️ Deuda técnica — valor capturado, sin consumidor

**Input**: Deuda técnica identificada en exploración de código.

## Estado actual

`src/pages/QuoteTime.tsx` permite elegir un horario (6AM/12PM/6PM) y lo guarda en `localStorage.time`, pero ningún código del proyecto usa ese valor para programar una notificación real. No hay integración con `@capacitor/local-notifications`, y el registro de push en `App.tsx` no depende de este horario.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recibir notificación local a la hora elegida (Priority: P1)

El usuario eligió 12PM como horario preferido; cada día a esa hora recibe una notificación local con una frase nueva, sin necesidad de backend.

**Acceptance Scenarios**:

1. **Given** el usuario seleccionó un horario en `QuoteTime`, **When** llega esa hora en el dispositivo, **Then** se dispara una notificación local (no push remoto) con una frase.

## Requirements *(mandatory)*

- **FR-001**: Agregar el plugin `@capacitor/local-notifications` (consistente con el principio local-first — no requiere backend).
- **FR-002**: Al guardar `time` en `QuoteTime.tsx`, el sistema DEBE (re)programar la notificación local diaria correspondiente.
- **FR-003**: Si el usuario cambia el horario desde Settings, la notificación anterior DEBE cancelarse y reprogramarse con el nuevo horario.

## Success Criteria *(mandatory)*

- **SC-001**: El usuario recibe exactamente una notificación local por día, a la hora configurada, sin necesidad de conexión a internet.

## Assumptions

- Esta feature es compatible con el principio "Local-First / Sin Backend" de la constitución porque usa notificaciones **locales** programadas en el dispositivo, no push remoto — distinto del toggle actual de `pushNotifications` (documentado en `specs/005-notificaciones-push`), que sí depende de `@capacitor/push-notifications` (push remoto).
