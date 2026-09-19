# Feature Specification: Tarjetas de Frases e Interacción

**Feature Branch**: `003-tarjetas-y-interaccion`

**Created**: 2026-09-18

**Status**: ✅ Implementado (línea base retroactiva) — con deuda técnica asociada

**Input**: Documentación del estado actual del código, no una nueva feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver y expandir la tarjeta de frase (Priority: P1)

El usuario ve 3 tarjetas apiladas en Home, toca una para expandirla y leer la frase completa con autor.

**Why this priority**: Es la interacción principal de la pantalla Home.

**Independent Test**: Renderizar `CardsContainer` con una frase cargada, tocar la tarjeta y verificar animación de expand/collapse (`motion`).

**Acceptance Scenarios**:

1. **Given** una frase cargada, **When** el usuario toca la tarjeta colapsada, **Then** se expande mostrando el contenido completo con color de fondo según el género configurado (`CardColors`).
2. **Given** la tarjeta expandida, **When** el usuario toca el botón de copiar, **Then** el texto de la frase se copia al portapapeles (`@capacitor/clipboard`) y se muestra un toast de confirmación.

---

### Edge Cases

- Los botones de favorito (bookmark) y compartir están comentados en el JSX — no hay forma de invocarlos desde la UI aunque `Phrase.isFavorite` y `toggleFavorite` existen a nivel de datos. Ver specs `completar-favoritos` y `completar-compartir`.
- `CardsContainer` calcula `adBannerId` por idioma/plataforma pero `CardPhrase` nunca renderiza el banner — ver spec `completar-banners-admob-card`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE mostrar 3 tarjetas apiladas con animación de expand/collapse al tocar.
- **FR-002**: El color de la tarjeta DEBE variar según el género configurado por el usuario (`localStorage.gender`), usando la paleta `CardColors`.
- **FR-003**: El sistema DEBE permitir copiar el texto de la frase activa al portapapeles con feedback visual (toast).
- **FR-004**: El sistema DEBE disparar feedback háptico (`@capacitor/haptics`) en las interacciones principales de tarjeta.

### Key Entities

- **CardColors** (`src/models/CardColors.ts`): enum de paletas visuales por género, puramente de presentación (no persistido).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El usuario puede copiar cualquier frase mostrada en menos de 2 toques.
- **SC-002**: La animación de expand/collapse no introduce lag perceptible en dispositivos de gama media.

## Implementación actual (archivos)

- `src/components/home/CardsContainer.tsx` — orquesta las 3 tarjetas, calcula `adBannerId`.
- `src/components/home/CardPhrase.tsx` — tarjeta individual: expand/collapse, copiar, botones comentados de bookmark/share, imports sin usar de `BannerAdOptions/Position/Size`.
- `src/models/CardColors.ts`.

## Assumptions

- El diseño de 3 tarjetas apiladas es intencional (no un placeholder) — cualquier cambio de layout debe preservarlo salvo decisión explícita.
