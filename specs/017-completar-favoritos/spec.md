# Feature Specification: Completar Favoritos

**Feature Branch**: `017-completar-favoritos`

**Created**: 2026-09-21

**Status**: Draft

**Input**: User description: "Completar la funcionalidad de favoritos de gr8ful, fusionando specs/007-completar-favoritos y specs/010-completar-bug-favoritos-indexeddb en una sola spec. Corregir el bug de tipo en getFavoritePhrases, cablear el botón de bookmark en CardPhrase, y crear un tercer tab de Favoritos en la barra inferior donde se puede desmarcar directamente. Considerar casos de prueba completos."

## Reemplaza a

Esta spec fusiona y **reemplaza** a `specs/007-completar-favoritos` y `specs/010-completar-bug-favoritos-indexeddb`, que quedan cerradas/superadas por esta — no se trabaja en paralelo sobre ellas.

## Decisiones de producto ya confirmadas

- La lista de favoritos vive en un **tercer tab** en la barra inferior (Home / Favoritos / Ajustes), no dentro de Ajustes.
- Desde la lista de Favoritos se puede **quitar un favorito directamente** tocando el mismo ícono de bookmark (relleno); la frase desaparece de la lista al instante.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marcar y desmarcar una frase como favorita desde Home (Priority: P1)

Como usuario que está leyendo frases en Home, quiero tocar un ícono de marcador en la tarjeta para guardarla como favorita, y volver a tocarlo para quitarla, para poder encontrarla después sin depender de que vuelva a aparecer al azar.

**Why this priority**: Es el punto de entrada de todo el feature — sin poder marcar una frase, no hay nada que listar en Favoritos. Es además la corrección de una funcionalidad que ya existe a nivel de datos (`toggleFavorite`) pero está desconectada de la UI.

**Independent Test**: Desde Home, tocar el ícono de bookmark en la tarjeta visible; el ícono cambia a estado "relleno" inmediatamente. Cerrar y reabrir la app; la frase sigue marcada como favorita.

**Acceptance Scenarios**:

1. **Given** una tarjeta expandida en Home con una frase no favorita, **When** el usuario toca el ícono de bookmark, **Then** el ícono pasa a estado relleno y la frase queda persistida como favorita.
2. **Given** una tarjeta con una frase ya favorita (ícono relleno), **When** el usuario toca el ícono de bookmark, **Then** el ícono vuelve a estado outline y la frase deja de estar marcada como favorita.
3. **Given** el usuario marcó una frase como favorita, **When** cierra completamente la app y la vuelve a abrir, **Then** si esa misma frase vuelve a mostrarse en Home (por la selección aleatoria), el ícono de bookmark sigue reflejando que está marcada como favorita.
4. **Given** el usuario toca el ícono de bookmark, **When** la tarjeta está expandida o colapsada, **Then** tocar el ícono no dispara además el toggle de expandir/colapsar la tarjeta (los dos gestos no deben interferirse).

---

### User Story 2 - Ver y gestionar la lista de frases favoritas (Priority: P2)

Como usuario que ya marcó frases como favoritas, quiero abrir una pantalla dedicada que las liste todas, para releerlas cuando quiera sin esperar a que vuelvan a aparecer al azar, y poder quitar las que ya no quiero conservar.

**Why this priority**: Depende de que User Story 1 exista (no hay nada que listar sin poder marcar primero), pero es el valor central que el usuario percibe — sin esta pantalla, marcar favoritos no tiene ningún efecto visible más allá del ícono.

**Independent Test**: Con al menos una frase marcada como favorita (User Story 1), abrir el tab de Favoritos y verificar que la frase aparece en la lista. Tocar su ícono de bookmark en la lista y verificar que desaparece de inmediato.

**Acceptance Scenarios**:

1. **Given** el usuario tiene 3 frases marcadas como favoritas, **When** abre el tab de Favoritos, **Then** ve exactamente esas 3 frases, en el idioma seleccionado actualmente en la app.
2. **Given** el usuario no tiene ninguna frase marcada como favorita, **When** abre el tab de Favoritos, **Then** ve un estado vacío claro (mensaje indicando que no hay favoritos todavía), no una lista en blanco sin explicación.
3. **Given** el usuario está viendo la lista de Favoritos, **When** toca el ícono de bookmark de una de las frases listadas, **Then** esa frase se quita de favoritos y desaparece de la lista inmediatamente, sin necesidad de recargar la pantalla.
4. **Given** el usuario cambia el idioma de la app (EN/ES/FR) desde Ajustes, **When** vuelve a abrir el tab de Favoritos, **Then** las frases favoritas se muestran en el nuevo idioma seleccionado (mismo contenido, distinto idioma — no cambia cuáles frases están marcadas).
5. **Given** el usuario está viendo la frase actual en Home y la marcó como favorita, **When** navega al tab de Favoritos y la desmarca ahí, **Then** al volver al tab Home esa misma frase ya no aparece como favorita (el ícono de bookmark en Home refleja el estado real y actualizado, no un estado obsoleto).

---

### Edge Cases

- ¿Qué pasa si el usuario marca como favorita la misma frase que ya está marcada, en rápida sucesión (doble tap accidental)? El segundo toque debe interpretarse como "desmarcar" (toggle normal), no duplicar ni causar un estado inconsistente.
- ¿Qué pasa si la base de datos local (IndexedDB) todavía no terminó de inicializarse cuando el usuario abre el tab de Favoritos apenas arranca la app? La pantalla debe manejarlo sin error visible (lista vacía o estado de carga breve, nunca una pantalla rota).
- ¿Qué pasa si todas las frases disponibles terminan marcadas como favoritas? La lista de Favoritos debe poder mostrarlas todas sin límite artificial.
- ¿Qué pasa con el bug ya identificado de `getFavoritePhrases` (compara contra el string `"true"` en vez del booleano `true`)? Debe corregirse como parte de esta spec — es el prerequisito técnico para que User Story 2 funcione en absoluto; sin este fix, la lista de Favoritos estaría siempre vacía sin importar cuántas frases se marquen.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir marcar una frase como favorita desde la tarjeta en Home, y desmarcarla de la misma forma (toggle).
- **FR-002**: El ícono de marcador DEBE reflejar visualmente y en tiempo real si la frase mostrada está o no marcada como favorita.
- **FR-003**: Marcar/desmarcar una frase como favorita DEBE persistir de forma duradera (sobrevive a cerrar y reabrir la app), no solo en memoria durante la sesión.
- **FR-004**: El sistema DEBE corregir la consulta de frases favoritas para que compare correctamente contra el tipo de dato real almacenado (booleano), de forma que toda frase marcada como favorita aparezca de forma confiable al consultarla.
- **FR-005**: El sistema DEBE ofrecer una pantalla dedicada, accesible desde un tercer tab en la navegación principal (junto a Home y Ajustes), que liste todas las frases actualmente marcadas como favoritas.
- **FR-006**: Cuando no hay ninguna frase favorita, la pantalla de Favoritos DEBE mostrar un mensaje de estado vacío en vez de una lista en blanco.
- **FR-007**: El usuario DEBE poder quitar una frase de favoritos directamente desde la lista de Favoritos, y la frase DEBE desaparecer de esa lista de forma inmediata al hacerlo.
- **FR-008**: El contenido mostrado en la lista de Favoritos DEBE respetar el idioma seleccionado actualmente en la app (EN/ES/FR), igual que el resto de las pantallas.
- **FR-009**: El estado de favorito de una frase DEBE mantenerse consistente entre Home y la lista de Favoritos — desmarcar una frase en una pantalla se refleja en la otra la próxima vez que se muestra esa frase.
- **FR-010**: Tocar el ícono de marcador NO DEBE disparar accidentalmente el gesto de expandir/colapsar la tarjeta en Home (los dos controles deben ser independientes).

### Key Entities

- **Phrase (existente, sin cambios de estructura)**: ya tiene `id`, `isFavorite: boolean`, y `content` multi-idioma — esta spec no agrega campos nuevos, corrige cómo se consulta por `isFavorite` y completa la UI que lo usa.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario puede marcar una frase como favorita desde Home y encontrarla en la lista de Favoritos sin ningún paso adicional o retraso perceptible.
- **SC-002**: Tras marcar N frases como favoritas, la pantalla de Favoritos muestra exactamente esas N frases — 0 discrepancias entre lo marcado y lo listado.
- **SC-003**: Una frase marcada como favorita sigue apareciendo como tal después de cerrar y reabrir la app, el 100% de las veces.
- **SC-004**: Un usuario puede quitar una frase de favoritos tanto desde Home como desde la lista de Favoritos, y el cambio se refleja en ambos lugares sin necesidad de recargar la app manualmente.
- **SC-005**: Con cero frases favoritas, la pantalla de Favoritos comunica claramente ese estado vacío, sin dejar al usuario sin saber si algo falló.

## Assumptions

- El fix de `getFavoritePhrases()` (comparar contra `true` booleano) es prerequisito técnico de esta spec completa, no una spec separada — se resuelve como parte del mismo trabajo, no antes ni después.
- La navegación principal pasa de 2 a 3 tabs (Home / Favoritos / Ajustes); el ícono y posición exacta del nuevo tab quedan a criterio de implementación siguiendo el estilo visual ya usado por los tabs existentes.
- No se define un límite máximo de frases favoritas — si el catálogo completo de frases se marca como favorito, la lista debe soportarlo igual.
- Esta spec no modifica la lógica de selección aleatoria de frases (`getRandomPhrase`) más allá de que debe seguir funcionando exactamente igual que hoy.
- No se agregan animaciones nuevas más allá de las transiciones estándar ya usadas en el resto de la app (Ionic/Framer Motion existente).
- No se toca la integración de AdMod/banners (`specs/011-completar-banners-admob-card`) — queda fuera de alcance, es deuda técnica separada.
