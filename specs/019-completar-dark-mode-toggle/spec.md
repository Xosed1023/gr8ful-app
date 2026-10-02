# Feature Specification: Completar Toggle de Dark Mode

**Feature Branch**: `019-completar-dark-mode-toggle`

**Created**: 2026-09-21

**Updated**: 2026-10-02 (alcance ampliado: modo oscuro completo con paletas de mujer y hombre)

**Status**: ✅ Implementado

**Input**: User description: "Completar specs/009-completar-dark-mode-toggle: descomentar y cablear el toggle de dark mode en Settings.tsx." Ampliado el 2026-10-02: el toggle ya está cableado, pero activarlo solo oscurece los componentes de Ionic; el resto de la app (fondos, tarjetas, botones, toast) conserva colores claros fijos. El alcance pasa a cubrir toda la app, con paletas oscuras propias para mujer y hombre según el diseño de Figma.

## Reemplaza a

Esta spec reemplaza a `specs/009-completar-dark-mode-toggle`, que queda superada.

## Historial de alcance

- **Versión inicial (2026-09-21)**: solo descomentar y cablear el control de Ajustes. Supuso que el resto de pantallas se adaptaría solo y dejó la revisión visual fuera de alcance.
- **Verificación manual (2026-10-02)**: se comprobó que el control funciona, pero la mayoría de elementos propios de la app no cambian porque usan colores fijos. Por eso el modo oscuro quedaba a medias.
- **Ampliación (2026-10-02)**: la revisión visual pasa a estar dentro del alcance. Se diseñó el modo oscuro en Figma para ambas paletas (ver "Referencia de diseño").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Activar/desactivar modo oscuro desde Ajustes (Priority: P1)

Como usuario, quiero un control visible en Ajustes para activar o desactivar el modo oscuro, y que el cambio se vea reflejado de inmediato y se recuerde la próxima vez que abra la app.

**Why this priority**: Es la base de la feature: sin el control no hay modo oscuro. Ya está implementada; esta historia se conserva como requisito de regresión.

**Independent Test**: Abrir Ajustes, activar el toggle de tema oscuro, confirmar que la app cambia de tema sin recargar. Reiniciar la app y confirmar que el tema oscuro persiste.

**Acceptance Scenarios**:

1. **Given** el usuario está en Ajustes con el tema claro activo, **When** activa el toggle de modo oscuro, **Then** la app cambia a tema oscuro de inmediato, sin recargar ni navegar.
2. **Given** el modo oscuro está activo, **When** el usuario desactiva el toggle, **Then** la app vuelve a tema claro de inmediato.
3. **Given** el usuario activó el modo oscuro, **When** cierra completamente la app y la reabre, **Then** el tema oscuro sigue activo en cualquier pantalla, no solo en Ajustes.
4. **Given** el usuario cambia el idioma de la app, **When** vuelve a Ajustes, **Then** la etiqueta del toggle de modo oscuro se muestra en el idioma correcto.

---

### User Story 2 - Todas las pantallas se ven en modo oscuro (Priority: P1)

Como usuario con el modo oscuro activo, quiero que todas las pantallas de la app (bienvenida, onboarding, carga, Home, Ajustes y Favoritos) se vean oscuras y legibles, para no encontrar zonas claras que rompan la experiencia ni cansen la vista.

**Why this priority**: Sin esto el modo oscuro es engañoso: el usuario lo activa y solo cambia una parte de la app.

**Independent Test**: Con el modo oscuro activo, recorrer todas las pantallas en orden y confirmar que ninguna muestra fondos claros fijos, textos ilegibles o botones que desentonen.

**Acceptance Scenarios**:

1. **Given** el modo oscuro está activo, **When** el usuario recorre bienvenida, onboarding (idioma, género, hora, temas, nombre) y pantalla de carga, **Then** los fondos son oscuros, los textos claros y legibles, y los botones principales invierten su contraste.
2. **Given** el modo oscuro está activo, **When** el usuario ve Home, **Then** el fondo, las tres tarjetas, la barra del autor y la barra de navegación inferior se ven oscuros, con texto claro sobre cada tarjeta.
3. **Given** el modo oscuro está activo, **When** el usuario abre Ajustes y Favoritos, **Then** listas, iconos, chips y toggles son legibles sobre fondo oscuro.
4. **Given** el modo oscuro está activo, **When** la app muestra un mensaje temporal (toast), **Then** también tiene aspecto oscuro y es legible.

---

### User Story 3 - Cada género conserva su identidad de color (Priority: P2)

Como usuario que eligió "mujer" u "hombre" en el onboarding, quiero que el modo oscuro mantenga la paleta que caracteriza mi versión de la app (morados para mujer, azules para hombre), para que el modo oscuro se sienta como mi misma app, solo que de noche.

**Why this priority**: La app tiene dos identidades visuales según el género elegido; un modo oscuro único las borraría. Es secundaria respecto a que todo esté oscuro, pero parte del diseño aprobado.

**Independent Test**: Con el modo oscuro activo, cambiar el género entre mujer y hombre y comparar Home y los fondos: cada uno debe mostrar su paleta propia.

**Acceptance Scenarios**:

1. **Given** el modo oscuro está activo y el usuario eligió mujer, **When** ve Home, **Then** el fondo tiene un degradado morado atenuado y las tarjetas usan la secuencia azul / morado / violeta de la paleta de mujer.
2. **Given** el modo oscuro está activo y el usuario eligió hombre, **When** ve Home, **Then** el fondo tiene un degradado azul atenuado y las tarjetas usan la secuencia de azules de la paleta de hombre.
3. **Given** el modo oscuro está activo y el usuario vuelve al paso de género del onboarding para elegir el otro, **When** llega a Home, **Then** la paleta mostrada corresponde al nuevo género.

---

### Edge Cases

- **Navegar tras activar el modo oscuro**: el tema oscuro se ve aplicado también en Home y Favoritos, no solo en Ajustes.
- **Reabrir la app con el modo oscuro persistido**: no debe haber un destello de pantalla clara antes de aplicar el tema oscuro.
- **Elementos con imagen estática** (por ejemplo, el logo de Gr8ful): el logo es una imagen sin recolorear; puede verse con menos contraste en oscuro. Es una limitación conocida y aceptada (ver Assumptions).
- **Texto sobre botones de contraste invertido** (por ejemplo, "A woman" / "A man" en el paso de género): el texto del botón debe ser oscuro sobre el fondo claro del botón, no claro sobre claro.
- **Cambio de género con el modo oscuro activo**: el género solo se elige en el onboarding (no hay selector en Ajustes); al elegir el otro, la paleta cambia sin necesidad de reiniciar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE mostrar un control visible en Ajustes para activar/desactivar el modo oscuro.
- **FR-002**: Cambiar el control DEBE aplicar o quitar el tema oscuro de toda la app de inmediato, sin requerir recargar ni navegar.
- **FR-003**: El estado del modo oscuro DEBE persistir entre sesiones (sobrevive a cerrar y reabrir la app).
- **FR-004**: El estado inicial del control al abrir Ajustes DEBE reflejar el valor realmente persistido, no siempre aparecer apagado.
- **FR-005**: Con el modo oscuro activo, TODAS las pantallas de la app (bienvenida, onboarding, carga, Home, Ajustes, Favoritos) DEBEN mostrar fondos oscuros y textos claros, sin elementos con fondo claro fijo.
- **FR-006**: Con el modo oscuro activo, los botones principales DEBEN invertir su contraste (fondo claro, texto oscuro) y su texto DEBE ser legible.
- **FR-007**: Con el modo oscuro activo, las tres tarjetas de Home DEBEN mostrar el texto de la frase con contraste suficiente para leerse sin esfuerzo, conservando el tono propio de cada tarjeta.
- **FR-008**: El modo oscuro DEBE tener dos paletas, una para mujer y otra para hombre, según el género elegido, y DEBE cambiar de paleta si el género cambia.
- **FR-009**: Los mensajes temporales (toast) DEBEN verse con aspecto oscuro cuando el modo oscuro está activo.
- **FR-010**: Con el modo oscuro desactivado, la app DEBE verse exactamente igual que antes (sin regresiones visuales en el tema claro).
- **FR-011**: Al abrir la app con el modo oscuro persistido, NO DEBE mostrarse un destello de tema claro antes de aplicar el oscuro.

### Key Entities

- **Preferencia de modo oscuro**: valor persistido localmente (activo/inactivo) que determina el tema de toda la app.
- **Paleta por género**: conjunto de colores oscuros (fondo, degradados, tarjetas, barra del autor) asociado a "mujer" u "hombre".

## Referencia de diseño

Fuente de verdad visual: archivo de Figma "Mokups-Proyecto-Frases", página "Protoripos de alta". Las pantallas oscuras están 2301 px por debajo de las originales, con los sufijos `(dark · mujer)` y `(dark · hombre)` (16 pantallas en total: 10 de mujer y 6 de hombre).

**Colores comunes**

| Elemento | Claro (actual) | Oscuro |
|---|---|---|
| Texto principal | `#000000` | `#ECEAF4` |
| Texto secundario | `#506A7B` / `#706589` | `#A9A7BD` |
| Acento (texto) | `#6F4BF2` | `#A58BFF` |
| Botón principal | fondo `#000000`, texto blanco | fondo `#ECEAF4`, texto igual al fondo de pantalla |
| Barra de navegación inferior | `#010326` | `#0B0F1C` |
| Botón destacado (morado) | `#6F4BF2` | sin cambio |

**Paleta de mujer**

| Elemento | Claro (actual) | Oscuro |
|---|---|---|
| Fondo de pantalla | `#F8F6F6` | `#0F1220` |
| Degradado de fondo | morado `#6F36EB` | morado atenuado `#4A27A8` |
| Tarjeta 1 (EN) | `#61B2E4` | `#1E5F8A` |
| Tarjeta 2 (ES) | `#B399C8` | `#4C2A85` |
| Tarjeta 3 (FR) | `#D0C2F3` | `#5B3FA8` |
| Barra del autor | `#322C53` | `#141830` |
| Texto sobre tarjetas | tonos oscuros | claros (`#E6F3FA`, `#F1E9FA`, `#F5F3FF`) |

**Paleta de hombre**

| Elemento | Claro (actual) | Oscuro |
|---|---|---|
| Fondo de pantalla | `#F8F6F6` | `#0C1520` |
| Degradado de fondo | azul `#3C91C7` / cian | azul atenuado `#1E5F8A` |
| Tarjeta 1 (EN) | `#61B2E4` | `#1E5F8A` |
| Tarjeta 2 (ES) | `#5A9ABE` | `#1B5073` |
| Tarjeta 3 (FR) | `#95C5DE` | `#2A6F96` |
| Barra del autor | `#1C2742` | `#101A2E` |
| Texto sobre tarjetas | tonos oscuros | claro `#E6F3FA` |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El usuario puede alternar entre modo claro y oscuro desde Ajustes sin reiniciar la app.
- **SC-002**: El estado del modo oscuro persiste correctamente el 100% de las veces tras cerrar y reabrir la app.
- **SC-003**: Recorriendo las 16 pantallas del diseño en modo oscuro, 0 pantallas muestran zonas con fondo claro fijo ni texto ilegible.
- **SC-004**: El texto de cada tarjeta de Home alcanza un contraste mínimo de 4.5:1 frente a su fondo, en ambas paletas.
- **SC-005**: Las dos paletas son distinguibles: un observador identifica correctamente la paleta de mujer (morados) y la de hombre (azules) en Home.
- **SC-006**: Con el modo oscuro desactivado, las pantallas son idénticas a las de antes de esta spec.

## Assumptions

- El diseño de Figma es la referencia visual aprobada por el usuario; los valores de color de "Referencia de diseño" provienen de él.
- El logo de Gr8ful y los puntos del stepper son imágenes SVG estáticas que no se pueden recolorear por tokens. En modo oscuro se adaptan con un filtro de inversión (verificado en dispositivo el 2026-10-02: el logo negro y el estado activo del stepper no tenían contraste). Vectorizar el logo para poder tokenizar sus colores sigue siendo trabajo futuro (`specs/BACKLOG.md`).
- Quedan **pendientes de revisión en el diseño** antes de implementar: el texto de los botones del paso de género (Step 1, debe ser oscuro sobre botón claro) y las pantallas dark no revisadas visualmente (Login, Step 2, 3 y 5, Preferences de mujer, variante de Home con chip, Step 11, 13 y Loading de hombre).
- Los valores de contraste (SC-004) se verifican al implementar; los colores del diseño son una propuesta y pueden ajustarse si no alcanzan el mínimo.
- El modo oscuro es una preferencia explícita del usuario; no se sigue automáticamente el tema del sistema operativo.
- Se mantiene la restricción local-first: la preferencia se guarda solo en el dispositivo.
