# Feature Specification: Herramientas de prueba en Ajustes

**Feature Branch**: `032-herramientas-de-prueba`

**Created**: 2026-10-09

**Status**: Completed (falta la prueba en teléfono)

**Input**: Probar la racha moviendo la fecha del iPhone hace que iOS muestre «Gr8ful ya no está disponible» (el reloj se contrasta con la firma de la app). Se necesita simular el paso de los días sin tocar el reloj.

## Decisiones

- Sección **«Herramientas de prueba»** al final de Ajustes, visible **solo con `VITE_IS_TESTING=true`** (el mismo interruptor que ya fuerza los anuncios de prueba). En la versión publicada (`false`) no se renderiza.
- Solo en español: es una herramienta de desarrollo, no una función para usuarios (excepción acordada a la regla trilingüe).
- Tras cada acción se muestra un aviso y, si procede, se vuelve a «Diario» para que la app evalúe el nuevo estado.

## Acciones

| Acción | Efecto |
|---|---|
| Racha: abrí ayer | Racha de 5 con última apertura ayer → al abrir hoy sube a 6 |
| Racha: falló 1 día | Racha de 5 con última apertura anteayer → aparece el rescate |
| Racha: falló 3 días | Racha de 8 con última apertura hace 3 días → se pierde y vuelve a 1 |
| Racha: reiniciar | Borra la racha |
| Anuncios: saltar gracia de 24 h | Finge 2 días de uso |
| Anuncios: dejar listo un intersticial | Gracia saltada y 3 puntos: la siguiente acción de valor lo dispara |
| Anuncios: reiniciar contadores | Vuelve a instalación nueva |
| Tutorial: reiniciar | Se muestra al volver a «Diario» |

## Requirements

- **FR-001**: La sección MUST ocultarse cuando `VITE_IS_TESTING` no sea `"true"`.
- **FR-002**: Las acciones MUST operar solo sobre `localStorage` (racha, `adPolicy`, `tutorialDone`); sin red ni backend.
- **FR-003**: La lógica MUST vivir en `src/debug/devTools.ts` con tests.

## Success Criteria

- **SC-001**: Con la sección activa, las 3 situaciones de racha se reproducen en iPhone y Android sin cambiar la fecha del sistema.
- **SC-002**: Con `VITE_IS_TESTING=false` la sección no aparece.

## Assumptions

- Antes de publicar hay que poner `VITE_IS_TESTING=false` (también para volver a los banners e IDs reales); queda anotado en `specs/BACKLOG.md`.
