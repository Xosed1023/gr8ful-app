# Implementation Plan: Actualización de Dependencias y Calidad del Código

**Branch**: `develop` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/015-actualizar-dependencias-calidad/spec.md`

## Summary

Actualizar todas las dependencias de producción y desarrollo del proyecto a su versión menor/parche más reciente dentro de su versión mayor actual (lo que `npm outdated` reporta como "Wanted"), sin cruzar ningún salto de versión mayor declarado en `package.json`. La actualización se valida con la cadena de comandos ya existente en el proyecto (`npm run lint`, `npm run build`, `npm run test.unit`, `npm run dev`) más `npx cap sync` para confirmar que el proyecto nativo (Android/iOS) sigue sincronizando, y una verificación manual de las funciones core (mostrar frase, favoritos, cambio de idioma EN/ES/FR) y del comportamiento visible de AdMob. No se introduce arquitectura nueva ni saltos de versión mayor declarados — es trabajo de mantenimiento de bajo riesgo, aunque en la ejecución real fue necesario tocar algunos archivos más allá de `package.json` para preservar el comportamiento funcional existente (ver Project Structure y research.md).

## Technical Context

**Language/Version**: TypeScript ~5.1 (actual, sin cambio de mayor) sobre Node/npm

**Primary Dependencies**: `@ionic/react` 8.x, `@ionic/react-router` 8.x, `@capacitor/*` 7.x (core, android, ios, app, clipboard, haptics, keyboard, push-notifications, status-bar), `@capacitor-community/admob` 5.x, `react` / `react-dom` 18.x, `react-router` / `react-router-dom` 5.x, `idb` 8.x — todas permanecen en su versión mayor actual, solo se actualiza dentro de su rango menor/parche

**Storage**: IndexedDB (vía `idb`) y `localStorage` — sin cambios; principio Local-First no se ve afectado por esta feature

**Testing**: `vitest` (unit, vía `npm run test.unit`), `cypress` (e2e, fuera de alcance según Assumptions de la spec)

**Target Platform**: Navegador de desarrollo (`npm run dev`) para verificación funcional, más `npx cap sync` como verificación liviana del proyecto nativo Android/iOS (sin build/ejecución completa en Android Studio/Xcode — decisión de clarificación)

**Project Type**: Mobile-app (Ionic + Capacitor + React), sin backend propio

**Performance Goals**: N/A — esta feature no introduce ni modifica rutas de performance; el único requisito es no degradar el comportamiento existente

**Constraints**: Ningún salto de versión mayor declarado en `package.json`; sin cambios de comportamiento visible en anuncios AdMob (frecuencia/ubicación/disparo) como efecto secundario (Principio IV); no se exige `npm audit` limpio (decisión de clarificación, fuera de alcance). El deployment target mínimo de iOS quedó en 17.0 (antes 14.0) como consecuencia de mantener sincronizados los Pods nativos tras la actualización — ver research.md.

**Scale/Scope**: Todo `package.json` (dependencies + devDependencies) — actualmente ~19 dependencias de producción y ~19 de desarrollo, de las cuales varias ya están en su versión "Wanted" (sin cambio necesario) y el resto requiere un bump menor/parche

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Local-First / Sin Backend | No se introduce backend, API remota, ni nuevo mecanismo de almacenamiento. Persistencia sigue usando IndexedDB/`localStorage` sin cambios. | PASS |
| II. Trilingüe Obligatorio (ES/EN/FR) | No se agrega ni modifica contenido/texto de interfaz; la verificación manual confirma explícitamente que el cambio de idioma sigue funcionando en los 3 idiomas. | PASS |
| III. Mobile-First vía Capacitor | Cubierto por FR-010/SC-006: `npx cap sync` debe terminar sin errores tras actualizar los plugins nativos de Capacitor y AdMob, además de la verificación en navegador. | PASS |
| IV. Monetización AdMob como Restricción de Diseño | FR-009 exige evitar cambios de comportamiento visible de anuncios como efecto secundario, o decisión explícita si es inevitable; edge case dedicado a verificar el flujo de anuncios manualmente. | PASS |
| V. Reutilizar Antes de Duplicar | No se crea ningún patrón, modelo, hook ni servicio nuevo; es actualización de versiones dentro de la estructura existente. | PASS |

No hay violaciones. No se requiere `Complexity Tracking`.

## Project Structure

### Documentation (this feature)

```text
specs/015-actualizar-dependencias-calidad/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

No se genera `contracts/`: esta feature no expone ni modifica ninguna interfaz externa (API, CLI, esquema) — es una actualización de dependencias internas del proyecto, validada mediante los scripts npm ya existentes.

### Source Code (repository root)

```text
gr8ful-app/
├── package.json             # Versiones actualizadas (dependencies/devDependencies) + eslint fijado explícitamente (ver research.md)
├── package-lock.json        # Regenerado automáticamente al correr npm update/install
├── src/
│   ├── components/          # Sin cambios estructurales; solo debe seguir compilando/lint limpio
│   ├── hooks/
│   ├── pages/
│   │   └── MainHome.tsx      # Ajustado: fix de configuración de AdMob (IDs de test, isTesting por plataforma) — hallazgo real durante la verificación, no una migración de dependencias en sí
│   ├── persistence/
│   ├── models/
│   ├── mapper/
│   └── theme/
├── android/                  # Verificado con `npx cap sync android`, sin cambios de archivo más allá de los que genera el propio sync
└── ios/
    ├── App/Podfile            # Ajustado: pin de una dependencia transitiva de CocoaPods + deployment target — hallazgo real al sincronizar nativo (ver research.md)
    └── App/App.xcodeproj/...  # Deployment target actualizado en línea con el Podfile

# cypress/ queda fuera de alcance (test.e2e no forma parte de esta spec)
```

**Structure Decision**: Proyecto mobile-app único (Ionic + Capacitor + React) ya existente; esta feature no reestructura carpetas ni agrega módulos nuevos. El codebase funcional actual es el punto de partida: la actualización de dependencias es el objetivo principal, pero preservar ese comportamiento funcional (Constitution Check) exigió, en la práctica, dos ajustes puntuales de bajo alcance — `ios/App/Podfile` (nativo) y `src/pages/MainHome.tsx` (config de AdMob) — documentados como hallazgos reales en `research.md` y `tasks.md` (T015, T016), no como trabajo planeado de antemano.

## Complexity Tracking

No aplica — no hay violaciones de la Constitution Check que justificar.
