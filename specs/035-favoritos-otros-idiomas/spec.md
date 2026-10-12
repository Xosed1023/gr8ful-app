# Feature Specification: «Ver en otros idiomas» en Favoritos

**Feature Branch**: `035-favoritos-otros-idiomas`

**Created**: 2026-10-09

**Status**: Completed

**Input**: Las frases de Favoritos solo se ven en el idioma de la app, aunque cada frase existe en tres idiomas (propósito de aprendizaje de la app).

## Decisiones de producto (2026-10-09)

- Cada tarjeta de Favoritos muestra un enlace **«Ver en otros idiomas»** que despliega, bajo la frase, las **dos versiones restantes** (si la app está en español: inglés y francés), cada una con su nombre en el idioma original (English, Français…) y con comillas propias de cada idioma.
- El enlace cambia a **«Ocultar idiomas»** y la flecha gira; despliegue y plegado con una animación calmada (altura + fundido, sin rebotes).
- Cada versión desplegada lleva su **propio botón de copiar**, así queda claro qué idioma se copia.
- Las tarjetas se despliegan de forma independiente; el estado no se guarda al salir de la pestaña.
- Textos EN/ES/FR; accesible (`aria-expanded`).

## Acceptance Scenarios
1. **Given** una tarjeta, **When** pulso «Ver en otros idiomas», **Then** aparecen las dos versiones restantes con su etiqueta.
2. **Given** las versiones visibles, **When** pulso «Ocultar idiomas», **Then** se pliegan con suavidad.
3. **Given** una versión desplegada, **When** pulso su botón de copiar, **Then** se copia esa frase en ese idioma.
4. **Given** que cambio el idioma de la app, **Then** las «otras versiones» pasan a ser las dos distintas del nuevo idioma.
5. **Given** reduced motion, **Then** el despliegue es instantáneo.

## Requirements
- **FR-001**: La tarjeta MUST mostrar siempre los tres idiomas disponibles entre la principal y las desplegables.
- **FR-002**: El orden de las versiones MUST ser fijo (ES, EN, FR) sin la del idioma de la app.
- **FR-003**: Copiar cada versión MUST usar la lógica compartida de la spec 034.

## Success Criteria
- **SC-001**: Con la app en cada uno de los 3 idiomas, las dos versiones restantes son las correctas.
- **SC-002**: El despliegue no desplaza el resto de la lista de forma brusca.
