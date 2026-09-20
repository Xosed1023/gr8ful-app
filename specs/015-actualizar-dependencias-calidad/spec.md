# Feature Specification: Actualización de Dependencias y Calidad del Código

**Feature Branch**: `015-actualizar-dependencias-calidad`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Actualización de dependencias y calidad del codigo"

## Alcance

Esta spec cubre **únicamente actualizaciones menores (`minor`) y de parche (`patch`)** de las dependencias actuales del proyecto, dentro de los rangos ya declarados en `package.json` (`npm outdated` → columna "Wanted") o inmediatamente por encima sin cruzar un número de versión mayor.

**Explícitamente fuera de alcance**: cualquier salto de versión mayor (`major`) de una dependencia — por ejemplo `react-router-dom` v5 → v7, `@ionic/react` v8 → v9, `@capacitor-community/admob` v5 → v8, `@capacitor/*` v7 → v8, `typescript` v5 → v7, `vitest` v0 → v5. Esos saltos requieren su propia spec, ya que implican evaluar cambios de API incompatibles y no pueden validarse con los mismos criterios de aceptación de bajo riesgo que un bump menor/patch.

## Clarifications

### Session 2026-09-19

- Q: ¿La verificación de que "nada se rompió" debe incluir también una compilación/sincronización nativa con Capacitor (Android/iOS), o basta con verificar en el navegador vía `npm run dev`? → A: Navegador + `npx cap sync` sin errores (verificación liviana de que el proyecto nativo sigue sincronizando), sin llegar a build/ejecución completa en Android Studio/Xcode.
- Q: ¿Esta actualización debe verificar que no queden vulnerabilidades conocidas de severidad alta/crítica (vía `npm audit` o equivalente)? → A: No, el alcance se limita estrictamente a los criterios ya definidos (lint, build, test.unit, dev, funciones core, `npx cap sync`); la auditoría de seguridad queda fuera de esta spec.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dependencias actualizadas dentro de su versión mayor actual, sin romper nada (Priority: P1)

Como responsable de mantener gr8ful, quiero que las dependencias del proyecto se actualicen a la última versión menor/parche disponible dentro de su versión mayor actual, para incorporar correcciones de bugs y parches de seguridad sin asumir el riesgo de una migración mayor.

**Why this priority**: Es la forma de menor riesgo de reducir la brecha de actualización y cerrar vulnerabilidades conocidas sin comprometer la estabilidad de la app antes de decidir si se abordan los saltos mayores en otra spec.

**Independent Test**: Ejecutar `npm outdated` tras la actualización y confirmar que la columna "Current" coincide con "Wanted" para todas las dependencias, sin que ninguna haya cruzado a una nueva versión mayor.

**Acceptance Scenarios**:

1. **Given** el `package.json` actual, **When** se actualizan las dependencias dentro de su rango menor/parche, **Then** ninguna dependencia queda en una versión mayor distinta a la que tenía antes de empezar.
2. **Given** las dependencias actualizadas, **When** se ejecuta `npm run lint`, **Then** el comando termina sin errores.
3. **Given** las dependencias actualizadas, **When** se ejecuta `npm run build`, **Then** la compilación de TypeScript (`tsc`) termina sin errores.
4. **Given** las dependencias actualizadas, **When** se ejecuta `npm run test.unit`, **Then** todas las pruebas pasan (suite en verde).
5. **Given** las dependencias actualizadas, **When** se ejecuta `npm run dev`, **Then** la app arranca correctamente en el navegador.
6. **Given** la app corriendo con `npm run dev`, **When** se prueban manualmente las funciones core (mostrar una frase, marcar/ver favoritos, cambiar de idioma EN/ES/FR), **Then** todas siguen funcionando igual que antes de la actualización.
7. **Given** las dependencias actualizadas (incluidos los plugins nativos de Capacitor y AdMob), **When** se ejecuta `npx cap sync`, **Then** el comando termina sin errores.

---

### User Story 2 - El código pasa los controles de calidad sin errores (Priority: P2)

Como responsable de mantener gr8ful, quiero que el proyecto compile y pase el linter sin errores tras la actualización de dependencias, para que la base de código quede en un estado confiable y verificable automáticamente.

**Why this priority**: Sin esto, no hay forma objetiva de confirmar que la actualización de dependencias (User Story 1) no rompió nada; depende de que las dependencias ya estén actualizadas.

**Independent Test**: Ejecutar `npm run lint` y `npm run build` sobre el repo y confirmar que ambos terminan sin errores.

**Acceptance Scenarios**:

1. **Given** el código fuente en `src/` tras la actualización, **When** se ejecuta `npm run lint`, **Then** no se reportan errores.
2. **Given** el código fuente en `src/` tras la actualización, **When** se ejecuta `npm run build`, **Then** `tsc` y el bundler terminan sin errores.

---

### Edge Cases

- ¿Qué ocurre si una dependencia no tiene ninguna actualización menor/parche disponible (ya está en su última versión dentro de su rango mayor)? Se deja sin cambios; no es un fallo de esta spec.
- ¿Qué ocurre si al actualizar dentro del rango menor/parche `npm run lint`, `npm run build` o `npm run test.unit` empiezan a fallar? Se investiga si el fallo proviene de la propia actualización; si requiere una migración de API (indicio de que en realidad se necesitaba un salto mayor), esa dependencia se deja fuera de esta spec y se documenta para la spec de saltos mayores.
- ¿Qué ocurre si actualizar una dependencia de AdMob dentro de su rango menor/parche cambia el comportamiento visible de los anuncios? Debe verificarse manualmente el flujo de anuncios (intersticiales/rewarded) antes de dar la actualización por completa, dado que es una fuente de ingresos (Principio IV de la constitución).
- ¿Qué ocurre si el linter señala errores en código que pertenece a una spec de deuda técnica ya documentada (007-014, p. ej. `014-completar-limpieza-codigo-muerto`)? Esta spec no debe duplicar ese trabajo; debe referenciarlo y dejar su resolución a la spec correspondiente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El proyecto DEBE actualizar cada dependencia de producción y desarrollo a su versión menor/parche más reciente dentro de la misma versión mayor actual (equivalente a lo que `npm outdated` reporta como "Wanted").
- **FR-002**: Ninguna dependencia DEBE cruzar a una nueva versión mayor como parte de este trabajo; los saltos mayores quedan fuera de alcance y se documentan como candidatos para una spec futura.
- **FR-003**: `npm run lint` DEBE completarse sin errores tras aplicar las actualizaciones.
- **FR-004**: `npm run build` (incluye `tsc`) DEBE completarse sin errores tras aplicar las actualizaciones.
- **FR-005**: `npm run test.unit` DEBE completarse con todas las pruebas en verde tras aplicar las actualizaciones.
- **FR-006**: La app DEBE arrancar correctamente con `npm run dev` tras aplicar las actualizaciones.
- **FR-007**: Tras la actualización, DEBE verificarse manualmente que las funciones core de la app — mostrar una frase, gestionar favoritos, y cambiar de idioma (EN/ES/FR) — siguen funcionando igual que antes.
- **FR-008**: Este trabajo NO DEBE duplicar el alcance de las specs de deuda técnica ya existentes (`007`-`014`); donde haya solapamiento (p. ej. imports sin usar cubiertos por `014-completar-limpieza-codigo-muerto`), esta spec debe referenciarla en vez de redefinir su alcance.
- **FR-009**: Cualquier cambio de comportamiento visible de anuncios (frecuencia, ubicación, disparo) como efecto secundario de actualizar una dependencia de AdMob dentro de su rango menor/parche DEBE evitarse o, si es inevitable, requiere decisión explícita antes de aplicarse (Principio IV de la constitución).
- **FR-010**: Tras la actualización de las dependencias nativas (Capacitor y sus plugins, AdMob), `npx cap sync` DEBE completarse sin errores, como verificación liviana de que el proyecto nativo (Android/iOS) sigue sincronizando correctamente; no se exige build ni ejecución completa en Android Studio o Xcode como parte de esta spec.

### Key Entities

- **Dependencia**: paquete de terceros usado por el proyecto (producción o desarrollo), con versión actual y versión "wanted" (menor/parche más reciente dentro de su versión mayor).
- **Hallazgo de calidad**: error de lint o de compilación detectado durante o después de la actualización, con su resolución.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm outdated` no reporta ninguna dependencia con una versión "Wanted" distinta a "Current" (todas están al día dentro de su versión mayor).
- **SC-002**: `npm run lint` termina en 0 errores.
- **SC-003**: `npm run build` termina en 0 errores.
- **SC-004**: `npm run test.unit` termina con el 100% de las pruebas en verde.
- **SC-005**: La app arranca sin errores con `npm run dev` y las funciones core (mostrar frase, favoritos, cambio de idioma) funcionan sin regresiones verificadas manualmente.
- **SC-006**: `npx cap sync` termina sin errores tras la actualización.

## Assumptions

- Esta spec cubre solo bumps `minor`/`patch` dentro de `package.json`; los saltos de versión mayor (p. ej. `react-router-dom` v5→v7, `@ionic/react` v8→v9, `@capacitor-community/admob` v5→v8, `typescript` v5→v7, `vitest` v0→v5) quedan fuera de alcance y se abordarán en una spec separada.
- El trabajo de limpieza de código muerto ya identificado (`specs/014-completar-limpieza-codigo-muerto`) se resuelve mediante esa spec, no se redefine aquí.
- No hay backend propio ni CI descrito en el repo hoy: la verificación de "sigue funcionando" se apoya en los scripts existentes (`lint`, `build`, `test.unit`, `dev`) y en pruebas manuales en el navegador de desarrollo.
- No se exige que `npm run lint` quede libre de advertencias (solo de errores) ni que `npm run test.e2e` se ejecute como parte de esta spec, dado que el alcance definido por el usuario se limita a los criterios de aceptación indicados arriba.
- El codebase funcional actual (previo a esta spec) es el punto de partida y el comportamiento de referencia contra el que se mide "sin romper nada" (FR-006/FR-007/FR-009/FR-010) — no una reescritura desde cero.
- Mantener sincronizados los Pods nativos de iOS tras la actualización (FR-010) requirió subir el deployment target mínimo de la app de 14.0 a 17.0 (alineado al Xcode instalado); no se considera una regresión de esta spec, sino una consecuencia necesaria de FR-010 sobre el codebase de partida (ver research.md, Decisión 6).
