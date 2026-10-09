# Feature Specification: Compartir y copiar desde Favoritos

**Feature Branch**: `034-compartir-copiar-favoritos`

**Created**: 2026-10-09

**Status**: Completed (falta la prueba en teléfono)

**Input**: En Favoritos solo se puede quitar una frase de guardadas; para compartirla o copiarla hay que volver a Home.

## Decisiones de producto (2026-10-09)

- Cada tarjeta de Favoritos lleva **copiar** y **compartir** (iconos, mismo estilo que las acciones de Home).
- **Compartir** abre el mismo menú que en Home (como imagen o como texto), en el **idioma de la app**.
- **Copiar** copia la frase en el idioma de la app y avisa con un toast breve (EN/ES/FR); si falla, avisa del error.
- Ambas acciones cuentan como «momentos de valor» de la estrategia de anuncios (spec 027), igual que en Home.
- Mientras el menú de compartir está abierto, el banner nativo de Favoritos se oculta (si no, flotaría sobre el menú) y vuelve al cerrarlo.
- Los textos nuevos son trilingües y la lógica de copiar/compartir se reutiliza entre Home y Favoritos (`src/share/quoteActions.ts`).

## Acceptance Scenarios
1. **Given** una tarjeta de Favoritos, **When** pulso copiar, **Then** la frase queda en el portapapeles y veo «Frase copiada».
2. **Given** una tarjeta de Favoritos, **When** pulso compartir, **Then** se abre el menú con «Como imagen» y «Como texto» y la frase en el idioma de la app.
3. **Given** el menú abierto, **When** lo cierro, **Then** el banner de Favoritos reaparece.
4. **Given** una acción completada, **When** acumulo puntos suficientes (spec 027), **Then** puede salir un intersticial tras la acción.
5. **Given** que quito la frase de favoritos, **Then** la tarjeta se desvanece como hasta ahora.

## Requirements
- **FR-001**: Copiar y compartir MUST estar disponibles en cada tarjeta de Favoritos.
- **FR-002**: La lógica MUST compartirse con Home (sin duplicarla).
- **FR-003**: El banner de Favoritos MUST ocultarse con el menú de compartir abierto.
- **FR-004**: Textos y etiquetas accesibles EN/ES/FR.

## Success Criteria
- **SC-001**: Copiar y compartir funcionan en Favoritos igual que en Home en iPhone y Android.
- **SC-002**: Sin regresiones en Home (mismos avisos y puntos de anuncios).
