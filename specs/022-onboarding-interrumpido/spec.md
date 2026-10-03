# Feature Specification: Onboarding Interrumpido

**Feature Branch**: `022-onboarding-interrumpido`

**Created**: 2026-10-02

**Status**: ✅ Implementado

**Input**: Pendiente del `specs/BACKLOG.md` (hallado durante la spec 012): si el usuario cierra la app a mitad del onboarding y la reabre, la app lo lleva a Home sin haber elegido idioma, género, hora ni temas.

## Problema

Hoy la app marca «primer uso completado» en el primer arranque, al terminar de cargar las frases iniciales, y la pantalla de bienvenida usa esa marca para decidir si salta directamente a Home. Como la marca se pone antes de que el usuario termine de configurar nada, cerrar la app durante la configuración (por una llamada, por cansancio, por un cierre inesperado) hace que la próxima apertura vaya a Home con la configuración incompleta: sin nombre, sin género (y por tanto sin la paleta correcta), sin hora y sin temas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Retomar la configuración si la dejé a medias (Priority: P1)

Como usuario nuevo que cerró la app antes de terminar la configuración inicial, quiero que al volver a abrirla me lleve otra vez a la configuración, para no acabar en una app sin mi nombre, mi género ni mis preferencias.

**Why this priority**: Es el defecto: un primer uso interrumpido deja la app en un estado incoherente (sin nombre, sin hora, paleta por defecto) y sin forma evidente de arreglarlo.

**Independent Test**: Instalar de cero, avanzar hasta mitad del onboarding (por ejemplo, tras elegir el idioma), cerrar la app por completo y reabrirla: debe mostrar la bienvenida y permitir continuar la configuración. Terminarla y reabrir: debe ir directo a Home.

**Acceptance Scenarios**:

1. **Given** el usuario abrió la app por primera vez y salió a mitad del onboarding, **When** vuelve a abrir la app, **Then** ve la pantalla de bienvenida y puede completar la configuración.
2. **Given** el usuario terminó el onboarding hasta pulsar «Finalizar» con su nombre, **When** vuelve a abrir la app más tarde, **Then** abre directamente en Home.
3. **Given** el usuario salió a mitad del onboarding y lo retoma, **When** vuelve a elegir sus opciones, **Then** las nuevas elecciones reemplazan a las anteriores y no queda configuración mezclada.
4. **Given** el usuario sale a mitad del onboarding varias veces seguidas, **When** reabre, **Then** siempre vuelve a la bienvenida hasta terminarlo.

---

### User Story 2 - No afectar a quien ya terminó el onboarding (Priority: P1)

Como usuario que ya terminó la configuración con una versión anterior de la app, quiero seguir abriendo en Home tras actualizar, sin volver a ver el onboarding.

**Why this priority**: Una regresión aquí molestaría a todos los usuarios existentes.

**Independent Test**: Con una instalación previa que ya llegó a Home (tiene nombre guardado), actualizar a la nueva versión y abrir: debe ir directo a Home.

**Acceptance Scenarios**:

1. **Given** un usuario existente con nombre y preferencias guardados, **When** actualiza y abre la app, **Then** va directo a Home y no ve el onboarding.
2. **Given** un usuario existente que había quedado atascado con la configuración incompleta (sin nombre) por este defecto, **When** actualiza y abre la app, **Then** ve la bienvenida y puede completarla.

---

### Edge Cases

- **Cierre justo al pulsar «Finalizar»**: si el nombre ya se guardó y se marcó la configuración como completa, reabrir va a Home; si no llegó a guardarse, reabrir vuelve a la bienvenida. Nunca un estado a medias.
- **Editar el nombre desde Ajustes**: no cambia el estado de «configuración completa».
- **Datos de la app borrados o reinstalación**: se trata como primer uso; el onboarding empieza de cero.
- **Frases iniciales**: cargarlas en el primer arranque sigue ocurriendo una sola vez, aunque el onboarding se interrumpa; no se duplican al reabrir.
- **Notificaciones**: el permiso se pide al elegir la hora (spec 021); si la configuración se interrumpe antes de ese paso, no se pidió ni se programó nada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE distinguir «la carga inicial de frases ya se hizo» de «el usuario terminó la configuración inicial»; solo lo segundo decide si se omite el onboarding.
- **FR-002**: La configuración inicial DEBE considerarse completa únicamente cuando el usuario pulsa «Finalizar» en el último paso con un nombre válido.
- **FR-003**: Al abrir la app, si la configuración inicial no está completa, el sistema DEBE mostrar la bienvenida (inicio del onboarding); si está completa, DEBE ir directo a Home.
- **FR-004**: Los usuarios que ya tenían un nombre guardado antes de esta feature DEBEN considerarse con la configuración completa (sin repetir el onboarding).
- **FR-005**: Los usuarios que quedaron con la carga inicial hecha pero sin nombre DEBEN volver al onboarding.
- **FR-006**: Retomar el onboarding NO DEBE duplicar las frases iniciales ni dejar configuración mezclada: las elecciones nuevas reemplazan a las anteriores.
- **FR-007**: Editar el nombre desde Ajustes NO DEBE alterar el estado de configuración completa.

### Key Entities

- **Estado de configuración inicial**: completa / incompleta, guardado en el dispositivo.
- **Carga inicial de frases**: hecha / pendiente (independiente de lo anterior).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En el 100 % de las reaperturas tras abandonar el onboarding antes de «Finalizar», la app muestra la bienvenida y no Home.
- **SC-002**: En el 100 % de las aperturas posteriores a «Finalizar», la app abre directamente en Home.
- **SC-003**: 0 usuarios existentes con nombre guardado ven el onboarding tras actualizar.
- **SC-004**: Tras interrumpir y retomar el onboarding, el número de frases cargadas es el mismo que en un primer uso sin interrupciones.

## Assumptions

- Retomar el onboarding lo reinicia desde la bienvenida (no desde el paso exacto donde quedó): son pocos pasos y las nuevas elecciones sobrescriben las anteriores.
- «Tiene nombre guardado» identifica con fiabilidad a quien terminó el onboarding en versiones anteriores, porque el nombre es el último paso.
- Alcance limitado a la decisión de omitir o no el onboarding al abrir; no se rediseña el flujo ni se añade «continuar donde lo dejé».
