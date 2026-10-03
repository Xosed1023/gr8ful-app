# Feature Specification: Completar Compartir Frase

**Feature Branch**: `018-completar-compartir`

**Created**: 2026-09-21

**Status**: ✅ Implementado

**Input**: User description: "Completar specs/008-completar-compartir: cablear el botón de compartir en CardPhrase.tsx con @capacitor/share, y corregir de paso el bug de que la tarjeta de Home siempre muestra/comparte el contenido en español hardcodeado sin importar el idioma seleccionado."

## Reemplaza a

Esta spec reemplaza a `specs/008-completar-compartir`, que queda superada.

## Hallazgo adicional incorporado (decisión ya confirmada con el usuario)

Al revisar `CardPhrase.tsx` para esta spec se encontró que las 3 tarjetas de Home muestran `phrase.content.es` **hardcodeado** (bug no documentado en ninguna spec anterior, viola el Principio II — Trilingüe Obligatorio). El diseño de Home son **3 tarjetas, una por idioma** (EN, ES, FR), independientes del idioma de la app. El botón de copiar existente tiene el mismo problema. El usuario confirmó corregir esto como parte de esta spec, ya que se va a tocar el mismo componente para cablear compartir, y el requisito de "compartir en el idioma mostrado" no tiene sentido si lo mostrado nunca cambia de idioma.

**Corrección (2026-10-02)**: la primera implementación leía el idioma de la app (`useAppLanguage()`), con lo que las 3 tarjetas mostraban el mismo idioma. Se detectó en la verificación manual y se corrigió: cada tarjeta recibe su idioma por prop (`language`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cada tarjeta de Home muestra su propio idioma (Priority: P1)

Como usuario que ve las 3 tarjetas de Home, quiero que cada una muestre la frase en su idioma (una en EN, otra en ES y otra en FR), para poder comparar la frase entre idiomas, que es el propósito de aprendizaje de la app.

**Why this priority**: Es un defecto de un principio central del producto (trilingüe obligatorio) y, además, es prerequisito real de User Story 2 — no tiene sentido "compartir en el idioma de la tarjeta" si todas las tarjetas muestran siempre español.

**Independent Test**: Abrir Home y confirmar que las 3 tarjetas muestran la misma frase en EN, ES y FR respectivamente. Cambiar el idioma de la app en Ajustes y confirmar que las tarjetas no cambian de idioma.

**Acceptance Scenarios**:

1. **Given** el usuario está en Home, **When** ve las 3 tarjetas, **Then** la primera muestra `phrase.content.en`, la segunda `phrase.content.es` y la tercera `phrase.content.fr`.
2. **Given** el usuario cambia el idioma de la app en Ajustes, **When** vuelve a Home, **Then** las 3 tarjetas siguen mostrando cada una su idioma (el idioma de la app no las afecta).
3. **Given** el usuario toca el botón de copiar al portapapeles en una tarjeta, **When** pega el contenido copiado, **Then** el texto copiado está en el idioma de esa tarjeta.

---

### User Story 2 - Compartir una frase con otras apps (Priority: P2)

Como usuario que está leyendo una frase que le gustó, quiero tocar un botón de compartir y que se abra el share sheet nativo del sistema, para poder enviarla a otra persona o publicarla desde cualquier app instalada.

**Why this priority**: Depende de que User Story 1 esté resuelta (compartir el idioma correcto), pero es el valor nuevo real que agrega esta spec — hoy el botón ni siquiera existe en la UI.

**Independent Test**: Tocar el botón de compartir en una tarjeta expandida; confirmar que se abre el share sheet nativo del sistema operativo con el texto de la frase.

**Acceptance Scenarios**:

1. **Given** una tarjeta expandida con una frase en el idioma actual, **When** el usuario toca el botón de compartir, **Then** se abre el share sheet nativo del sistema con el texto de la frase y su autor.
2. **Given** el usuario cancela el share sheet sin elegir ninguna app, **When** vuelve a la tarjeta, **Then** la app sigue funcionando con normalidad, sin error visible.
3. **Given** el usuario toca compartir, **When** el share sheet se abre, **Then** no se dispara además el gesto de expandir/colapsar la tarjeta (mismo cuidado ya aplicado al botón de favoritos).

---

### Edge Cases

- ¿Qué pasa si el dispositivo no tiene ninguna app instalada que soporte compartir texto? El sistema operativo maneja ese caso (share sheet vacío o mensaje nativo) — la app no necesita un manejo especial más allá de no crashear.
- ¿Qué pasa si `Share.share()` falla (excepción del plugin nativo)? Debe manejarse sin dejar la app en un estado roto, de forma similar a como ya se maneja el error del botón de copiar (mensaje de error, no un crash).
- ¿Qué pasa con el autor de la frase si no está disponible? Se comparte solo el texto de la frase (comportamiento ya validado en la UI actual, que siempre muestra `phrase.author`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cada tarjeta de Home DEBE mostrar el contenido de la frase en su propio idioma (EN, ES o FR, según la tarjeta), independientemente del idioma de la app.
- **FR-002**: El botón de copiar al portapapeles DEBE copiar el contenido en el idioma de la tarjeta donde se toca.
- **FR-003**: El sistema DEBE agregar la capacidad de compartir vía el share sheet nativo del sistema operativo (Android/iOS).
- **FR-004**: El botón de compartir DEBE estar visible y funcional en la tarjeta expandida de Home.
- **FR-005**: El texto compartido DEBE incluir la frase en el idioma de la tarjeta donde se toca y su autor.
- **FR-006**: Tocar el botón de compartir NO DEBE disparar el gesto de expandir/colapsar la tarjeta.
- **FR-007**: Un error al intentar compartir (o una cancelación del usuario) NO DEBE dejar la app en un estado roto o inconsistente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Las 3 tarjetas de Home muestran la frase en EN, ES y FR respectivamente, el 100% de las veces, sin importar el idioma de la app.
- **SC-002**: El usuario puede compartir una frase a cualquier app instalada que soporte recibir texto compartido, en Android e iOS.
- **SC-003**: Cancelar el share sheet o que falle el share no produce ningún error visible ni deja la tarjeta en un estado roto.

## Assumptions

- Se comparte solo texto plano en esta versión (no imagen generada) — compartir como imagen queda en `specs/BACKLOG.md` como candidata separada de mayor esfuerzo, sin cambios.
- Se agrega `@capacitor/share` como dependencia nueva — única excepción justificada al Principio V ("reutilizar antes de duplicar"), ya que no existe ningún mecanismo de compartir nativo implementado en el proyecto.
- El fix del idioma hardcodeado (User Story 1) se limita a `CardPhrase.tsx` (el componente que muestra y comparte la frase) — no se audita el resto del proyecto en busca de bugs similares como parte de esta spec.
