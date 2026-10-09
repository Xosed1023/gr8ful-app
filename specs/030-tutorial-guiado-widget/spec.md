# Feature Specification: Tutorial Guiado y Aviso del Widget

**Feature Branch**: `030-tutorial-guiado-widget`

**Created**: 2026-10-09

**Status**: Completed (pendiente de la prueba en teléfono)

**Input**: Dos puntos de la usuaria: «agregar un tutorial guiado que indique cómo compartir, copiar o guardar frase» y «algún indicativo que le haga saber al usuario que puede poner un widget (en el onboarding o después del tutorial)».

## Decisiones de producto (2026-10-09)

- **Tutorial de primer uso en Home**, tras el onboarding y una sola vez (`localStorage.tutorialDone`). Se puede repetir desde Ajustes («Ver el tutorial de nuevo»).
- **Recorrido de 3 pasos** con foco suave («spotlight») sobre los elementos reales: (1) abrir una tarjeta, (2) con la tarjeta abierta, guardar / compartir / copiar, (3) cierre amable. En móvil, el paso 3 es la invitación a añadir el widget; en la web, un cierre simple.
- **Solo señala, no ejecuta**: los botones de guardar, compartir y copiar no se pulsan durante el tutorial.
- **Saltable en cualquier momento** («Omitir»), con «Siguiente» e indicador de progreso discreto.
- **Calma**: fundidos y desplazamientos suaves (sin rebotes), respeta «reducir movimiento».
- **Sin anuncios durante el tutorial**: no suma puntos del sistema de anuncios (spec 027) ni muestra banners.
- **Aviso del widget**: iOS, pasos claros con una mini-ilustración; Android, botón «Añadir widget» que pide al launcher fijarlo (si no puede, instrucciones manuales). Además, una fila permanente en Ajustes. Nada de esto se muestra en la web.
- Si hay un rescate de racha pendiente, el tutorial espera a que se resuelva.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Aprender lo básico sin esfuerzo (Priority: P1)

**Independent Test**: Terminar el onboarding y llegar a Home: tras un instante aparece el tutorial. Seguir los pasos y comprobar que no se ejecuta ninguna acción real.

**Acceptance Scenarios**:

1. **Given** onboarding terminado y tutorial no visto, **When** llego a Home, **Then** aparece el paso 1 con foco sobre una tarjeta.
2. **Given** el paso 1, **When** toco la tarjeta o «Siguiente», **Then** la tarjeta se abre y pasa al paso 2 con foco en guardar, compartir y copiar y una línea explicando cada uno.
3. **Given** el paso 2, **When** pulso «Siguiente», **Then** la tarjeta se cierra y pasa al paso 3.
4. **Given** cualquier paso, **When** pulso «Omitir», **Then** el tutorial termina, la tarjeta vuelve a su sitio y no se vuelve a mostrar solo.
5. **Given** el tutorial terminado, **Then** no se registraron puntos de anuncios ni se mostró ningún banner o intersticial.

### User Story 2 - Descubrir el widget (Priority: P1)

**Acceptance Scenarios**:

1. **Given** el paso 3 en iOS, **Then** veo los pasos para añadir el widget con una ilustración.
2. **Given** el paso 3 en Android, **When** pulso «Añadir widget», **Then** el sistema ofrece fijarlo; si no lo permite, veo las instrucciones manuales.
3. **Given** Ajustes, **When** pulso «Añadir widget a la pantalla de inicio», **Then** se abre la misma guía.
4. **Given** la web, **Then** ni el paso del widget ni la fila de Ajustes aparecen.

### User Story 3 - Repetir el tutorial (Priority: P2)

**Acceptance Scenarios**:

1. **Given** Ajustes, **When** pulso «Ver el tutorial de nuevo», **Then** voy a Home y se reproduce.

### Edge Cases

- Rescate de racha pendiente: el tutorial espera y arranca cuando se resuelve.
- Salir de Home durante el tutorial: se detiene sin marcarse como visto.
- Usuarios que ya usaban la app: lo ven una vez al actualizar.
- Giro o cambio de tamaño: el foco se recalcula.
- Tarjeta aún entrando: el tutorial espera a que termine la animación de entrada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El tutorial MUST mostrarse una sola vez tras el onboarding y poder repetirse desde Ajustes.
- **FR-002**: MUST ser saltable y tener «Siguiente» y progreso.
- **FR-003**: MUST NOT ejecutar guardar, compartir ni copiar.
- **FR-004**: MUST NOT sumar puntos de anuncios (`registerAdMoment`) ni mostrar banners mientras está activo.
- **FR-005**: MUST esperar si hay un rescate de racha pendiente.
- **FR-006**: Textos MUST estar en EN, ES y FR; tema claro/oscuro y paleta de género.
- **FR-007**: MUST respetar «reducir movimiento» y usar animaciones calmadas.
- **FR-008**: En iOS MUST mostrar los pasos para añadir el widget; en Android MUST ofrecer «Añadir widget» (`requestPinAppWidget`) con instrucciones manuales como alternativa.
- **FR-009**: La guía del widget MUST estar disponible permanentemente en Ajustes (solo en móvil).

## Success Criteria *(mandatory)*

- **SC-001**: La lógica de estado del tutorial y `requestWidgetPin` tienen tests.
- **SC-002**: El proyecto Android compila con `requestPin`.
- **SC-003**: En un teléfono, un usuario nuevo completa el recorrido en menos de 30 s y sabe cómo añadir el widget.

## Assumptions

- `requestPinAppWidget` depende del launcher; sin soporte se muestran las instrucciones manuales.
- iOS no permite añadir widgets desde la app; solo se puede guiar.
