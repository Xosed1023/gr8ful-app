# Feature Specification: Completar Botón Atrás en Languages

**Feature Branch**: `012-completar-back-button-languages`

**Created**: 2026-09-18

**Status**: ✅ Implementado

**Input**: Deuda técnica identificada en exploración de código.

## Estado actual

En `src/pages/Languages.tsx` (~líneas 43-48), el bloque con `IoArrowBack` está comentado. El ícono está importado pero no se usa. La pantalla no ofrece forma de volver atrás visualmente.

## Decisión (2026-10-02)

- **Onboarding inicial (sin `backTo`): sin botón atrás, de forma intencional.** El paso previo es `Welcome`, que al montarse redirige a `/mainHome` si `gr8fulFirstTime` ya es `"true"` (la app lo marca en el primer arranque). Un botón atrás desde Languages llevaría a Home sin completar el onboarding.
- **Edición desde Ajustes (con `backTo`): botón atrás visible**, reutilizando el componente común `BackButton` (como Gender, QuoteTime, QuoteTopics y UserName) y navegando a `backTo`.

## Requirements *(mandatory)*

- **FR-001** *(resuelto)*: Durante el onboarding inicial (sin `backTo`) NO se muestra botón atrás (ver Decisión).
- **FR-002**: Cuando `Languages` se abre con `backTo` (edición desde Settings), el botón atrás DEBE estar visible y funcional, navegando a `backTo`.

## Success Criteria *(mandatory)*

- **SC-001**: Un usuario editando su idioma desde Settings puede volver atrás sin usar el botón nativo del sistema/navegador.

## Assumptions

- En el onboarding no hay destino válido al que volver (ver Decisión).
- Implementación: `src/pages/Languages.tsx` (bloque comentado y import `IoArrowBack` eliminados; se usa `BackButton`). Verificación: abrir Ajustes → Idioma y pulsar la flecha para volver; en el onboarding la flecha no aparece.
- Hallazgo en iPhone (2026-10-02): la flecha quedaba encima de la hora (barra de estado/isla dinámica). `BackButton` ahora se posiciona con `top: calc(env(safe-area-inset-top, 0px) + 1rem)`; aplica a todas las pantallas que lo usan (Languages, Gender, QuoteTime, QuoteTopics, UserName). `--ion-safe-area-top` no sirve porque `variables.css` la fija en 25px.
