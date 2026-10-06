# Implementation Plan: Widget de la Frase del Día

**Branch**: `develop` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

## Summary

Tres piezas: (1) un **plan diario único** en la app web (`src/daily/dailyPlan.ts`): ~30 días, una frase por día, estable entre aperturas y compartido por las notificaciones y el widget; (2) un **escritor de datos del widget** (`src/widget/`) que resuelve el plan a frase + autor en el idioma de la app y lo entrega a un **plugin nativo propio** (`WidgetBridge`) que lo guarda en el contenedor compartido del App Group y pide al sistema recargar el widget; (3) una **extensión de widget en Swift/WidgetKit** (`ios/App/Gr8fulWidget/`) que lee esos datos, construye una entrada por día (cambia a medianoche) y dibuja el widget pequeño.

## Technical Context

**Language/Version**: TypeScript ~5.1 (web); Swift 5 / SwiftUI / WidgetKit (iOS 17.6+, el mínimo del proyecto)

**Primary Dependencies**: ninguna dependencia npm nueva. Se descartó `@capacitor/preferences`: su «grupo» es solo un prefijo de clave en `UserDefaults.standard`, no un App Group, y el widget no puede leerlo. Plugin local `WidgetBridge` (Swift) + frameworks del sistema (WidgetKit, SwiftUI).

**Storage**: plan en `localStorage` (`dailyPlan`); contenido del widget en `UserDefaults(suiteName: "group.com.zen.gr8ful.shared")`, clave `widgetData` (JSON v1).

**Testing**: `vitest` para el plan (puro) y el armado del contenido; compilación de la extensión con `xcodebuild` en simulador; verificación del widget en el iPhone (la galería de widgets no se puede automatizar).

**Constraints**:
- El widget no tiene la app en ejecución: solo lee datos ya escritos → ventana de ~30 días.
- App Groups requieren registrar el grupo en el portal de Apple (Xcode con firma automática lo hace al compilar con el equipo).
- Las notificaciones deben seguir como hoy salvo que usan el plan (SC-006).

**Scale/Scope**: módulos nuevos `src/daily/`, `src/widget/`; cambios en `dailyQuote.ts`, `App.tsx`, `Languages.tsx`, `QuoteTopics.tsx`, `QuoteTime.tsx`, `UserName.tsx`; extensión iOS nueva (target, Swift, Info.plist, entitlements) y entitlements de la app.

## Constitution Check

| Principio | Evaluación | Estado |
|---|---|---|
| I. Local-First / Sin Backend | Todo queda en el dispositivo; el grupo de la app es compartición local. | PASS |
| II. Trilingüe Obligatorio | Frase en el idioma de la app; mensaje vacío en ES/EN/FR; nombre del widget según el dispositivo. | PASS |
| III. Mobile-First vía Capacitor | Extensión nativa + plugin Capacitor; verificación en iPhone. | PASS |
| IV. Monetización AdMob | Sin cambios. | PASS |
| V. Reutilizar Antes de Duplicar | La selección de frases (temas, no vistas primero) se reutiliza del módulo de notificaciones, ahora compartida en un plan único; la dependencia nueva está justificada (no hay otra forma de compartir datos con la extensión). | PASS |

## Decisiones

1. **Plan diario único y estable** (FR-005). Hoy las notificaciones reordenan al azar en cada apertura. El plan guarda ids de frase por fecha (`YYYY-MM-DD` local) y se reutiliza mientras los temas no cambien y queden ≥ 14 días; cambiar el idioma no lo invalida (los ids no dependen del idioma). Al regenerar se conserva la frase de hoy.
2. **Notificaciones leen del plan.** `buildSchedule` gana el modo `preordered`: recibe las frases ya ordenadas por fecha y respeta ese orden (el índice del día se compensa si la hora de hoy ya pasó). Los tests actuales siguen valiendo.
3. **Datos del widget con el esquema `v1`** (resueltos en la app, el widget no necesita la base de datos): `{ v, language, gender, updatedAt, days: [{ date, quote, author }] }`.
4. **Plugin local `WidgetBridge`** (`setData({ json })`): escribe en el contenedor del App Group y llama a `WidgetCenter.reloadAllTimelines()`, de modo que los cambios llegan al widget al instante y no cuando el sistema decida. Se registra en un `MainViewController` propio (`capacitorDidLoad`). En Android y web la llamada se ignora.
5. **Una entrada de línea de tiempo por día**, a las 00:00 locales, con política `.atEnd`: cambia a medianoche aunque la app esté cerrada. Pasado el último día conserva el último contenido.
6. **Aspecto**: fondo con manchas (degradados radiales) por género × esquema del sistema; texto con `minimumScaleFactor`; ∞ (SF Symbol) como marca; tipografía del sistema. Los colores reflejan `variables.css`.
7. **Crear el target por script** (gema `xcodeproj` de CocoaPods) en vez de a mano en Xcode; se verifica compilando para el simulador. Los entitlements del grupo se añaden a la app y a la extensión.
8. **Refresco**: la app escribe los datos al abrirse, al terminar el onboarding y al cambiar idioma/temas, y cada escritura recarga el widget (FR-010).

## Archivos

```text
src/daily/dailyPlan.ts (+ .test.ts)       # plan único: construir, validar, guardar
src/widget/widgetData.ts (+ .test.ts)     # plan → payload v1; llamada al plugin
ios/App/App/WidgetBridgePlugin.swift      # plugin local: escribe en el App Group y recarga
ios/App/App/MainViewController.swift      # registra el plugin local
src/notifications/dailyQuote.ts           # usa el plan (preordered)
src/App.tsx, Languages.tsx, QuoteTopics.tsx, QuoteTime.tsx, UserName.tsx  # refrescar contenido
ios/App/Gr8fulWidget/                     # Gr8fulWidget.swift, Info.plist, Gr8fulWidget.entitlements
ios/App/App/App.entitlements              # App Group
ios/App/App.xcodeproj                     # target del widget, dependencia y embebido
```
