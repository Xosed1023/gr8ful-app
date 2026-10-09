# Feature Specification: Loader mientras carga el anuncio recompensado

**Feature Branch**: `033-loader-de-anuncios`

**Created**: 2026-10-09

**Status**: Completed (falta la prueba en teléfono)

**Input**: Al pedir un anuncio recompensado («Renovar inspiración» o rescate de racha) pasa un tiempo entre el toque y la aparición del anuncio, sin ningún indicio de que algo está ocurriendo.

## Decisiones de producto (2026-10-09)

- Un **loader global** y calmado mientras el anuncio se prepara: velo suave con desenfoque, el ∞ que se dibuja despacio y el texto «Preparando tu anuncio…» (EN/ES/FR). Mismo lenguaje visual que la pantalla de carga y la paleta de género.
- **No parpadea**: solo aparece si la espera supera ~250 ms.
- Se oculta en el instante en que el anuncio se muestra, o si falla.
- Mientras carga no se puede pedir otro anuncio (evita toques repetidos).
- **Tiempo máximo de espera: 15 s**; pasado ese tiempo se cancela la espera y se avisa.
- Si falla la carga en «Renovar inspiración», un aviso breve («No pudimos cargar el anuncio…»). En el rescate de racha ya hay un mensaje de error propio, así que ahí no se duplica.

## User Scenarios & Testing

### User Story 1 - Sé que el anuncio está cargando (Priority: P1)
**Acceptance Scenarios**:
1. **Given** pulso «Renovar inspiración», **When** el anuncio tarda más de 250 ms, **Then** veo el loader hasta que el anuncio aparece.
2. **Given** el anuncio carga rápido, **When** aparece antes de 250 ms, **Then** no veo ningún destello del loader.
3. **Given** el loader visible, **When** el anuncio se muestra, **Then** el loader se desvanece suavemente.
4. **Given** no hay conexión, **When** el anuncio falla, **Then** el loader desaparece y veo un aviso.
5. **Given** el loader visible, **When** toco otra vez «Renovar inspiración» o «Ver anuncio», **Then** no se lanza un segundo anuncio.
6. **Given** el rescate de racha, **When** pulso «Ver anuncio y conservarla», **Then** veo el mismo loader sobre el aviso, y el flujo de racha restaurada sigue igual.

### Edge Cases
- Reduced motion: sin animación del trazo, solo el texto y un fundido.
- Si el anuncio nunca responde: a los 15 s se oculta el loader y se permite reintentar.

## Requirements
- **FR-001**: Un único estado global «cargando anuncio» MUST gobernar el loader.
- **FR-002**: El loader MUST ir por encima del aviso de rescate y de todas las pantallas.
- **FR-003**: `showRewarded` MUST ignorar una segunda llamada mientras haya una en curso.
- **FR-004**: Textos EN/ES/FR en un archivo propio.

## Success Criteria
- **SC-001**: Tests de `showRewarded` para el estado de carga, la reentrada y el fallo.
- **SC-002**: En un teléfono, el loader cubre la espera entre el toque y el anuncio sin parpadeos.

## Assumptions
- El tiempo de carga real depende de la red y de AdMob; con anuncios de prueba suele ser de 1–3 s.
