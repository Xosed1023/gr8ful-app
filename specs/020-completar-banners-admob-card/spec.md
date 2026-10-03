# Feature Specification: Completar Banners AdMob por Tarjeta

**Feature Branch**: `020-completar-banners-admob-card`

**Created**: 2026-10-02

**Status**: ✅ Implementado (verificado en iOS; Android pendiente de validar la posición)

**Input**: "Completar specs/011-completar-banners-admob-card": cada tarjeta de Home muestra un banner propio cuando se abre, tal como en el diseño de Figma.

## Reemplaza a

Esta spec reemplaza a `specs/011-completar-banners-admob-card`, que queda superada. La decisión de producto que dejaba bloqueada a la 011 ya está tomada.

## Decisión de producto (2026-10-02)

**Sí se completan los banners.** Cada una de las 3 tarjetas de Home (EN, ES, FR) tiene su propio banner, que se ve **solo cuando esa tarjeta está abierta (expandida)**. En el diseño de Figma (archivo «Mokups-Proyecto-Frases», Home con chip, frame `317:2`) el recuadro rectangular bajo la frase y los botones de la tarjeta abierta corresponde al banner.

## Contexto y estado actual

- Cada tarjeta ya recibe un identificador de banner propio según su idioma y la plataforma (iOS/Android), pero hoy no muestra ningún anuncio.
- Hubo una versión anterior con banners que se retiró (commit `4d1ee27`): mostraba el banner con la tarjeta **cerrada** y lo ocultaba al abrirla. Esta spec invierte ese comportamiento: el banner aparece **al abrir** la tarjeta.
- Los anuncios actuales (intersticial cada 45 s y rewarded) **no cambian** (Principio IV de la constitución).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver el banner de una tarjeta al abrirla (Priority: P1)

Como usuario que abre una tarjeta de Home para leer la frase con calma, veo un banner publicitario dentro de esa tarjeta, debajo de la frase y los botones, para que la app genere ingresos sin interrumpir la lectura.

**Why this priority**: Es el valor de la feature: completar el modelo de monetización definido en el diseño.

**Independent Test**: En Home, tocar una tarjeta para abrirla y confirmar que aparece un banner en la zona reservada, sin tapar la frase ni los botones. Tocarla de nuevo para cerrarla y confirmar que el banner desaparece.

**Acceptance Scenarios**:

1. **Given** las tres tarjetas cerradas, **When** el usuario abre una tarjeta, **Then** aparece el banner correspondiente a esa tarjeta, dentro de ella y debajo de los botones, sin tapar la frase ni los botones de favorito, compartir y copiar.
2. **Given** una tarjeta abierta con su banner visible, **When** el usuario la cierra, **Then** el banner desaparece de inmediato.
3. **Given** las tarjetas cerradas, **When** el usuario está en Home sin abrir ninguna, **Then** no se muestra ningún banner.
4. **Given** el usuario abre la tarjeta EN y luego la ES, **When** ambas estuvieron abiertas, **Then** nunca se ven dos banners a la vez: se muestra solo el de la tarjeta abierta más recientemente.

---

### User Story 2 - El banner no estorba ni deja huecos (Priority: P1)

Como usuario, quiero que la tarjeta se vea bien aunque el anuncio tarde en cargar o falle, y que el banner desaparezca cuando salgo de Home, para que la app nunca se vea rota.

**Why this priority**: Un anuncio que falla o queda flotando sobre otras pantallas degrada la experiencia más de lo que aporta.

**Independent Test**: Con la red desactivada, abrir una tarjeta y confirmar que no queda un recuadro vacío ni un mensaje de error. Con un banner visible, cambiar a Ajustes o Favoritos y confirmar que el banner ya no se ve.

**Acceptance Scenarios**:

1. **Given** el anuncio no se puede cargar (sin red o sin inventario), **When** el usuario abre una tarjeta, **Then** la tarjeta se ve completa y normal, sin marcador de error ni recuadro vacío visible.
2. **Given** un banner visible, **When** el usuario cambia a otra pestaña (Favoritos, Ajustes), **Then** el banner se oculta.
3. **Given** el usuario vuelve a Home y abre una tarjeta, **When** la tarjeta se abre, **Then** el banner vuelve a aparecer.
4. **Given** la app pasa a segundo plano y vuelve, **When** hay una tarjeta abierta, **Then** el banner se muestra correctamente en la tarjeta o está oculto si ya no corresponde, sin quedar flotando en una posición equivocada.
5. **Given** se muestra un intersticial o un rewarded, **When** termina, **Then** el banner de la tarjeta abierta sigue funcionando con normalidad.

---

### User Story 3 - El banner se ve bien en ambos temas y en ambas plataformas (Priority: P2)

Como usuario de iOS o Android, con el modo claro u oscuro, quiero que el banner quede dentro de su tarjeta y alineado, para que la tarjeta se vea cuidada.

**Why this priority**: Pulido visual; sin él la feature funciona pero se ve descuidada.

**Independent Test**: Repetir la historia 1 en iOS y en Android, en modo claro y en modo oscuro, con las tres tarjetas.

**Acceptance Scenarios**:

1. **Given** cada una de las tres tarjetas abiertas por separado, **When** se muestra su banner, **Then** queda dentro de los límites visibles de esa tarjeta, centrado, sin quedar cortado por la barra del autor ni por la barra de navegación.
2. **Given** modo claro u oscuro, **When** se abre una tarjeta, **Then** el espacio del banner se integra con el color de la tarjeta de esa paleta.
3. **Given** iOS o Android, **When** se abre una tarjeta, **Then** el banner queda en la misma posición relativa a la tarjeta en ambas.

---

### Edge Cases

- **Tarjeta abierta y giro/cambio de tamaño de pantalla**: el banner no debe quedar desalineado respecto a su tarjeta (la app es solo vertical, pero el cambio de teclado o barras del sistema no debe moverlo).
- **Abrir y cerrar rápido**: abrir y cerrar varias veces seguidas no debe dejar un banner "fantasma" visible con la tarjeta cerrada.
- **Tarjeta abierta al terminar la animación**: el banner no debe aparecer en una posición intermedia mientras la tarjeta aún se anima; aparece cuando la tarjeta termina de abrirse.
- **Modo pruebas**: con la configuración de pruebas activa deben mostrarse anuncios de prueba, nunca reales.
- **Sin identificador de banner** para una plataforma o idioma: no se muestra banner y la tarjeta funciona igual.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cada una de las 3 tarjetas de Home DEBE mostrar un banner propio, asociado al identificador de su idioma y plataforma, **solo mientras esa tarjeta está abierta**.
- **FR-002**: El banner DEBE ubicarse dentro de la tarjeta abierta, debajo de la frase y de la fila de chip y botones, sin tapar ninguno de ellos.
- **FR-003**: Al cerrar la tarjeta, el banner DEBE ocultarse de inmediato; con todas las tarjetas cerradas NO DEBE verse ningún banner.
- **FR-004**: NUNCA DEBE haber más de un banner visible a la vez; si hay varias tarjetas abiertas, se muestra el de la abierta más recientemente.
- **FR-005**: El banner DEBE aparecer cuando la tarjeta termina de abrirse, no durante su animación.
- **FR-006**: Si el anuncio no carga o falla, la tarjeta DEBE verse y funcionar con normalidad, sin mensajes de error visibles al usuario ni recuadros vacíos.
- **FR-007**: El banner DEBE ocultarse al salir de Home (cambio de pestaña) y al volver a Home DEBE reaparecer solo si hay una tarjeta abierta.
- **FR-008**: La feature NO DEBE alterar la frecuencia, ubicación ni disparo de los anuncios intersticiales (cada 45 s) ni rewarded.
- **FR-009**: Con la configuración de pruebas activa, el banner DEBE usar anuncios de prueba.
- **FR-010**: La ubicación del banner DEBE ser equivalente en iOS y Android y verse integrada en los modos claro y oscuro de ambas paletas (mujer y hombre).
- **FR-011**: Eliminar el código y la configuración sobrantes de la versión anterior que ya no apliquen (valores de posición obsoletos, importaciones sin uso) una vez completada la feature (SC-001 de la spec 011).

### Key Entities

- **Banner de tarjeta**: anuncio asociado a una de las 3 tarjetas (EN, ES, FR) y a una plataforma; visible si y solo si su tarjeta está abierta y es la abierta más recientemente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En el 100 % de las aperturas de tarjeta con anuncio disponible, el banner aparece dentro de la tarjeta sin tapar la frase ni los botones.
- **SC-002**: En el 100 % de los cierres de tarjeta o cambios de pestaña, el banner deja de verse en menos de 1 segundo.
- **SC-003**: Nunca se observan dos banners simultáneos ni un banner con todas las tarjetas cerradas.
- **SC-004**: Con el anuncio sin cargar (sin red), 0 tarjetas muestran mensaje de error, recuadro vacío o desplazamiento del contenido.
- **SC-005**: Los intersticiales y rewarded siguen apareciendo con la misma frecuencia y condiciones que antes de la feature.
- **SC-006**: Las 3 tarjetas se ven correctas con banner en iOS y Android, en modo claro y oscuro, en una revisión visual de las 12 combinaciones.

## Assumptions

- La plataforma de anuncios muestra **un solo banner a la vez**; por eso una tarjeta abierta más reciente reemplaza el banner de la anterior (FR-004).
- La posición del banner sigue el diseño de Figma (recuadro de unos 344×78 bajo los botones de la tarjeta abierta); el tamaño exacto del anuncio se decide en el plan, dentro de los formatos estándar de banner.
- La tarjeta mantiene su altura y contenido con o sin anuncio: el espacio del banner está reservado y no cambia el diseño de la tarjeta.
- Se usan los 6 identificadores de banner ya configurados (iOS/Android × EN/ES/FR); no se crean unidades de anuncio nuevas.
- Las cuentas de AdMob/AdSense siguen en verificación (ver `specs/BACKLOG.md`): hasta resolverla se prueba con anuncios de prueba y no se espera ingreso real.
- Alcance limitado a Home; no se añaden banners en otras pantallas.
