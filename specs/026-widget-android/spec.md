# Feature Specification: Widget de la Frase del Día en Android

**Feature Branch**: `026-widget-android`

**Created**: 2026-10-08

**Status**: Completed

**Input**: Fase 2 de `specs/024-widget-frase-del-dia`: llevar a Android el widget que ya existe en iOS.

## Decisiones de producto (2026-10-08)

- **Igual que en iOS**: mismo contenido, mismo comportamiento y mismo aspecto (paleta de género, manchas de color difuminadas, ∞, tema claro/oscuro, estado vacío ES/EN/FR).
- **Un solo tamaño: pequeño (2×2)**, como en iOS.
- **Misma frase que la app**: el widget lee el plan diario único; cambia a medianoche o al ver un anuncio recompensado.
- **Tocar abre la app.**
- **Local-first**: la app entrega el contenido al widget en el dispositivo; no hay red ni backend.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver la frase del día sin abrir la app (Priority: P1)

Como usuaria de Android, quiero añadir el widget de Gr8ful a la pantalla de inicio y ver la frase del día con su autor.

**Why this priority**: Es el valor de la feature.

**Independent Test**: Terminar el onboarding, añadir el widget Gr8ful desde el selector de widgets y comprobar que muestra la misma frase que Home. Pasada la medianoche, cambia.

**Acceptance Scenarios**:

1. **Given** el onboarding terminado, **When** añado el widget, **Then** veo la frase de hoy en el idioma de la app con su autor.
2. **Given** el widget en pantalla, **When** pasa la medianoche, **Then** muestra la frase del nuevo día sin abrir la app.
3. **Given** el widget en pantalla, **When** veo un anuncio recompensado y cambia la frase del día, **Then** el widget muestra la nueva frase.
4. **Given** el widget en pantalla, **When** lo toco, **Then** se abre la app.

### User Story 2 - El widget refleja mis preferencias (Priority: P1)

**Independent Test**: Cambiar idioma, género y temas desde la app, y con el sistema en claro y oscuro; el widget se actualiza.

**Acceptance Scenarios**:

1. **Given** el widget en pantalla, **When** cambio el idioma o el género en la app, **Then** el widget se actualiza al instante.
2. **Given** el sistema en modo oscuro, **When** se dibuja el widget, **Then** usa la paleta oscura de su género.

### User Story 3 - Estado vacío amable (Priority: P2)

**Acceptance Scenarios**:

1. **Given** el widget añadido sin haber abierto la app, **Then** muestra un mensaje que invita a abrirla, en el idioma del dispositivo.
2. **Given** ese estado, **When** termino el onboarding, **Then** pasa a mostrar la frase.

### Edge Cases

- Cambio de zona horaria, de fecha o de hora: el widget recalcula el día.
- Reinicio del dispositivo: el widget recupera el contenido guardado.
- Se agotan los días del plan sin abrir la app: se conserva la última frase.
- Datos ausentes o corruptos: estado vacío, nunca un fallo.
- Ahorro de batería: la actualización de medianoche puede retrasarse unos minutos; nunca debe fallar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Debe existir un widget de Android «Frase del día» de tamaño 2×2 en el selector de widgets.
- **FR-002**: El widget MUST leer el mismo contenido que el de iOS (payload v1) entregado por la app; no calcula frases por su cuenta.
- **FR-003**: Debe mostrar la frase de hoy, o la última disponible si ya pasaron todos los días.
- **FR-004**: La app MUST actualizar el widget al arrancar y cuando cambie algo que afecte a la frase (idioma, temas, hora, género, fin del onboarding, rewarded).
- **FR-005**: El widget MUST actualizarse a medianoche sin abrir la app.
- **FR-006**: Aspecto igual que en iOS: paleta por género y esquema claro/oscuro, manchas de color difuminadas, ∞, comillas por idioma.
- **FR-007**: Tocar el widget MUST abrir la app.
- **FR-008**: Sin contenido, debe mostrar el mensaje de bienvenida en ES/EN/FR según el idioma del dispositivo.
- **FR-009**: Un fallo del widget nunca debe afectar a la app.

### Key Entities

- **Payload del widget (v1)**: ya definido en `src/widget/widgetData.ts`: idioma, género y una frase por día.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El proyecto Android compila (`assembleDebug`) con el widget.
- **SC-002**: En un teléfono Android, el widget muestra la misma frase que Home y cambia al día siguiente.
- **SC-003**: Los cambios de idioma, género y rewarded se reflejan en el widget en segundos.

## Assumptions

- Mismo payload y mismo plan diario que iOS; solo cambia la entrega nativa.
- Fuente del widget: la del sistema (Playwrite no se usa en el widget, tampoco en iOS).
- El tema claro/oscuro sigue al del sistema, no al interruptor interno de la app (igual que en iOS).
- Los tamaños mediano/grande siguen en el backlog.
