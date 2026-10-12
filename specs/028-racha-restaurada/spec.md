# Feature Specification: Mensaje de Racha Restaurada

**Feature Branch**: `028-racha-restaurada`

**Created**: 2026-10-09

**Status**: Completed

**Input**: Punto de la usuaria: al terminar de ver el anuncio del rescate de racha (spec 025) y volver a la app, debe aparecer un mensaje tipo «Has restaurado tu racha», con animaciones bonitas y suaves.

## Decisiones de producto (2026-10-09)

- **Mensaje**: «¡Racha restaurada!» (ES/EN/FR) con la llama, el número de la racha (de N a N+1), la unidad («días seguidos / day streak / jours de suite») y una frase de cierre.
- **Sensación**: calma y paz, no fiesta. Aparición con fundido y un leve ascenso, sin rebotes ni overshoot; la llama con un resplandor que respira despacio; el número cambia con un fundido suave; háptico suave de éxito.
- **Sin botón de continuar**: es una confirmación, no una decisión. Se descarta sola a los ~3,5 s con un fundido, y también al tocar en cualquier punto. Un botón añadiría un toque obligatorio justo después de haber cumplido con ver el anuncio.
- Solo aparece tras un rescate con anuncio completado; «Empezar de nuevo» no muestra nada, y un anuncio fallido sigue el flujo anterior (error + reintentar).
- Respeta reduced motion, el tema claro/oscuro y la paleta de género.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Confirmar que mi racha se salvó (Priority: P1)

**Independent Test**: Con una racha de N y el último día abierto anteayer, abrir la app, pulsar «Ver anuncio y conservarla» y completar el anuncio: aparece «¡Racha restaurada!» con N y luego N+1, y se retira sola.

**Acceptance Scenarios**:

1. **Given** el aviso de rescate, **When** completo el anuncio, **Then** el aviso se desvanece y aparece «¡Racha restaurada!» sobre el mismo fondo, sin saltos.
2. **Given** el mensaje, **When** pasan ~3,5 s, **Then** se desvanece y queda Home con la racha ya actualizada.
3. **Given** el mensaje, **When** toco en cualquier punto, **Then** se desvanece de inmediato.
4. **Given** el mensaje, **Then** el número pasa suavemente de N a N+1 y suena un háptico suave (si los hápticos están activados).
5. **Given** el aviso, **When** elijo «Empezar de nuevo», **Then** no aparece el mensaje.
6. **Given** el aviso, **When** el anuncio falla o se cierra sin recompensa, **Then** no aparece el mensaje y se muestra el error con la opción de reintentar.

### User Story 2 - Respetar mis preferencias (Priority: P2)

**Acceptance Scenarios**:

1. **Given** «reducir movimiento» activado, **Then** el mensaje aparece y desaparece sin animaciones, ya con N+1.
2. **Given** modo oscuro o paleta de hombre, **Then** el mensaje usa los colores del tema y del género.
3. **Given** el idioma de la app, **Then** los textos salen en ES, EN o FR.

### Edge Cases

- El usuario sale de la app con el mensaje abierto: al volver, el mensaje ya no está (el temporizador lo retiró o se descarta al tocar).
- El banner nativo se oculta mientras el aviso o el mensaje están abiertos y vuelve después.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tras un rescate con anuncio completado MUST mostrarse «¡Racha restaurada!» con la racha N+1.
- **FR-002**: El mensaje MUST descartarse solo (~3,5 s) y al tocar en cualquier punto, sin botón.
- **FR-003**: La transición desde el aviso MUST ser continua (mismo fondo, fundido cruzado).
- **FR-004**: Las animaciones MUST ser suaves, sin rebotes, y respetar reduced motion.
- **FR-005**: MUST NOT aparecer con «Empezar de nuevo» ni con un anuncio fallido.
- **FR-006**: Textos MUST estar en ES, EN y FR; colores solo con tokens del tema.
- **FR-007**: El háptico MUST respetar el interruptor de Ajustes.

## Success Criteria *(mandatory)*

- **SC-001**: Tests del componente para aparecer, auto-descarte, descarte al tocar, fallo del anuncio y «Empezar de nuevo».
- **SC-002**: Revisado en navegador: la secuencia completa es suave en claro/oscuro y en ambas paletas.
- **SC-003**: En el teléfono, la sensación es calmada y no estorba.

## Assumptions

- La racha ya queda guardada al completarse el anuncio (spec 025); el mensaje solo la confirma.
- Se mantiene `StreakRescue` como único punto de montaje (ya está en Home).
