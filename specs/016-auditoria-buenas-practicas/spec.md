# Feature Specification: Auditoría de Buenas Prácticas — Reuso y Tipado

**Feature Branch**: `016-auditoria-buenas-practicas`

**Created**: 2026-09-20

**Status**: Draft

**Input**: User description: "Auditoría de buenas prácticas de código sobre todo src/ (pages, components, hooks, persistence, mapper, models) del proyecto gr8ful, con foco prioritario en reutilización antes de duplicación (Principio V) y tipado TypeScript (any, tipos débiles/implícitos, props sin tipar). Fuera de alcance: actualización de versiones de dependencias (spec de saltos mayores separada, aún no creada) y código muerto (ya cubierto por specs/014-completar-limpieza-codigo-muerto). No es una feature nueva ni cambia comportamiento observable; puede derivar en refactors internos."

## Alcance

Revisión de calidad de código sobre **todo `src/`** (`pages/`, `components/`, `hooks/`, `persistence/`, `mapper/`, `models/`), sin tocar versiones de dependencias ni introducir funcionalidad nueva. El resultado son refactors internos que preservan el comportamiento observable de la app.

**Prioridad de hallazgos** (en este orden):
1. **Reutilización antes de duplicación** (Principio V de la constitución) — lógica, patrones o componentes repetidos que deberían extraerse a un hook/servicio/componente compartido.
2. **Tipado TypeScript** — usos de `any`, tipados implícitos/débiles, props de componentes sin tipar, y oportunidades de tipado más estricto o preciso.

**Explícitamente fuera de alcance**:
- Cualquier salto de versión de dependencias (`react-router-dom` v5→v7, `@ionic/react` v8→v9, etc.) — corresponde a una spec de saltos mayores separada, aún no creada.
- Código muerto ya identificado — cubierto por `specs/014-completar-limpieza-codigo-muerto`; si esta auditoría encuentra código muerto nuevo, se documenta ahí, no aquí.
- El resto de la deuda técnica ya especificada en `specs/007`-`013` (favoritos, compartir, dark mode, banners, botón atrás, scheduling) — si un hallazgo de reuso/tipado cae dentro del código que esas specs ya van a tocar, se referencia esa spec en vez de duplicar el trabajo.
- Cambios de comportamiento visible para el usuario final — esta spec es de calidad interna, no de producto.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reutilización antes de duplicación (Priority: P1)

Como responsable de mantener gr8ful, quiero identificar y extraer a hooks/componentes/servicios compartidos la lógica o los patrones de UI que hoy están duplicados en `src/`, para que futuros cambios se apliquen en un solo lugar y se reduzca el riesgo de que las copias diverjan.

**Why this priority**: Es el Principio V de la constitución del proyecto ("Reutilizar Antes de Duplicar") y el que más impacto tiene en la velocidad de desarrollo futuro — cada duplicación encontrada y no resuelta se vuelve a pagar en cada spec de deuda técnica (`007`-`013`) que toque ese código.

**Independent Test**: Ejecutar el skill `code-review` (o `simplify`) sobre `src/` filtrando por hallazgos de duplicación/reuso; para cada hallazgo aplicado, confirmar que `npm run lint`, `npm run build` y `npm run test.unit` siguen en verde y que el recorrido manual de las funciones core no cambia.

**Acceptance Scenarios**:

1. **Given** el código actual en `src/`, **When** se ejecuta una revisión de duplicación/reuso, **Then** se obtiene un listado de hallazgos, cada uno con el/los archivo(s) afectados y la extracción propuesta (hook, componente o servicio compartido).
2. **Given** un hallazgo de duplicación aplicado (código extraído a un lugar compartido), **When** se ejecutan `npm run lint`, `npm run build` y `npm run test.unit`, **Then** los tres terminan sin errores nuevos respecto al estado antes del refactor.
3. **Given** un hallazgo de duplicación aplicado, **When** se prueba manualmente la función de la app afectada, **Then** el comportamiento observable es idéntico al de antes del refactor.
4. **Given** un hallazgo que se superpone con una spec de deuda técnica ya existente (`007`-`014`), **When** se documenta el hallazgo, **Then** se referencia esa spec en vez de resolverlo aquí.

---

### User Story 2 - Tipado TypeScript más estricto (Priority: P2)

Como responsable de mantener gr8ful, quiero eliminar o justificar los usos de `any` y los tipados implícitos/débiles en `src/`, para que el compilador detecte más errores antes de tiempo de ejecución y el código sea más fácil de entender sin tener que rastrear la forma real de los datos.

**Why this priority**: Depende en parte de que la duplicación (User Story 1) ya esté resuelta — tipar código que se va a eliminar/mover es esfuerzo perdido — pero es independientemente valiosa y verificable por separado.

**Independent Test**: Ejecutar `tsc --noEmit` (vía `npm run build`) con los tipos endurecidos y confirmar 0 errores nuevos; buscar `: any` y parámetros/props sin anotar en `src/` y confirmar que la cantidad se redujo respecto al baseline.

**Acceptance Scenarios**:

1. **Given** el código actual en `src/`, **When** se buscan usos de `any` explícito, tipados implícitos en funciones exportadas, y props de componentes sin interfaz/tipo, **Then** se obtiene un listado de hallazgos con archivo y línea.
2. **Given** un hallazgo de tipado aplicado (tipo más estricto introducido), **When** se ejecuta `npm run build`, **Then** `tsc` termina sin errores nuevos.
3. **Given** un caso donde `any` es la única opción razonable (p. ej. una librería de terceros sin tipos), **When** se documenta el hallazgo, **Then** queda marcado como "justificado" con la razón, en vez de forzarse un tipo incorrecto.

---

### Edge Cases

- ¿Qué pasa si un hallazgo de reuso o tipado requiere cambiar una firma de función usada en múltiples archivos? Se aplica el cambio de forma completa en el mismo commit/tarea (no se deja una firma a medio migrar), verificando `npm run build` al final.
- ¿Qué pasa si extraer una duplicación a un hook/componente compartido cambia sutilmente el comportamiento (p. ej. por una diferencia real entre las copias que no era solo estilística)? Se detiene esa extracción puntual, se documenta la diferencia encontrada, y se deja fuera de esta spec para decisión de producto explícita (no se decide unilateralmente cuál comportamiento es el "correcto").
- ¿Qué pasa si un hallazgo de tipado/reuso cae en código que ya tiene una spec de deuda técnica propia (`007`-`014`)? No se resuelve aquí; se documenta la referencia cruzada y se deja a esa spec.
- ¿Qué pasa si tras tipar más estricto aparecen errores reales de `tsc` que antes `any` ocultaba (bugs latentes)? Se documentan como hallazgo de calidad aparte (no se silencian con un nuevo `any`) y se corrigen si el fix es de bajo riesgo, o se dejan documentados para decisión del usuario si no lo es.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La auditoría DEBE cubrir todo `src/` (`pages/`, `components/`, `hooks/`, `persistence/`, `mapper/`, `models/`), no un subconjunto arbitrario.
- **FR-002**: Los hallazgos DEBEN priorizarse en este orden: (1) reutilización/duplicación, (2) tipado TypeScript.
- **FR-003**: Todo hallazgo aplicado (refactor) DEBE mantener `npm run lint`, `npm run build` y `npm run test.unit` en verde, sin errores nuevos respecto al estado previo al refactor.
- **FR-004**: Todo hallazgo aplicado NO DEBE cambiar el comportamiento observable de la app; donde no pueda garantizarse solo con lint/build/tests, DEBE verificarse manualmente la función afectada.
- **FR-005**: Esta spec NO DEBE duplicar el alcance de `specs/007`-`014`; donde un hallazgo se superponga, DEBE referenciar la spec correspondiente en vez de resolverlo aquí.
- **FR-006**: Esta spec NO DEBE incluir cambios de versión de dependencias; cualquier hallazgo que solo pueda resolverse actualizando una dependencia a una versión mayor DEBE documentarse como candidato para la futura spec de saltos mayores.
- **FR-007**: Cada hallazgo de tipado que use `any` de forma deliberada (por ejemplo, por una librería de terceros sin tipos) DEBE quedar documentado como "justificado" con su razón, no simplemente omitido.
- **FR-008**: La ejecución de esta spec DEBE apoyarse en el skill `code-review` y/o `simplify` sobre `src/` para identificar y, cuando corresponda, aplicar los hallazgos — no en una reescritura manual desde cero del código.

### Key Entities

- **Hallazgo de reuso**: patrón o lógica duplicada en 2+ archivos de `src/`, con la extracción propuesta (hook/componente/servicio) y su resolución (aplicado, referenciado a otra spec, o descartado con razón).
- **Hallazgo de tipado**: uso de `any` o tipado implícito/débil en `src/`, con su resolución (tipo más estricto aplicado, o justificado con razón documentada).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm run lint` termina en 0 errores al finalizar la spec.
- **SC-002**: `npm run build` (incluye `tsc`) termina en 0 errores al finalizar la spec.
- **SC-003**: `npm run test.unit` termina con el 100% de las pruebas en verde al finalizar la spec.
- **SC-004**: El número de usos de `any` explícito en `src/` sin justificación documentada se reduce a 0.
- **SC-005**: Cada patrón de duplicación identificado en la auditoría queda o bien extraído a un único punto compartido, o bien documentado con la razón por la que no se extrajo (referencia a otra spec, o diferencia de comportamiento real entre las copias).
- **SC-006**: Las funciones core de la app (mostrar frase, favoritos, cambio de idioma EN/ES/FR, anuncios) verificadas manualmente después de los refactors se comportan igual que antes de esta spec.

## Assumptions

- El código funcional actual (post Spec 015) es el punto de partida; "sin romper nada" se mide contra ese estado, no contra una reescritura desde cero.
- La ejecución de los hallazgos se apoya en los skills `code-review`/`simplify` disponibles en el entorno de desarrollo, no en un linter de duplicación/tipado adicional instalado como nueva dependencia (eso estaría fuera de alcance por FR-006 si implicara agregar herramientas nuevas al proyecto).
- No se exige alcanzar `strict` al 100% de TypeScript más allá de lo ya configurado en `tsconfig.json` (que ya tiene `"strict": true`) — el foco es reducir `any` explícito y tipados implícitos evitables dentro del código de `src/`, no reconfigurar el compilador.
- Los hallazgos que impliquen una decisión de producto (por ejemplo, cuál de dos comportamientos divergentes es el correcto) quedan fuera del alcance de aplicación automática de esta spec y se documentan para decisión explícita del usuario.
