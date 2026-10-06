# Feature Specification: Racha de Días

**Feature Branch**: `025-racha-de-dias`

**Created**: 2026-10-06

**Status**: Completed

**Input**: Candidata del `specs/BACKLOG.md` («Racha de días de uso»): incentivar la apertura diaria mostrando cuántos días consecutivos se abrió la app.

## Decisiones de producto (2026-10-06)

- **Qué cuenta**: abrir la app ese día (basta con que llegue a Home). No exige interactuar.
- **Si se salta un día**: se ofrece **rescatar la racha viendo un anuncio recompensado** (rewarded). Solo se ofrece al abrir tras fallar **exactamente 1 día**; si fueron 2 o más, la racha vuelve a 1 sin opción.
- **Dónde se ve**: en **Home**, como una píldora de vidrio con llama y número, con la paleta de género y el tema vigentes. Sin entrada en Ajustes ni en el widget por ahora.
- **Hitos**: no se celebran en esta fase (solo el número). Queda como mejora.
- **Recordatorio**: ninguno nuevo; la notificación diaria de la frase ya cumple esa función.
- **Local-first**: todo en el dispositivo; el día es el día local, igual que en el plan diario (`dateKey`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver mi racha crecer (Priority: P1)

Como usuaria, quiero ver cuántos días seguidos he abierto la app para sentir progreso y mantener el hábito.

**Why this priority**: Es el valor de la feature.

**Independent Test**: Terminar el onboarding: la píldora muestra 1. Al día siguiente, abrir la app: muestra 2. Abrir varias veces el mismo día no cambia el número.

**Acceptance Scenarios**:

1. **Given** una instalación nueva con el onboarding terminado, **When** llega a Home por primera vez, **Then** la racha es 1.
2. **Given** racha de N abierta ayer, **When** abre la app hoy, **Then** la racha es N + 1.
3. **Given** que ya abrió hoy, **When** vuelve a abrir o regresa del segundo plano el mismo día, **Then** la racha no cambia.
4. **Given** la app en segundo plano desde ayer, **When** vuelve al primer plano hoy, **Then** la racha cuenta el día de hoy sin tener que reiniciarla.

### User Story 2 - Rescatar la racha con un anuncio (Priority: P1)

Como usuaria que olvidó abrir la app un día, quiero poder conservar mi racha viendo un anuncio.

**Why this priority**: Evita la frustración de perder una racha larga y encaja con la monetización existente.

**Independent Test**: Simular que la última apertura fue anteayer con racha 5; al abrir aparece el aviso; aceptar y ver el anuncio deja la racha en 6; rechazar la deja en 1.

**Acceptance Scenarios**:

1. **Given** racha N con última apertura anteayer, **When** abre la app, **Then** aparece un aviso que ofrece conservar la racha de N viendo un anuncio, o empezar de nuevo.
2. **Given** el aviso, **When** completa el anuncio recompensado, **Then** la racha pasa a N + 1 (el día perdido se cubre y hoy cuenta).
3. **Given** el aviso, **When** elige empezar de nuevo, **Then** la racha es 1.
4. **Given** el aviso, **When** el anuncio no carga o se cierra sin recompensa, **Then** puede reintentar o empezar de nuevo; la racha no se pierde hasta que elija o termine el día.
5. **Given** que cierra la app sin decidir, **When** vuelve a abrirla el mismo día, **Then** el aviso aparece otra vez.
6. **Given** última apertura hace 3 días o más, **When** abre la app, **Then** la racha es 1 sin aviso.
7. **Given** racha 1 (o ninguna), **When** falla un día, **Then** no se ofrece rescate: no hay racha que salvar.

### User Story 3 - Mi mejor racha (Priority: P3)

Como usuaria, quiero que la app recuerde mi mejor racha.

**Why this priority**: Da sentido a empezar de nuevo; se guarda desde ya aunque aún no se muestre.

**Acceptance Scenarios**:

1. **Given** una racha que supera la mejor anterior, **Then** la mejor se actualiza.
2. **Given** una racha perdida, **Then** la mejor se conserva.

### Edge Cases

- **Reloj atrasado** (la fecha de hoy es anterior a la última apertura): no cambia nada.
- **Cambio de zona horaria o de hora**: se usa la fecha local del momento; un viaje no debe romper la racha salvo que se salte un día de calendario.
- **Onboarding sin terminar**: no se registra nada.
- **Datos guardados corruptos o ausentes**: se tratan como «sin racha».
- **Sin conexión o anuncio no disponible**: el usuario nunca queda bloqueado; siempre puede empezar de nuevo.
- **Primera apertura tras actualizar la app**: la racha empieza en 1.
- **Modo reducido de movimiento**: la animación de la píldora y del aviso respeta `useReducedMotion`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La app MUST registrar como máximo una apertura por día local una vez terminado el onboarding.
- **FR-002**: Una apertura al día siguiente de la anterior MUST incrementar la racha en 1.
- **FR-003**: Una apertura el mismo día MUST NOT cambiar la racha.
- **FR-004**: Tras exactamente 1 día sin abrir, con racha ≥ 2, la app MUST ofrecer rescatar la racha con un anuncio recompensado antes de modificarla.
- **FR-005**: Completar el anuncio MUST fijar la racha en N + 1; rechazar, o cualquier fallo sin recompensa seguido de «empezar de nuevo», MUST fijarla en 1.
- **FR-006**: Tras 2 días o más sin abrir, la racha MUST volver a 1 sin ofrecer rescate.
- **FR-007**: La app MUST conservar la mejor racha histórica.
- **FR-008**: La racha MUST contarse también al volver del segundo plano en un día nuevo.
- **FR-009**: Home MUST mostrar la racha actual en una píldora con llama y número, con la paleta de género y el tema vigentes.
- **FR-010**: El aviso de rescate y la píldora MUST estar en EN, ES y FR según el idioma de la app.
- **FR-011**: El rescate MUST reutilizar el anuncio recompensado ya existente (sin duplicar la lógica de AdMob).
- **FR-012**: Los hápticos globales MUST aplicarse a los botones nuevos; la píldora no necesita ser interactiva.
- **FR-013**: Nada MUST requerir red ni backend; el estado vive en `localStorage`.

### Key Entities

- **Estado de racha**: `{ current, best, lastDay }` con `lastDay` en formato `YYYY-MM-DD` local. Persistido en `localStorage.streak`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La lógica pura de racha tiene tests para todos los casos de FR-002…FR-007 y los bordes (reloj atrasado, datos corruptos, racha 1).
- **SC-002**: En el iPhone, la racha avanza al día siguiente y el rescate funciona de punta a punta con anuncio de prueba.
- **SC-003**: Ningún camino deja al usuario sin poder continuar a Home.

## Assumptions

- Los anuncios siguen siendo los de prueba hasta resolver el bloqueante de AdMob (`BACKLOG.md`); el rescate funcionará igual con los de producción.
- El día se define en hora local y la racha se evalúa en la apertura, no a medianoche.
- Los hitos (7, 30, 100 días), mostrar la racha en Ajustes/widget y los recordatorios quedan fuera de esta fase.
