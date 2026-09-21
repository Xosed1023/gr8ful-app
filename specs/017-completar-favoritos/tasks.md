---
description: "Task list template for feature implementation"
---

# Tasks: Completar Favoritos

**Input**: Design documents from `/specs/017-completar-favoritos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No se solicitaron tests automatizados nuevos (no hay suite de componentes hoy); la validación es mediante `npm run lint`/`build`/`test.unit` y el recorrido manual completo de `quickstart.md`.

**Organization**: Tareas agrupadas por user story. Fase 2 (Foundational) corrige el bug de `getFavoritePhrases` — bloquea a User Story 2 (sin él, la lista de Favoritos estaría siempre vacía), pero no a User Story 1 (marcar/desmarcar desde Home no depende de listar).

## Format: `[ID] [P?] [Story] Description`

## Path Conventions

Proyecto único (mobile-app Ionic + Capacitor + React). Paths relativos a la raíz del repo.

---

## Phase 1: Setup

- [X] T001 Verificar que `git status` está limpio antes de empezar
- [X] T002 [P] Capturar baseline: `npm run lint`, `npm run build`, `npm run test.unit` — confirmado: lint 0 errores, build 0 errores, test.unit 1 passed (mismo error preexistente no relacionado de sesiones anteriores)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Corregir el bug de tipo que bloquea a User Story 2

**⚠️ CRITICAL**: User Story 2 no puede validarse hasta que esta fase esté completa (User Story 1 sí puede avanzar en paralelo, no depende de esto)

- [X] T003 En `src/persistence/IndexedDBService.ts`, corregir `getFavoritePhrases()` — research.md Decisión 1, spec.md FR-004. **Implementación distinta a la planeada originalmente**: no se pudo simplemente cambiar `"true"` por `true` en `getAllFromIndex` porque TypeScript rechaza `boolean` como tipo de clave de IndexedDB (no es un `IDBValidKey` válido según el spec). Se reemplazó por `db.getAll(STORE_NAME)` + `.filter(phrase => phrase.isFavorite === true)` en memoria — ver T010, Hallazgo 1.

**Checkpoint**: `getFavoritePhrases()` ya devuelve resultados reales — User Story 2 puede validarse

---

## Phase 3: User Story 1 - Marcar y desmarcar desde Home (Priority: P1) 🎯 MVP

**Goal**: El botón de bookmark en la tarjeta de Home queda funcional, persiste el cambio, y no interfiere con el gesto de expandir/colapsar.

**Independent Test**: Tocar el bookmark en Home, ver el ícono cambiar de estado, cerrar y reabrir la app, confirmar que persiste — sin depender de que exista la pantalla de Favoritos.

### Implementation for User Story 1

- [X] T004 [US1] En `src/components/home/CardPhrase.tsx`: agregar `isFavorite: boolean` y `onToggleFavorite: () => void` a `CardPhraseProps`; descomentar el `IonButton` de bookmark; cablear su `onClick` a `(e) => { e.stopPropagation(); onToggleFavorite(); }`; usar `icon={isFavorite ? bookmark : bookmarkOutline}` de `ionicons` — data-model.md "CardPhraseProps", spec.md FR-001, FR-002, FR-010
- [X] T005 [US1] En `src/components/home/CardsContainer.tsx`: agregar `useState<boolean>` inicializado en `phrase.isFavorite`; agregar `useIonViewWillEnter` que relee `getPhraseById(phrase.id)` y actualiza el estado; agregar `handleToggleFavorite` que actualiza el estado de forma optimista y llama a `toggleFavorite(phrase.id, next)`; pasar `isFavorite`/`onToggleFavorite={handleToggleFavorite}` a las 3 instancias de `CardPhrase` — data-model.md "CardsContainer", research.md Decisión 2 y 3, spec.md FR-001, FR-002, FR-003, FR-009

**Checkpoint**: User Story 1 completa — seguir quickstart.md secciones 2-3

---

## Phase 4: User Story 2 - Ver y gestionar la lista de Favoritos (Priority: P2)

**Goal**: Nuevo tab "Favoritos" que lista las frases marcadas, con estado vacío, desmarcado in-place, y respeta el idioma seleccionado.

**Independent Test**: Con Foundational (T003) y al menos una frase marcada (User Story 1), abrir el tab Favoritos y confirmar que aparece; desmarcarla desde ahí y confirmar que desaparece al instante.

### Implementation for User Story 2

- [X] T006 [US2] Crear `src/pages/Favorites.tsx`: usa `useAppLanguage()` para el idioma, `useEffect` + `useIonViewWillEnter` para cargar `getFavoritePhrases()` al montar y al revisitar el tab, `IonList`/`IonItem` por cada frase (contenido en `phrase.content[userLanguage]`), ícono `bookmark` por ítem con `onClick` que llama `toggleFavorite(phrase.id, false)` y remueve el ítem del estado local de inmediato, y un estado vacío centrado cuando la lista está vacía — data-model.md "Favorites.tsx", research.md Decisión 3 y 4, spec.md FR-005, FR-006, FR-007, FR-008
- [X] T007 [US2] En `src/pages/MainHome.tsx`: importar `Favorites` y el ícono `bookmark`; agregar `<Route exact path="/tabs/favorites" component={Favorites} />` dentro del `IonRouterOutlet`; agregar `<IonTabButton tab="favorites" href="/tabs/favorites">` entre los tabs de Home y Ajustes — data-model.md "Ruta y navegación nuevas", spec.md FR-005 (no toca el `onClick` existente del tab Home, fuera de alcance según research.md)

**Checkpoint**: User Stories 1 y 2 completas — seguir quickstart.md secciones 4-6

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T008 Ejecutar `npm run lint`, `npm run build`, `npm run test.unit` sobre el estado final y confirmar 0 errores — SC de spec.md — confirmado: lint 0 errores, build 0 errores (tras el ajuste de T003/Hallazgo 1), test.unit 1 passed (mismo error preexistente no relacionado)
- [X] T009 Verificación manual completa según quickstart.md secciones 2-6 (fix del bug, marcar/desmarcar desde Home, lista de Favoritos, consistencia Home↔Favoritos, edge cases) — Verificado en iPhone físico del usuario, incluyendo el fix del Hallazgo 2 (navegación al tab Home sin anuncio desde otros tabs, y anuncio+refresh al tocar Home estando ya ahí). Confirmado por el usuario ("ahora sí funciona bien").
- [X] T010 Hallazgos de Calidad encontrados durante la implementación (no previstos en `research.md`):
  - **Hallazgo 1 — `boolean` no es un tipo de clave válido en IndexedDB**: `research.md` (Decisión 1) asumió que el fix del bug era simplemente cambiar el string `"true"` por el booleano `true` en `getAllFromIndex`. Al implementar, TypeScript rechazó ese cambio (`error TS2345: Argument of type 'true' is not assignable to parameter of type 'IDBKeyRange | IDBValidKey | null | undefined'`) porque el spec de IndexedDB no admite `boolean` como tipo de clave (solo `number`, `string`, `Date`, binarios, o arrays de esos). Esto significa que el índice `isFavorite` creado en `initDB()` nunca pudo indexar ningún registro, sin importar qué valor se le consultara — el bug real era más profundo que un simple error de tipo string-vs-boolean. **Resolución**: se reemplazó la consulta por índice por `db.getAll(STORE_NAME)` + `.filter(phrase => phrase.isFavorite === true)` en memoria — exactamente el mismo patrón que el propio código ya usaba para el campo `hasShown` (también booleano, también con un índice sin usar) dentro de `getRandomPhrase()`. `research.md` y `data-model.md` quedaron actualizados con esta corrección.
  - **Nota, no un hallazgo bloqueante**: el índice `isFavorite` (y también `hasShown`) sigue creado en `initDB()` aunque nunca se use para consultar — se dejó intacto para no tocar el schema de la base de datos existente (fuera de alcance de esta spec); queda como candidato de limpieza futura si se quiere, junto con `specs/014-completar-limpieza-codigo-muerto`.
  - **Hallazgo 2 — corrección adicional solicitada por el usuario tras probar en dispositivo (no forma parte del alcance original de esta spec, pero se resolvió aquí por tocar el mismo archivo/área)**: el `IonTabButton` de Home en `MainHome.tsx` disparaba `loadRandomPhraseWithAd()` (anuncio rewarded + frase nueva) en **cada** tap, incluso al navegar desde Favoritos o Ajustes — comportamiento documentado como preexistente y fuera de alcance en `research.md` (nota final) y `quickstart.md` (sección 5). El usuario pidió corregirlo explícitamente: el anuncio/refresh solo debe dispararse si el usuario ya está en Home (tocar de nuevo el tab estando ahí); si viene de otro tab, debe ser navegación normal, sin anuncio, con el ícono del tab reflejando cuál acción va a ocurrir (`home` = navegación, `sync` = refrescar frase). **Resolución (dos intentos)**: el primer intento usó `useLocation()` de `react-router` para determinar `isOnHomeTab` según la ruta actual — compilaba y pasaba lint/build, pero el usuario reportó en dispositivo que tocar Home estando ya en Home no hacía nada visible. Causa probable: `MainHome` monta su propio `<IonReactRouter>` anidado dentro del router principal de `App.tsx`, y leer la ubicación desde ese contexto anidado no reflejaba de forma confiable el tap real del usuario. **Se reemplazó por un estado local (`selectedTab`) actualizado directamente en el `onClick` de cada uno de los 3 `IonTabButton`** (Home/Favoritos/Ajustes), sin depender de ningún router — el `onClick` de Home dispara `loadRandomPhraseWithAd()` solo si `selectedTab` ya era `"home"` antes de ese tap, y el ícono (`home`/`sync`) se deriva del mismo estado. De paso se eliminó código muerto relacionado (`activeTab`, `handleTabChange`, `homeRefreshTrigger`) que intentaba resolver este mismo problema pero nunca estaba conectado a `IonTabs`. Es un cambio de comportamiento de disparo de AdMob (Principio IV de la constitución) — autorizado explícitamente por el usuario en la conversación, no una decisión unilateral. **Confirmado funcionando en dispositivo** (ver T009).

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: Sin dependencias
- **Foundational (Phase 2)**: Depende de Setup — bloquea solo a User Story 2
- **User Story 1 (Phase 3)**: Depende de Setup, no de Foundational — puede avanzar en paralelo a Phase 2. T005 depende de T004 (mismo cambio de contrato de props)
- **User Story 2 (Phase 4)**: Depende de Foundational (T003) completo. T007 depende de T006 (importa el componente que crea)
- **Polish (Phase 5)**: Depende de que Phase 3 y Phase 4 estén completas

### Parallel Opportunities

- T002 (Setup) es de solo lectura
- Foundational (T003) puede correr en paralelo con toda la Phase 3 (User Story 1), ya que no comparten archivo
- T004 y T005 son secuenciales (mismo contrato de props, distinto archivo pero uno depende del otro)

---

## Implementation Strategy

### MVP First (User Story 1 solamente)

1. Setup
2. Foundational (en paralelo si se quiere, no bloquea a US1)
3. User Story 1 (T004-T005) — el usuario ya puede marcar/desmarcar favoritos y que persistan, aunque no tenga dónde verlos listados todavía
4. **DETENER Y VALIDAR**: quickstart.md secciones 2-3

### Incremental Delivery

1. Setup + Foundational → bug corregido
2. User Story 1 → marcar/desmarcar funcional (MVP)
3. User Story 2 → pantalla de Favoritos completa
4. Polish → validación final y documentación

---

## Notes

- No hay tareas de tipo [P] entre T004/T005 ni entre T006/T007 porque cada par tiene una dependencia real de contrato (props nuevas / componente nuevo importado)
- El TODO preexistente en `MainHome.tsx` sobre el `onClick` del tab Home (dispara rewarded ad + frase nueva en cada tap) se deja intacto — documentado en research.md y quickstart.md, no es parte de esta spec
