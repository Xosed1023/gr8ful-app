# Feature Specification: Banner fijo en Favoritos

**Feature Branch**: `029-banner-favoritos`

**Created**: 2026-10-09

**Status**: Completed (pendiente la prueba en teléfono, T008)

**Input**: Punto de la usuaria: «Agregar banner fijo en la pantalla de favoritos, parte inferior de la pantalla». Continuación de `specs/027-estrategia-de-anuncios` («más ingresos sin más intrusión»).

## Decisiones de producto (2026-10-09)

- **Un banner discreto y fijo** al pie de la pestaña Favoritos, **justo encima de la barra de pestañas flotante** (no tapa la barra ni la lista).
- **Siempre visible** mientras esa pestaña está activa; se oculta al salir y no choca con los banners de las tarjetas de Home.
- **También con Favoritos vacío**, sin solapar el mensaje de estado vacío.
- Es el único banner permanente de la app; no añade intersticiales ni cambia la política de la spec 027.
- **Local-first**: nada cambia en la persistencia.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Un banner estable al pie de Favoritos (Priority: P1)

Como dueña de la app quiero un banner fijo en Favoritos, una pantalla de consulta donde el usuario se queda un rato, para monetizar sin interrumpirlo.

**Independent Test**: Abrir Favoritos con varias frases guardadas: el banner aparece sobre la barra de pestañas y no se mueve al desplazar la lista.

**Acceptance Scenarios**:
1. **Given** la pestaña Favoritos abierta, **When** termina la transición, **Then** aparece un banner adaptativo justo encima de la barra flotante.
2. **Given** una lista larga, **When** me desplazo hasta el final, **Then** la última frase queda completa por encima del banner.
3. **Given** ninguna frase guardada, **When** abro Favoritos, **Then** veo el mensaje de estado vacío y el banner, sin solaparse.
4. **Given** el banner visible, **When** cambio a Inicio o a Ajustes, **Then** deja de verse en Favoritos.

### User Story 2 - Convive con los banners de Home (Priority: P1)

**Acceptance Scenarios**:
1. **Given** una tarjeta abierta en Home con su banner, **When** cambio a Favoritos, **Then** se ve el banner de Favoritos (no el de la tarjeta).
2. **Given** esa misma tarjeta aún abierta, **When** vuelvo a Inicio, **Then** reaparece el banner de la tarjeta.
3. **Given** Favoritos abierto, **When** cambio a Ajustes, **Then** no se ve ningún banner.

### Edge Cases

- Sin unidad propia de Favoritos en AdMob: se reutiliza la de la tarjeta EN; si no hay ninguna, no se muestra nada (sin error).
- Anuncio que no carga: no se muestra nada y el hueco queda vacío (la lista conserva su espacio).
- Android con el plugin parcheado (margen solo inferior) e iOS (margen desde la zona segura): el margen se calcula con `computeBannerMargin`.
- Idioma, género o tema distintos: no afectan al banner.
- Navegador web: el banner nativo no existe; el hueco es transparente y no estorba.
- El banner de Favoritos no cuenta como «tarjeta abierta» para los intersticiales (spec 027).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Favoritos MUST mostrar un banner adaptativo anclado abajo, a 12 px sobre la barra de pestañas flotante.
- **FR-002**: La lista y el estado vacío MUST dejar espacio suficiente para que ningún contenido quede bajo el banner ni bajo la barra.
- **FR-003**: El banner MUST ocultarse al salir de Favoritos y al desmontarse la pantalla.
- **FR-004**: Favoritos y las tarjetas de Home MUST compartir el único banner nativo a través del coordinador (`cardBanner.ts`) sin cambiar el comportamiento de Home.
- **FR-005**: El banner de Favoritos MUST mostrarse aunque Home no esté visible; los de Home, no.
- **FR-006**: El ID MUST salir de `VITE_*_FAVORITES_BANNER` y, si falta, de la tarjeta EN.
- **FR-007**: En modo pruebas MUST usarse el banner de prueba de Google (ya implementado en el coordinador).
- **FR-008**: El banner de Favoritos MUST NOT bloquear intersticiales como si fuera una tarjeta abierta.

### Key Entities

- **Petición de banner**: `{ ownerId, screen?: "home" | "favorites", adId, margin }` en el coordinador.

## Success Criteria *(mandatory)*

- **SC-001**: La convivencia Home/Favoritos tiene tests del coordinador (mostrar, cambiar de pestaña, volver, ocultar).
- **SC-002**: En el layout (medido en navegador a 390×844) la última frase termina por encima del hueco del banner y el hueco queda a 12 px sobre la barra.
- **SC-003**: En un teléfono, el banner aparece justo sobre la barra, en iOS y Android.

## Assumptions

- Los anuncios siguen siendo de prueba hasta resolver el bloqueante de AdMob (producción y UMP/GDPR).
- La usuaria creará en AdMob las unidades de banner de Favoritos (iOS y Android) y las pondrá en `.env` como `VITE_IOS_FAVORITES_BANNER` y `VITE_ANDROID_FAVORITES_BANNER`; hasta entonces se reutiliza la de la tarjeta EN.
- Alto reservado de 60 px para el banner adaptativo (alcanza para los tamaños habituales).
