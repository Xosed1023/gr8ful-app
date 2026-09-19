# Feature Specification: Completar Botón Atrás en Languages

**Feature Branch**: `012-completar-back-button-languages`

**Created**: 2026-09-18

**Status**: ⚠️ Deuda técnica — menor

**Input**: Deuda técnica identificada en exploración de código.

## Estado actual

En `src/pages/Languages.tsx` (~líneas 43-48), el bloque con `IoArrowBack` está comentado. El ícono está importado pero no se usa. La pantalla no ofrece forma de volver atrás visualmente.

## Requirements *(mandatory)*

- **FR-001**: Durante el onboarding inicial (sin `backTo`), evaluar si corresponde mostrar botón atrás o si es intencional que no se pueda retroceder desde el primer paso real de configuración (Languages es la segunda pantalla tras Welcome).
- **FR-002**: Cuando `Languages` se abre con `backTo` (edición desde Settings), el botón atrás DEBE estar visible y funcional, navegando a `backTo`.

## Success Criteria *(mandatory)*

- **SC-001**: Un usuario editando su idioma desde Settings puede volver atrás sin usar el botón nativo del sistema/navegador.

## Assumptions

- Se asume que en el flujo de onboarding inicial (sin `backTo`) es aceptable no tener botón atrás, ya que retroceder ahí no tiene un destino claro definido — confirmar con `/speckit-clarify` si se prioriza.
