# Feature Specification: Compartir Frase como Imagen

**Feature Branch**: `023-compartir-como-imagen`

**Created**: 2026-10-03

**Status**: ✅ Implementado (verificado en iPhone; Android pendiente de validar)

**Input**: Candidata del `specs/BACKLOG.md` («Compartir frase como imagen»): generar una imagen estilizada de la frase para compartir en redes, además del texto que ya se puede compartir (spec 018).

## Decisiones de producto (2026-10-03)

1. **Disparador**: el botón de compartir de cada tarjeta abre un menú con dos opciones, **Imagen** y **Texto**. Compartir texto sigue funcionando como hasta ahora.
2. **Contenido**: la imagen lleva la frase **de la tarjeta tocada** (en su idioma) con su **autor**, y el **logo de Gr8ful como marca de agua**.
3. **Formato**: el usuario **elige entre vertical 9:16 (historias) y cuadrado 1:1** en una vista previa antes de compartir.
4. **Estilo**: paleta del género del usuario, fondo de manchas de color, tarjeta de vidrio con la frase y comillas tipográficas; respeta el **tema claro u oscuro** de la app.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compartir una frase como imagen (Priority: P1)

Como usuario que leyó una frase que le gustó, quiero compartirla como una imagen bonita en mis redes o chats, para que se vea mejor que un texto plano.

**Why this priority**: Es el valor de la feature.

**Independent Test**: En Home, tocar el botón de compartir de una tarjeta, elegir «Como imagen», ver la vista previa y compartirla a una app instalada (Mensajes, WhatsApp, Instagram). La app destino debe recibir una imagen con la frase, el autor y el logo.

**Acceptance Scenarios**:

1. **Given** una tarjeta de Home, **When** el usuario toca compartir, **Then** aparece un menú con «Como imagen» y «Como texto».
2. **Given** el menú abierto, **When** elige «Como imagen», **Then** se muestra una vista previa de la imagen con la frase de esa tarjeta, su autor y el logo, ya renderizada.
3. **Given** la vista previa, **When** pulsa compartir, **Then** se abre el menú nativo de compartir con la imagen adjunta.
4. **Given** el menú abierto, **When** elige «Como texto», **Then** se abre el menú nativo de compartir con el texto de la frase y su autor, igual que antes de esta feature.

---

### User Story 2 - Elegir el formato (Priority: P1)

Como usuario, quiero elegir entre formato vertical (historias) y cuadrado (publicaciones), para que la imagen encaje donde la voy a publicar.

**Why this priority**: Decisión explícita de producto; sin ella la imagen puede recortarse mal en redes.

**Independent Test**: En la vista previa, alternar entre los dos formatos y comprobar que la imagen cambia de proporción y sigue legible; compartir cada una.

**Acceptance Scenarios**:

1. **Given** la vista previa, **When** el usuario cambia de formato, **Then** la imagen se regenera con la nueva proporción (9:16 o 1:1) sin que el texto se corte.
2. **Given** una frase muy larga, **When** se genera en cualquier formato, **Then** el texto se reduce de tamaño lo necesario para caber completo, nunca se corta.
3. **Given** el formato elegido, **When** comparte, **Then** la imagen enviada tiene esa proporción.

---

### User Story 3 - La imagen respeta mi estilo (Priority: P2)

Como usuario con la paleta de hombre o de mujer y con el modo claro u oscuro, quiero que la imagen use mis colores, para que se sienta mía.

**Why this priority**: Coherencia visual y reconocimiento de marca.

**Independent Test**: Generar la imagen con cada combinación de género (mujer/hombre) y tema (claro/oscuro) y comprobar que los colores coinciden con los de la app.

**Acceptance Scenarios**:

1. **Given** género mujer o hombre, **When** se genera la imagen, **Then** las manchas de color y el acento son violetas (mujer) o azules (hombre).
2. **Given** el modo oscuro activo, **When** se genera, **Then** la imagen tiene fondo oscuro y texto claro; con modo claro, lo contrario.
3. **Given** cualquier combinación, **When** se genera, **Then** el logo aparece como marca de agua discreta, legible sobre el fondo.

---

### Edge Cases

- **Sin conexión o tipografía no disponible**: la imagen se genera igualmente, con una tipografía de respaldo del sistema; nunca falla por eso.
- **El usuario cancela el menú de compartir del sistema**: no es un error; se vuelve a la vista previa sin mensajes.
- **Falla la generación o el envío**: se muestra un mensaje breve y claro en el idioma de la app, y se puede reintentar; la app no se queda bloqueada.
- **Frase muy corta o muy larga**: el tamaño de letra se ajusta para llenar bien la tarjeta sin cortar nada.
- **Varias aperturas seguidas**: abrir y cerrar el menú varias veces no deja imágenes ni capas colgadas.
- **Banner publicitario nativo**: mientras el menú o la vista previa están abiertos, el banner de la tarjeta no debe tapar ni asomar por encima.
- **Compartir en el navegador (desarrollo)**: si el navegador no permite compartir archivos, la imagen se ofrece para descargar.
- **Girar el dispositivo**: no aplica; la app es solo vertical.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El botón de compartir de cada tarjeta DEBE abrir un menú con las opciones «Como imagen» y «Como texto» y una forma de cancelar.
- **FR-002**: «Como texto» DEBE conservar el comportamiento actual: compartir la frase del idioma de la tarjeta y su autor.
- **FR-003**: «Como imagen» DEBE mostrar una vista previa de la imagen generada antes de compartir.
- **FR-004**: La imagen DEBE contener la frase de la tarjeta tocada en su idioma, entre comillas tipográficas, y el nombre de su autor.
- **FR-005**: La imagen DEBE incluir el logo de Gr8ful como marca de agua discreta.
- **FR-006**: El usuario DEBE poder elegir entre formato vertical 9:16 y cuadrado 1:1 en la vista previa, y la imagen DEBE regenerarse al cambiar.
- **FR-007**: La imagen DEBE usar la paleta del género del usuario y el tema claro u oscuro vigente en la app.
- **FR-008**: El texto DEBE ajustarse en tamaño y en renglones para caber completo en cualquier formato; nunca se corta.
- **FR-009**: Al confirmar, el sistema DEBE abrir el menú nativo de compartir con la imagen como archivo adjunto (formato PNG), de modo que cualquier app instalada pueda recibirla.
- **FR-010**: Cancelar el menú del sistema NO DEBE mostrar errores. Un fallo real al generar o compartir DEBE mostrar un mensaje breve en el idioma de la app y permitir reintentar.
- **FR-011**: Todos los textos nuevos visibles (menú, vista previa, formatos, mensajes) DEBEN existir en ES, EN y FR.
- **FR-012**: Mientras el menú o la vista previa están abiertos, el banner publicitario nativo NO DEBE verse encima.
- **FR-013**: Funciona sin conexión; no se envía la frase ni la imagen a ningún servidor propio (Principio I).
- **FR-014**: Los hápticos de la app se aplican a los botones nuevos y respetan el interruptor de Ajustes.

### Key Entities

- **Imagen compartible**: PNG generado en el momento con la frase, el autor, el idioma de la tarjeta, el formato (vertical o cuadrado), el género y el tema del usuario. No se guarda de forma permanente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desde tocar «compartir» hasta ver la vista previa pasan menos de 2 segundos en un dispositivo actual.
- **SC-002**: El 100 % de las frases del catálogo se muestran completas, sin texto cortado, en ambos formatos.
- **SC-003**: La imagen se comparte con éxito a al menos Mensajes, WhatsApp e Instagram en iPhone.
- **SC-004**: Las 4 combinaciones de género y tema producen imágenes con los colores correctos y texto con contraste suficiente (≥ 4.5:1).
- **SC-005**: Cancelar el menú del sistema deja 0 mensajes de error visibles.
- **SC-006**: Compartir como texto funciona igual que antes en el 100 % de los casos.

## Assumptions

- La imagen se genera en el dispositivo, sin red; los tipos de letra de la app se cargan desde la red cuando hay conexión y, si no, se usa una tipografía de respaldo.
- Se necesita un plugin nativo para guardar la imagen temporalmente y adjuntarla al menú de compartir (dependencia nueva: `@capacitor/filesystem`, requiere `npx cap sync`).
- Una sola frase por imagen (no las tres versiones juntas); esa variante queda como mejora futura.
- Fuera de alcance: guardar la imagen en la galería, editar el texto o el fondo, varios estilos de plantilla y elegir idioma distinto al de la tarjeta.
- El tema y el género se leen en el momento de generar; no se guardan en la imagen más allá de sus colores.
