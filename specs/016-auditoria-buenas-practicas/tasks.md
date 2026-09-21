---
description: "Task list template for feature implementation"
---

# Tasks: Auditoría de Buenas Prácticas — Reuso y Tipado

**Input**: Design documents from `/specs/016-auditoria-buenas-practicas/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No se solicitaron tests automatizados nuevos (no hay suite de componentes hoy); la validación es mediante `npm run lint`/`build`/`test.unit` y verificación manual, como define quickstart.md.

**Organization**: Tareas agrupadas por user story. Fase 2 (Foundational) crea los 4 artefactos compartidos (`useAppLanguage`, `useUserGender`, `hapticTap`, `BackButton`) que las migraciones de archivo de la Fase 3 consumen.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivo distinto, sin dependencia de una tarea incompleta)
- **[Story]**: A qué user story pertenece (US1, US2)
- Se incluye el archivo exacto afectado y, cuando aplica, el hallazgo de `research.md` que resuelve (A1-A6, B1-B7)

## Path Conventions

Proyecto único (mobile-app Ionic + Capacitor + React). Todos los paths son relativos a la raíz del repo (`/Users/zen/Documents/projects/zen/projects/gr8ful-app`).

---

## Phase 1: Setup

**Purpose**: Establecer un punto de comparación antes de tocar nada

- [X] T001 Verificar que `git status` está limpio en la raíz del repo antes de empezar — solo `specs/016-.../` sin trackear (esperado)
- [X] T002 [P] Capturar baseline: `npm run lint`, `npm run build`, `npm run test.unit`, y `grep -rn ": any\|<any>\|any\[\]" src/ --include="*.tsx" --include="*.ts"` (debe dar 2 resultados: `QuoteTopics.tsx:10` y `:36` — quickstart.md, sección 1) — confirmado: lint 0 errores, build 0 errores, test.unit 1 passed (1 error preexistente no relacionado, `indexedDB is not defined` en el entorno de test), grep con exactamente los 2 resultados esperados

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Crear los artefactos compartidos que consumen las migraciones de US1 — bloquea Phase 3

**⚠️ CRITICAL**: Ninguna tarea de US1 puede empezar hasta que esta fase esté completa

- [X] T003 Exportar `LanguageKeys` (`type LanguageKeys = "es" | "en" | "fr"`) en `src/persistence/languages.ts` — hoy existe pero sin `export` — research.md B4
- [X] T004 Crear `useAppLanguage()` en `src/hooks/useAppLanguage.ts` — devuelve `{ userLanguage: LanguageKeys }` con fallback a `"en"`, importando `LanguageKeys` de T003 — data-model.md "Contrato de useAppLanguage()", research.md A1/B4 (depende de T003)
- [X] T005 [P] Crear `useUserGender()` en `src/hooks/useUserGender.ts` — define y exporta `type Gender = "M" | "W"`, devuelve `{ gender: Gender; isMale: boolean; isWoman: boolean }` — data-model.md "Contrato de useUserGender()", research.md A2/B5
- [X] T006 [P] Crear `hapticTap()` en `src/hooks/useHaptics.ts` — encapsula `Haptics.impact({ style: ImpactStyle.Medium })` con el mismo `try/catch` + fallback a `navigator.vibrate` que hoy solo tiene `CardPhrase.tsx:111-117` — data-model.md "Contrato de hapticTap()", research.md A3
- [X] T007 [P] Crear `BackButton` en `src/components/common/BackButton.tsx` (carpeta `common/` nueva) — props `{ onClick: () => void; className?: string }` — data-model.md "Contrato de BackButton", research.md A4. **Ajuste sobre el contrato original**: se usó `className` en vez de `to`, porque en la implementación real las 4 pantallas navegan con `useIonRouter().push(dest, "back"/"forward")` o `goBack()`, nunca con una URL plana — y porque `QuoteTopics.tsx` posiciona su botón distinto (`top-6 left-6 z-10`) al resto (`top-4 left-4`); sin ese override se habría cambiado su posición visual, violando FR-004.

**Checkpoint**: Artefactos compartidos listos — las migraciones de US1 pueden empezar

---

## Phase 3: User Story 1 - Reutilización antes de duplicación (Priority: P1) 🎯 MVP

**Goal**: Migrar cada archivo con un patrón duplicado (idioma, género, haptics, botón atrás) a su artefacto compartido de Phase 2, sin cambiar comportamiento observable.

**Independent Test**: Con Phase 2 completa, aplicar las migraciones de esta fase y seguir quickstart.md secciones 2-5 (idioma en EN/ES/FR por pantalla, género, haptics en dispositivo, botón atrás) — todo debe verse y comportarse igual que antes del refactor.

### Implementation for User Story 1

- [X] T008 [P] [US1] Migrar `src/pages/Gender.tsx` a `useAppLanguage()` (líneas 9-38), `BackButton` (líneas 47-52) y `hapticTap()` (líneas 74, 83) — research.md A1, A3, A4
- [X] T009 [P] [US1] Migrar `src/pages/Languages.tsx` a `useAppLanguage()` (líneas 11-35) y `hapticTap()` (línea 17) — research.md A1, A3. **`BackButton` NO se aplicó aquí**: el botón atrás de esta pantalla está comentado (dead code, líneas 43-48), es decir hoy no se renderiza ningún botón; migrarlo a `BackButton` lo habría descomentado y cambiado el comportamiento observable (aparecería un botón que hoy no existe), violando FR-004. Se deja el bloque comentado intacto, sin tocar (coincide con el alcance de `specs/014-completar-limpieza-codigo-muerto`, no de esta spec).
- [X] T010 [P] [US1] Migrar `src/pages/QuoteTime.tsx` a `useAppLanguage()` (líneas 10-26), `useUserGender()` (líneas 35-36), `BackButton` (líneas 43-48) y `hapticTap()` (línea 32) — research.md A1, A2, A3, A4
- [X] T011 [P] [US1] Migrar `src/pages/QuoteTopics.tsx` a `useAppLanguage()` (líneas 31-69), `useUserGender()` (líneas 78-79, 134-137, 148-149), `BackButton` con `className="absolute top-6 left-6 z-10"` (líneas 91-107, con su lógica condicional extra preservada tal cual) y `hapticTap()` (líneas 42, 75) — research.md A1, A2, A3, A4
- [X] T012 [P] [US1] Migrar `src/pages/UserName.tsx` a `useAppLanguage()` (líneas 15-46), `useUserGender()` (líneas 48-49, 95), `BackButton` (líneas 56-61) y `hapticTap()` (línea 20) — research.md A1, A2, A3, A4
- [X] T013 [P] [US1] `src/pages/Home.tsx` — **NO migrado a `useAppLanguage()` como se planeaba**: a diferencia de las pantallas de onboarding, Home se revisita sin remount (p. ej. al volver de Ajustes tras cambiar idioma) mediante un segundo `useEffect(() => setUserLanguage(...), [navigate])` que SÍ es necesario, no redundante como asumió `research.md` A1 inicialmente. Migrarlo al hook (que solo lee una vez al montar) habría roto el refresco de idioma al revisitar Home — regresión real detectada al implementar, cubierta por el Edge Case de `spec.md` ("si extraer una duplicación cambia sutilmente el comportamiento, se detiene esa extracción puntual"). Se aplicó en su lugar solo el tipado (`LanguageKeys` en vez de `string | null`, sin `as keyof typeof`), preservando el mecanismo de refresco intacto — ver T030.
- [X] T014 [P] [US1] `src/pages/Settings.tsx` — **mismo ajuste que T013 y por la misma razón**: el segundo `useEffect` de relectura de idioma (líneas 41-43) es necesario (Settings también se revisita tras cambiar idioma), no se eliminó. Se aplicó solo el tipado (`LanguageKeys`, sin `as keyof typeof`), preservando el refresco — ver T030.
- [X] T015 [P] [US1] Migrar `src/pages/LoadingScreen.tsx` a `useAppLanguage()` (líneas 9-18) y `useUserGender()` (líneas 20-21) — research.md A1, A2
- [X] T016 [P] [US1] Migrar `src/components/home/CardsContainer.tsx` a `useUserGender()` (línea 8) — research.md A2
- [X] T017 [P] [US1] Migrar `src/components/home/Greetings.tsx` a `useUserGender()` (líneas 11-13), agregando de paso `interface GreetingsProps` (B7, costo marginal del mismo diff) — research.md A2
- [X] T018 [P] [US1] Migrar `src/components/home/CardPhrase.tsx` a `hapticTap()` (líneas 99, 113), removiendo el `triggerHapticFeedback` local — research.md A3. Nota: la línea 99 (`toggleCard`) no tenía fallback a `navigator.vibrate` antes; ahora sí lo tiene vía `hapticTap()`, mejora de robustez prevista en research.md, no un cambio de comportamiento observable para el usuario.
- [X] T019 [P] [US1] Migrar `src/pages/Welcome.tsx` a `hapticTap()` (línea 62) — research.md A3

**Checkpoint**: User Story 1 completa — seguir quickstart.md secciones 2-5 antes de dar por cerrada

---

## Phase 4: User Story 2 - Tipado TypeScript más estricto (Priority: P2)

**Goal**: Eliminar los `any` explícitos y el tipo `Topic` implícito-global, y corregir la inconsistencia de `backTo` obligatorio/opcional.

**Independent Test**: Con Phase 2 completa (no depende de Phase 3), ejecutar `npm run build` y confirmar 0 errores; grep de `: any` en `src/` debe dar 0 resultados — quickstart.md sección 6.

### Implementation for User Story 2

- [X] T020 [US2] Agregar `export` a `type Topic` en `src/models/Topic.ts`, e importarlo explícitamente (en vez de depender de la resolución global implícita) en `src/pages/QuoteTopics.tsx:19`, `src/persistence/languages.ts:6` y `src/persistence/IndexedDBService.ts:49` — research.md B3
- [X] T021 [US2] En `src/pages/QuoteTopics.tsx`: cambiar `useState<any[]>([])` (línea 10) a `useState<Topic[]>([])` y `toggleTopic = async (topic: any) =>` (línea 36) a `(topic: Topic) =>` — research.md B1/B2
- [X] T022 [P] [US2] En `src/pages/Languages.tsx`: cambiar prop `{ backTo: string }` a `{ backTo?: string }` (línea 8), igualando a `UserName.tsx` — research.md B6
- [X] T023 [P] [US2] En `src/pages/QuoteTime.tsx`: cambiar prop `{ backTo: string }` a `{ backTo?: string }` (línea 8) — research.md B6
- [X] T024 [US2] En `src/pages/QuoteTopics.tsx`: cambiar prop `{ backTo: string }` a `{ backTo?: string }` (línea 8) — research.md B6

**Checkpoint**: User Stories 1 y 2 completas

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Hallazgos opcionales (no bloquean el cierre de la spec) y cierre de validación

- [ ] T025 [P] Opcional, NO aplicado (research.md A5, baja prioridad): en `src/components/home/CardPhrase.tsx`, extraer `bottomAdSpace` a un mapa `{small, medium, large}` — se dejó sin aplicar para mantener el diff acotado a lo priorizado (A1-A4/B1-B6); queda documentado como candidato futuro, no bloquea el cierre de la spec (FR explícitamente opcional)
- [ ] T026 [P] Opcional, NO aplicado (research.md A6, baja prioridad): en `src/components/home/CardsContainer.tsx`, extraer la selección de color por género a una tabla `GENDER_CARD_COLORS` — mismo criterio que T025, queda como candidato futuro
- [X] T027 [P] Opcional, aplicado PARCIALMENTE (research.md B7, baja prioridad): se agregó `interface GreetingsProps` en `Greetings.tsx` (T017, costo marginal del mismo diff). No se aplicó en `CardsContainer.tsx`, `Home.tsx`, `Languages.tsx`, `QuoteTime.tsx`, `QuoteTopics.tsx` — sus props siguen inline; queda como candidato futuro de bajo riesgo, no bloquea el cierre de la spec
- [X] T028 Ejecutar `npm run lint`, `npm run build`, `npm run test.unit` sobre el estado final y confirmar 0 errores; re-correr el grep de T002 y confirmar 0 resultados — SC-001, SC-002, SC-003, SC-004 — confirmado: lint 0 errores, `tsc`/build 0 errores, test.unit 1 passed (mismo error preexistente no relacionado que en el baseline de T002), grep de `any` con 0 resultados
- [X] T029 Verificación manual completa según quickstart.md secciones 2-5 (idioma EN/ES/FR en las 8 pantallas, género, haptics en dispositivo físico, botón atrás) — Verificado en iPhone físico del usuario, build corrido desde Xcode tras `npm run build && npx cap sync ios`. Confirmado por el usuario ("todo funciona bien"), sin regresiones respecto al comportamiento anterior a esta spec. Los 3 warnings de Xcode que aparecieron (Update to recommended settings, [CP] Embed Pods Frameworks/Copy Pods Resources/Copy XCFrameworks sin outputs) son genéricos de CocoaPods/Xcode, preexistentes y no relacionados con esta spec — no requieren acción.
- [X] T030 Hallazgos de Calidad encontrados durante la implementación (no previstos en `research.md`), documentados aquí siguiendo el formato de `specs/015-actualizar-dependencias-calidad/tasks.md` (T012, T015, T016):
  - **Hallazgo 1 — Home.tsx y Settings.tsx necesitan releer el idioma al revisitar la pantalla**: `research.md` (A1) asumió que el segundo `useEffect` de `Settings.tsx` (líneas 41-43, relectura de `userLanguage` en cada navegación) era redundante y debía eliminarse al migrar a `useAppLanguage()`. Al implementar se detectó que `Home.tsx` tiene el mismo patrón (`useEffect(() => setUserLanguage(...), [navigate])`), y que en ambos casos es **necesario**: son las dos pantallas principales de la app (no de onboarding) a las que el usuario vuelve después de cambiar el idioma en Ajustes, y sin ese refresco el texto quedaría desactualizado hasta un remount completo. `useAppLanguage()` tal como está diseñado (lee una sola vez al montar, sin mecanismo de refresco) no cubre este caso. **Resolución**: T013/T014 no migraron estas dos pantallas al hook; se les aplicó solo tipado (`LanguageKeys` en vez de `string | null`, sin los casteos `as keyof typeof`), preservando intacto el mecanismo de refresco. `useAppLanguage()` queda con su contrato original (correcto para las 6 pantallas de onboarding que sí lo usan). **Candidato futuro**: si se quisiera unificar también estos dos casos, `useAppLanguage()` necesitaría una variante con refresco (p. ej. escuchar cambios de ruta o exponer una función de refetch) — evaluado y descartado por ahora para no ampliar el alcance de esta spec más allá de lo ya priorizado.
  - **Hallazgo 2 — `BackButton` necesitó un prop `className` no previsto en `data-model.md`**: el contrato original (`{ onClick?: () => void; to?: string }`) no contemplaba que `QuoteTopics.tsx` posiciona su botón atrás en una ubicación visual distinta (`top-6 left-6 z-10`) al resto de las pantallas (`top-4 left-4`). Se agregó `className?: string` (con el valor por defecto igual al de las otras 3 pantallas) para preservar la posición exacta de cada una — de lo contrario se habría alterado el layout visible de `QuoteTopics.tsx`, violando FR-004. Se usó `onClick: () => void` como prop obligatoria (no opcional) porque los 4 call-sites reales siempre lo pasan; se retiró `to?: string` del contrato por no tener ningún caso de uso real (todas las pantallas navegan vía `useIonRouter()`, no con una URL plana).
  - **Hallazgo 3 — `Languages.tsx` tiene un botón atrás comentado (dead code), no activo**: research.md A4 asumió que las 4-5 pantallas con botón atrás incluían `Languages.tsx`, pero su bloque está comentado (líneas 43-48 originales) — hoy no se renderiza ningún botón ahí. Migrarlo a `BackButton` habría significado descomentarlo y agregar un botón visible donde hoy no existe, un cambio de comportamiento observable fuera del alcance de esta spec (y del dominio de `specs/014-completar-limpieza-codigo-muerto`, no de esta). Se dejó el bloque comentado intacto, sin tocar.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias
- **Foundational (Phase 2)**: Depende de Setup — BLOQUEA a Phase 3 (US1). T004 depende de T003; T005/T006/T007 son paralelas entre sí y con T004.
- **User Story 1 (Phase 3)**: Depende de Phase 2 completa. Las tareas T008-T019 son paralelas entre sí (archivos distintos)
- **User Story 2 (Phase 4)**: Depende de Phase 2 completa (no de Phase 3) para T020, T022, T023 — pero T021 y T024 comparten archivo (`QuoteTopics.tsx`) con T011 (US1), así que en la práctica conviene aplicarlas después de T011 aunque no exista una dependencia formal de historia a historia
- **Polish (Phase 5)**: Depende de que Phase 3 y Phase 4 estén completas (T025-T027 usan los mismos archivos que tareas previas)

### Parallel Opportunities

- T005, T006, T007 (Foundational) en paralelo entre sí y con T004
- T008-T019 (US1) en paralelo entre sí — 12 archivos distintos
- T022, T023 (US2) en paralelo entre sí — archivos distintos entre ellas, aunque cada una comparte archivo con una tarea de US1 (T009, T010 respectivamente)

### Nota sobre solapamiento de archivos entre US1 y US2

`QuoteTopics.tsx`, `Languages.tsx` y `QuoteTime.tsx` reciben tareas de ambas historias (T011/T021/T024, T009/T022, T010/T023). Aunque `spec.md` las define como historias independientemente testeables, en la implementación real conviene aplicar primero la tarea de US1 sobre ese archivo y luego la de US2, para minimizar conflictos de edición — no es una dependencia de negocio, es una secuencia operativa recomendada.

---

## Parallel Example: Tras completar Foundational (Phase 2)

```bash
# Migraciones de US1, todas en archivos distintos:
# T008 Gender.tsx | T009 Languages.tsx | T010 QuoteTime.tsx | T011 QuoteTopics.tsx
# T012 UserName.tsx | T013 Home.tsx | T014 Settings.tsx | T015 LoadingScreen.tsx
# T016 CardsContainer.tsx | T017 Greetings.tsx | T018 CardPhrase.tsx | T019 Welcome.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 solamente)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO — bloquea US1)
3. Completar Phase 3: User Story 1 (T008-T019)
4. **DETENER Y VALIDAR**: `npm run lint`/`build`/`test.unit` + quickstart.md secciones 2-5
5. Esto ya constituye el valor central de la spec: duplicación cross-file eliminada

### Incremental Delivery

1. Setup + Foundational → artefactos compartidos listos
2. User Story 1 → duplicación resuelta (MVP)
3. User Story 2 → tipado endurecido (`any` a 0, `Topic` explícito, `backTo` consistente)
4. Polish → hallazgos opcionales (A5/A6/B7) si hay margen, más validación final y documentación de hallazgos

### Parallel Team Strategy

Con más de una persona disponible:

1. Completar Setup + Foundational en conjunto (evita conflictos en los 4 archivos nuevos de Phase 2)
2. Una vez Foundational esté listo:
   - Persona A: T008-T013 (mitad de US1)
   - Persona B: T014-T019 (otra mitad de US1)
   - Persona C: T020, T022, T023 (parte de US2 sin solapamiento de archivo con A/B)
3. T021/T024 (mismo archivo que T011) se aplican después de que esa tarea de US1 esté lista

---

## Notes

- No hay tareas de tipo [P] dentro de Foundational para T004 porque depende de T003 (mismo dato `LanguageKeys`); T005-T007 sí son [P] entre sí y con T004 (archivos distintos)
- [Story] etiqueta cada tarea con la user story a la que pertenece, para trazabilidad con spec.md
- A5, A6 y B7 (Phase 5) son explícitamente opcionales según research.md — no bloquean el cierre de la spec si no se llega a ellos
- Ningún caso de `any` justificado fue encontrado en la investigación (research.md, sección final) — por eso no hay tarea de "documentar any justificado"
