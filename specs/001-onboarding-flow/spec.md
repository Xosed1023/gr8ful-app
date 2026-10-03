# Feature Specification: Flujo de Onboarding

**Feature Branch**: `001-onboarding-flow`

**Created**: 2026-09-18

**Status**: ✅ Implementado (línea base retroactiva)

**Input**: Documentación del estado actual del código, no una nueva feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Primer arranque de la app (Priority: P1)

Un usuario nuevo abre la app por primera vez y es guiado paso a paso para configurar idioma, género, tema de interés y nombre antes de llegar a la pantalla principal.

**Why this priority**: Es el único camino de entrada para configurar las preferencias que personalizan el resto de la app (idioma de UI, filtrado de frases, saludo).

**Independent Test**: Instalar la app sin datos previos en `localStorage`, verificar que se recorre Welcome → Languages → Gender → [QuoteTime] → QuoteTopics → UserName → LoadingScreen → MainHome.

**Acceptance Scenarios**:

1. **Given** `localStorage.gr8fulFirstTime` no existe, **When** se abre la app, **Then** se muestra `Welcome` y al continuar se recorre el flujo completo de onboarding.
2. **Given** el usuario completó el onboarding (`gr8fulFirstTime` seteado), **When** vuelve a abrir la app, **Then** `Welcome` redirige directo a `/mainHome` sin repetir el flujo.
3. **Given** `VITE_SHOW_PUSH_NOTIFICACIONS_SCREEN=false` (valor actual en `.env`), **When** el usuario pasa por `Gender`, **Then** la pantalla `QuoteTime` se omite y se navega directo a `QuoteTopics`.

---

### User Story 2 - Edición de preferencias post-onboarding (Priority: P2)

Un usuario ya onboardeado quiere cambiar idioma, horario o temas desde Ajustes sin repetir todo el flujo.

**Why this priority**: Evita forzar un re-onboarding completo para cambios puntuales.

**Independent Test**: Desde `Settings`, entrar a editar idioma/horario/temas/nombre y confirmar que regresa a `/tabs/settings` (prop `backTo`) en vez de continuar el flujo de onboarding.

**Acceptance Scenarios**:

1. **Given** el usuario está en `Settings`, **When** toca editar idioma, **Then** se reutiliza `Languages.tsx` con `backTo="/tabs/settings"` y al guardar regresa a Settings.

---

### Edge Cases

- Si el usuario cierra la app a mitad del onboarding, al reabrir vuelve a `Welcome`, que como `gr8fulFirstTime` sigue sin setear, reinicia el flujo desde cero (no hay guardado de progreso parcial).
- No existe botón de retroceso visible en `Languages.tsx` durante el onboarding inicial (JSX comentado) — ver spec de deuda técnica `completar-back-button-languages`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE persistir en `localStorage` cada paso del onboarding (`language`, `gender`, `time`, `topics`, `name`) a medida que el usuario avanza.
- **FR-002**: El sistema DEBE marcar `gr8fulFirstTime` en `localStorage` al completar el onboarding, para no repetirlo en aperturas futuras.
- **FR-003**: El sistema DEBE mostrar u omitir `QuoteTime` según la variable de entorno `VITE_SHOW_PUSH_NOTIFICACIONS_SCREEN`.
- **FR-004**: Las pantallas de onboarding reutilizables (`Languages`, `QuoteTime`, `QuoteTopics`, `UserName`) DEBEN aceptar una prop `backTo` para soportar edición post-onboarding desde `Settings`.
- **FR-005**: Al completar el onboarding, el sistema DEBE inicializar la base de datos local (`initDB`) y cargar las frases semilla (`addPhrasesBatch`) si es la primera vez.

### Key Entities

- **Preferencias de usuario**: conjunto de claves sueltas en `localStorage` (`language`, `gender`, `time`, `topics`, `name`) — sin modelo TypeScript centralizado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario nuevo completa el onboarding y llega a `MainHome` con sus preferencias reflejadas (saludo con su nombre, idioma de UI correcto).
- **SC-002**: Un usuario recurrente nunca vuelve a ver el flujo de onboarding tras completarlo una vez.

## Implementación actual (archivos)

- `src/App.tsx` — definición de rutas de onboarding, `loadInitialData`, bootstrap de `initDB`.
- `src/pages/Welcome.tsx`, `Languages.tsx`, `Gender.tsx`, `QuoteTime.tsx`, `QuoteTopics.tsx`, `UserName.tsx`, `LoadingScreen.tsx`.
- `.env` — flag `VITE_SHOW_PUSH_NOTIFICACIONS_SCREEN`.

## Assumptions

- El onboarding no tiene versión "reanudable" — si se interrumpe, se reinicia desde `Welcome` (comportamiento actual aceptado, no un bug reportado).
