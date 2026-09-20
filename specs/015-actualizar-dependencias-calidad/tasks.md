---
description: "Task list template for feature implementation"
---

# Tasks: Actualización de Dependencias y Calidad del Código

**Input**: Design documents from `/specs/015-actualizar-dependencias-calidad/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No se solicitaron tests automatizados nuevos para esta feature (no aplica TDD); la validación es mediante los scripts npm existentes y verificación manual, como define la spec.

**Organization**: Tareas agrupadas por user story para permitir validación independiente de cada una. Esta feature no crea archivos de código nuevos — todas las tareas son comandos a ejecutar sobre el repo y verificaciones de su resultado, con `package.json`/`package-lock.json` como únicos artefactos que cambian de contenido.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo con otras tareas (no modifica el mismo estado / es de solo lectura)
- **[Story]**: A qué user story pertenece la tarea (US1, US2)
- Se incluye el comando exacto y, cuando aplica, el archivo afectado

## Path Conventions

Proyecto único (mobile-app Ionic + Capacitor + React). Comandos ejecutados desde la raíz del repo (`/Users/zen/Documents/projects/zen/projects/gr8ful-app`). Los únicos archivos que cambian de contenido son `package.json` y `package-lock.json`; `android/` e `ios/` se verifican indirectamente vía `npx cap sync`.

---

## Phase 1: Setup

**Purpose**: Establecer un punto de comparación antes de tocar nada

- [X] T001 Verificar que `git status` está limpio en la raíz del repo antes de empezar (para poder revertir fácilmente si algo falla)
- [X] T002 [P] Capturar el baseline ejecutando `npm outdated`, `npm run lint`, `npm run build` y `npm run test.unit`; guardar la salida de cada comando para comparar después de la actualización (quickstart.md, paso 1)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Aplicar la actualización de dependencias en sí — bloquea toda verificación posterior (US1 y US2)

**⚠️ CRITICAL**: Ninguna tarea de US1 o US2 puede empezar hasta que esta fase esté completa

- [X] T003 Ejecutar `npm update && npm install` en la raíz del repo para actualizar cada dependencia de `package.json` (`dependencies` y `devDependencies`) a su versión "Wanted" dentro de la misma versión mayor actual — research.md Decisión 1, FR-001 (package.json, package-lock.json)
- [X] T004 Ejecutar `npm outdated` y confirmar que "Current" == "Wanted" para todas las filas restantes y que ninguna dependencia cruzó a una nueva versión mayor respecto al baseline de T002 — FR-002, SC-001

**Checkpoint**: Dependencias actualizadas dentro de su rango menor/parche — las verificaciones de US1 y US2 pueden empezar

---

## Phase 3: User Story 1 - Dependencias actualizadas sin romper el comportamiento (Priority: P1) 🎯 MVP

**Goal**: Confirmar que, tras el bump de dependencias, la app sigue funcionando igual que antes (pruebas unitarias, arranque, funciones core, proyecto nativo y anuncios).

**Independent Test**: Con el repo en el estado post-actualización (Fase 2 completa), ejecutar `npm run test.unit`, `npm run dev` + recorrido manual, y `npx cap sync`; todos deben pasar sin regresiones respecto al comportamiento anterior a T003.

### Implementation for User Story 1

- [X] T005 [P] [US1] Ejecutar `npm run test.unit` y confirmar que el 100% de las pruebas pasa (ninguna que pasaba antes de T003 puede fallar ahora) — FR-005, SC-004
- [X] T006 [US1] Ejecutar `npm run dev` y verificar que la app arranca sin errores en el navegador — FR-006, SC-005
- [X] T007 [US1] Con la app corriendo (T006), verificar manualmente las funciones core: se muestra una frase, se puede marcar/ver una frase como favorita, y se puede cambiar el idioma entre EN, ES y FR con el contenido actualizándose acorde — FR-007, SC-005 — Confirmado por el usuario ("Todo corre bien"), sin regresiones respecto al comportamiento anterior a la actualización.
- [X] T008 [P] [US1] Ejecutar `npx cap sync` y confirmar que termina sin errores (sincroniza correctamente `android/` e `ios/` con los plugins nativos de Capacitor/AdMob actualizados) — FR-010, SC-006 — Nota: `npx cap sync android` OK. `npx cap sync ios` inicialmente no se pudo verificar (CocoaPods no instalado); una vez instalado, reveló un Hallazgo de Calidad real en la resolución de dependencias nativas — ver T015.
- [X] T009 [US1] Con la app corriendo (T006), verificar manualmente que el comportamiento de los anuncios AdMob (frecuencia de intersticiales ~45s, disparo de rewarded ads, ubicación) no cambió respecto al comportamiento anterior a la actualización — FR-009 — Verificado en iPhone físico del usuario. Reveló un bug **preexistente** (no causado por esta actualización de dependencias, ver T016): ni el intersticial ni el rewarded mostraban anuncios. Corregido y confirmado por el usuario ("Funcionan") — ver T016 para la causa raíz y el fix aplicado.

**Checkpoint**: User Story 1 completa y verificable de forma independiente — la app funciona igual que antes de actualizar

---

## Phase 4: User Story 2 - El código pasa los controles de calidad sin errores (Priority: P2)

**Goal**: Confirmar que el proyecto compila y pasa el linter sin errores tras la actualización de dependencias.

**Independent Test**: Con el repo en el estado post-actualización (Fase 2 completa), ejecutar `npm run lint` y `npm run build`; ambos deben terminar en 0 errores, independientemente del resultado de la Fase 3.

### Implementation for User Story 2

- [X] T010 [P] [US2] Ejecutar `npm run lint` sobre el código en `src/` tras la actualización y confirmar 0 errores — FR-003, SC-002
- [X] T011 [P] [US2] Ejecutar `npm run build` (incluye `tsc`) tras la actualización y confirmar que termina con 0 errores — FR-004, SC-003

**Checkpoint**: User Stories 1 y 2 completas — dependencias al día, comportamiento preservado, y código limpio

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Manejo de fallos puntuales y cierre de la documentación de la actualización

- [X] T012 Si alguna tarea de la Fase 2, 3 o 4 falla de forma atribuible a una dependencia concreta, revertir solo esa dependencia a su versión anterior con `npm install <paquete>@<versión-anterior>` y registrarla como Hallazgo de Calidad con `resolucion: dependencia_revertida`, dejándola documentada como candidata para la spec de saltos mayores — research.md Decisión 3, data-model.md, Edge Cases de spec.md (package.json, package-lock.json) — **Hallazgo real encontrado y resuelto**: `npm update` arrastró `eslint` (dependencia transitiva no declarada en `package.json`, resuelta vía el peerDependency de `eslint-plugin-react`) de 8.57.1 a 9.39.5 — un salto de versión mayor que rompió `npm run lint` porque el proyecto usa configuración legacy `.eslintrc.js` (ESLint 9 requiere `eslint.config.js` por defecto). Se corrigió fijando `eslint` como devDependency explícita en `^8.57.1` (`npm install --save-dev eslint@8.57.1`), quedando `npm run lint` de nuevo en 0 errores. El salto a ESLint 9 (con migración a flat config) queda documentado como candidato para la spec de saltos mayores.
- [ ] T013 [P] Ejecutar `npm run test.e2e` de forma exploratoria si se desea una señal adicional (fuera de alcance obligatorio de esta spec — ver Assumptions de spec.md); documentar el resultado solo como referencia, sin bloquear la finalización de la feature por él — **No ejecutado**: es explícitamente opcional y fuera de alcance obligatorio; se deja a criterio del usuario correrlo antes de mergear
- [X] T014 Confirmar que `package.json`/`package-lock.json` no quedan con cambios a medio aplicar (ninguna dependencia parcialmente actualizada) y ejecutar `git diff package.json` para revisar que ningún número de versión mayor cambió antes de considerar la feature completa — confirmado: único cambio en `package.json` es la nueva línea `"eslint": "^8.57.1"`; ninguna dependencia ya declarada cambió de versión mayor
- [X] T015 Hallazgo de Calidad — mismo patrón que T012 pero del lado nativo iOS, encontrado al ejecutar `npx cap sync ios` / `pod install` real (una vez resuelto el bloqueo de CocoaPods de T008) en `ios/App/Podfile` (research.md Decisión 3, candidato para la spec de saltos mayores):
  - **Síntoma**: build de Xcode fallaba compilando `ConsentExecutor.swift` de `@capacitor-community/admob@5.3.1` (`'UMPConsentStatus' has been renamed to 'ConsentStatus'`), más warnings de `IPHONEOS_DEPLOYMENT_TARGET` (14.0) fuera del rango soportado (15.0–27.0.x) por el Xcode instalado (27.0) en `CapacitorCommunityAdmob`, `CapacitorHaptics` y `CapacitorStatusBar`.
  - **Causa raíz (compilación)**: `admob@5.3.1` no fija versión de su dependencia transitiva `GoogleUserMessagingPlatform` en el `Podfile` generado; CocoaPods resolvió la última (3.1.0), que renombró `UMPConsentStatus` → `ConsentStatus` en su release 3.0.0 (marzo 2025) — API que el código Swift del plugin nunca adoptó.
  - **Causa raíz (deployment target)**: `ios/App/Podfile` fijaba `platform :ios, '14.0'` para todos los Pods, por debajo del mínimo soportado por el SDK de Xcode 27 de esta máquina.
  - **Resolución aplicada** (`ios/App/Podfile`): (1) pin `pod 'GoogleUserMessagingPlatform', '< 3.0'` agregado en la zona `# Add your Pods here` del target `App` — **no** dentro de la función `capacitor_pods`, porque `npx cap sync` regenera ese bloque automáticamente y descarta cualquier pod agregado ahí; (2) `platform :ios, '14.0'` → `'17.0'` (a pedido del usuario, para alinear con el `IPHONEOS_DEPLOYMENT_TARGET` real del target `App`, que ya estaba en 17.6); (3) el hook `assertDeploymentTarget` de Capacitor (`node_modules/@capacitor/ios/scripts/pods_helpers.rb`) solo sube el deployment target de un Pod si queda por debajo de 14.0 — no lo alinea al valor de `platform :ios` — así que se agregó un `post_install` adicional en el `Podfile` que fuerza `IPHONEOS_DEPLOYMENT_TARGET = '17.0'` en todos los targets de `Pods.xcodeproj`. Verificado con `rm ios/App/Podfile.lock && pod install --repo-update` (resuelve a `GoogleUserMessagingPlatform 2.7.0`, que sí expone `UMPConsentStatus`; 0 targets de Pods quedan en 14.0) y confirmado que ambos ajustes sobreviven un `npx cap sync ios` posterior. **Nota operativa**: si Xcode ya tenía el workspace abierto durante el `pod install`, hay que cerrarlo y reabrirlo (`npx cap open ios`) para que recargue el `Pods.xcodeproj` regenerado — de lo contrario sigue mostrando los errores/warnings viejos aunque el disco ya esté corregido.
  - **Candidato para la spec de saltos mayores**: migrar `@capacitor-community/admob` a una versión mayor (5.x → 8.x) probablemente resuelve esto de raíz al traer `ConsentExecutor.swift` actualizado a la API nueva de UMP; en ese momento debería poder quitarse el pin de `GoogleUserMessagingPlatform`.
- [X] T016 Hallazgo de Calidad — **preexistente al alcance de esta spec** (no lo causó la actualización de dependencias; se descubrió al ejecutar la verificación manual de T009 en el iPhone del usuario), en `src/pages/MainHome.tsx`:
  - **Síntoma**: ni el intersticial (cada ~45s) ni el rewarded (al refrescar frase) mostraban ningún anuncio.
  - **Causa raíz**: `AdMob.initialize()` inicializaba el SDK con `initializeForTesting: true` (modo test global), pero `showAdMobInterstitial()` pedía el intersticial con `isTesting: false` y un Ad Unit ID de producción real — combinación inconsistente que impedía el fill. Además, `loadRandomPhraseWithAd()` (rewarded) usaba siempre `VITE_ANDROID_INTERSTICIAL_REWARDED` sin distinguir plataforma (bug en iOS, nunca usaba el ID de iOS ya presente en `.env`), y pasaba `isTesting` como el string `"true"` de `import.meta.env` en vez de un booleano.
  - **Resolución aplicada** (a pedido explícito del usuario — "vamos a trabajar con anuncios de prueba tanto para iOS como para Android"): se reemplazaron los Ad Unit IDs de producción por los IDs de prueba oficiales de Google AdMob (`ca-app-pub-3940256099942544/...`, documentados en developers.google.com/admob/{ios,android}/test-ads), seleccionados por plataforma vía `Capacitor.getPlatform()` tanto para intersticial como para rewarded; `isTesting: true` booleano real en ambos flujos. Se activó logging (`console.log`/`console.error`) en los eventos `Loaded`/`FailedToLoad`/`Rewarded`, antes ausente o comentado, para poder diagnosticar por consola (Console.app / consola de Xcode). Verificado con `npm run lint` y `npm run build` en 0 errores, y confirmado por el usuario en dispositivo físico ("Funcionan").
  - **Pendiente, fuera de alcance de esta spec**: falta implementar el flujo de consentimiento GDPR/UMP (`AdMob.requestConsentInfo`/`showConsentForm`, no implementado hoy) y volver a Ad Unit IDs de producción reales antes de publicar — hoy quedan fijos en modo test. Documentar como candidato en `specs/BACKLOG.md` o una spec de deuda técnica antes de submit a las stores.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias — puede empezar inmediatamente
- **Foundational (Phase 2)**: Depende de que Setup esté completo — BLOQUEA a US1 y US2
- **User Story 1 (Phase 3)** y **User Story 2 (Phase 4)**: Ambas dependen solo de que Foundational (Phase 2) esté completo; no dependen entre sí y pueden ejecutarse en cualquier orden o en paralelo
- **Polish (Phase 5)**: Depende de que Phase 3 y Phase 4 estén completas (o hayan fallado de forma identificada, para poder aplicar T012)

### User Story Dependencies

- **User Story 1 (P1)**: Puede empezar después de Foundational (Phase 2) — sin dependencia de US2
- **User Story 2 (P2)**: Puede empezar después de Foundational (Phase 2) — sin dependencia de US1

Nota práctica: aunque US1 tiene mayor prioridad (P1), en la práctica conviene ejecutar primero T010/T011 (lint/build de US2) antes que T005-T009 (US1), porque son verificaciones más rápidas y baratas que fallan rápido si el update introdujo un error de tipos o de lint — pero ninguna de las dos historias bloquea a la otra formalmente.

### Parallel Opportunities

- T002 (baseline) puede correr en paralelo si se desea capturar cada comando en procesos separados, aunque son de solo lectura y no conflictúan entre sí
- T005 (test.unit) y T008 (cap sync) son de solo lectura sobre el estado post-Fase 2 y pueden correr en paralelo entre sí y en paralelo con T010/T011 (lint/build)
- T010 y T011 (lint, build) pueden correr en paralelo entre sí
- US1 (Phase 3) y US2 (Phase 4) pueden trabajarse en paralelo ya que no comparten archivos ni se bloquean mutuamente

---

## Parallel Example: Tras completar Foundational (Phase 2)

```bash
# Verificaciones de solo lectura que pueden lanzarse juntas tras T003+T004:
npm run test.unit        # T005 [US1]
npx cap sync              # T008 [US1]
npm run lint               # T010 [US2]
npm run build               # T011 [US2]
```

Las verificaciones manuales (T006, T007, T009) requieren la app corriendo (`npm run dev`) y son secuenciales entre sí sobre esa misma instancia del navegador.

---

## Implementation Strategy

### MVP First (User Story 1 solamente)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO — bloquea US1 y US2)
3. Completar Phase 3: User Story 1
4. **DETENER Y VALIDAR**: confirmar que la app sigue funcionando igual que antes (test.unit, dev, funciones core, cap sync, AdMob)
5. Esto ya constituye el valor central de la feature: dependencias al día y sin regresiones de comportamiento

### Incremental Delivery

1. Setup + Foundational → dependencias actualizadas dentro de su rango menor/parche
2. Agregar User Story 1 → validar comportamiento preservado (MVP)
3. Agregar User Story 2 → validar que lint/build quedan en 0 errores
4. Phase 5 (Polish) cierra cualquier dependencia revertida y confirma que no quedan cambios a medio aplicar

### Parallel Team Strategy

Con más de una persona disponible:

1. Completar Setup + Foundational en conjunto (una sola persona aplica `npm update`/`npm install` para evitar conflictos de `package-lock.json`)
2. Una vez Foundational esté listo:
   - Persona A: User Story 1 (comportamiento — test.unit, dev, manual, cap sync, AdMob)
   - Persona B: User Story 2 (calidad — lint, build)
3. Ambas historias se validan de forma independiente y convergen en Phase 5

---

## Notes

- No hay tareas de tipo [P] dentro de Foundational porque T003 y T004 son secuenciales (T004 depende del resultado de T003)
- [Story] etiqueta cada tarea con la user story a la que pertenece, para trazabilidad con spec.md
- No se generaron tareas de modelos/servicios/endpoints porque esta feature no introduce código de aplicación nuevo — es una actualización de dependencias validada por scripts npm existentes
- No se generó carpeta `contracts/` en el plan (no aplica: no hay interfaz externa nueva), por lo que tampoco hay tareas de contract tests
- Revertir cualquier dependencia problemática (T012) en lugar de forzarla o parchear el código para compatibilizar — así lo define research.md Decisión 3
- Detenerse en cualquier checkpoint para validar una historia de forma independiente antes de continuar
