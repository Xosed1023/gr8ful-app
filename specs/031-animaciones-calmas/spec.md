# Feature Specification: Animaciones Calmas en Toda la App

**Feature Branch**: `031-animaciones-calmas`

**Created**: 2026-10-09

**Status**: In Progress (fase 1 hecha; fase 2 pendiente)

**Input**: Petición de la usuaria: «animaciones suaves en toda la app; es una app de motivación, quiero dar la sensación de calma, tranquilidad, paz».

## Decisiones de producto (2026-10-09)

- El movimiento transmite **calma**: suave, lento, sin rebotes ni overshoot, sin parpadeos.
- Un único **sistema de movimiento** (tokens, utilidades CSS y API de framer-motion) que usa toda la app.
- **Entradas** con fundido y ascenso leve, escalonadas; **salidas** con fundido; **transiciones de pantalla** por fundido con un desplazamiento mínimo.
- Se respeta «reducir movimiento» del sistema.
- Se hace por fases para poder paralelizar: **fase 1** el sistema + onboarding/bienvenida/carga; **fase 2** Home, tarjetas, Favoritos, Ajustes, racha y tutorial (otras ramas modifican esas pantallas a la vez).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sensación de calma al recorrer el onboarding (Priority: P1)

**Independent Test**: Recorrer Bienvenida → 5 pasos → Carga con y sin «reducir movimiento»; todo entra y sale suavemente, sin saltos ni rebotes.

**Acceptance Scenarios**:
1. **Given** la bienvenida, **When** se muestra, **Then** logo, texto, puntos y botón entran uno tras otro.
2. **Given** un paso del onboarding, **When** se muestra, **Then** título, subtítulo y opciones entran escalonados, sin rebote.
3. **Given** una opción elegida, **When** se avanza, **Then** el contenido se funde, hay un breve respiro y entra la pantalla siguiente.
4. **Given** el botón atrás, **When** se pulsa, **Then** la pantalla anterior reaparece solo con fundido.
5. **Given** «reducir movimiento» activo, **When** se navega, **Then** no hay animaciones ni desplazamientos.

### User Story 2 - Un sistema reutilizable (Priority: P1)

**Acceptance Scenarios**:
1. **Given** un componente nuevo, **When** necesita animarse, **Then** usa las clases `.calm-*` o la API de `src/theme/motion.ts` sin definir curvas propias.
2. **Given** las pestañas y el gesto de volver en iOS, **When** se usan, **Then** conservan la animación por defecto de Ionic.

### Edge Cases
- El outlet de pestañas (dentro de `ion-tabs`) no debe animarse como pantallas.
- El gesto de deslizar para volver (iOS) debe seguir al dedo.
- Volver a una pantalla ya montada reinicia su entrada escalonada.
- Los estados `.chosen` y `:active` no deben quedar pisados por las animaciones de entrada.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Existirán tokens `--motion-*` (curvas, duraciones, distancias, escalonado) en `variables.css`.
- **FR-002**: Existirán utilidades `.calm-in`, `.calm-fade`, `.calm-stagger`, `.calm-press`, `.calm-breathe` y un hook `useCalmEnter`.
- **FR-003**: `src/theme/motion.ts` MUST exponer transiciones y variants de framer-motion con un resorte sobreamortiguado.
- **FR-004**: Las pantallas se MUST transicionar con fundido y ascenso mínimo; las pestañas y el gesto de volver, no.
- **FR-005**: Ninguna animación MUST usar curvas con overshoot ni rebotes.
- **FR-006**: «Reducir movimiento» MUST apagar animaciones y transiciones.
- **FR-007 (fase 2)**: Home, tarjetas, Favoritos, Ajustes, racha y tutorial MUST adoptar el sistema.

## Success Criteria *(mandatory)*
- **SC-001**: `tsc`, `lint`, tests y `build` limpios; el resorte calmo tiene cociente de amortiguamiento ≥ 1 (test).
- **SC-002**: Los fotogramas de las transiciones del onboarding son continuos, sin saltos.
- **SC-003**: La usuaria percibe el recorrido del onboarding como tranquilo.

## Assumptions
- La fase 2 se aplica tras integrar las otras ramas, para evitar conflictos.
- El sistema se documenta en `stitch/DESIGN.md` («Movimiento»).
