---
description: "Task list: widget de la frase del día (iOS)"
---

# Tasks: Widget de la Frase del Día

## Phase 1 — Datos en la app (web)
- [X] T001 Confirmado que `@capacitor/preferences` no sirve (su «grupo» es un prefijo en `UserDefaults.standard`); se usa un plugin local `WidgetBridge`
- [X] T002 `src/daily/dailyPlan.ts`: `buildPlan` (puro, temas + no vistas primero), `dateKey`, validación (temas iguales, ≥ 14 días restantes), `getDailyPlan` con persistencia y conservación de la frase de hoy
- [X] T003 [P] `src/daily/dailyPlan.test.ts`
- [X] T004 `src/notifications/dailyQuote.ts`: `buildSchedule` modo `preordered`; `scheduleWindow` usa el plan
- [X] T005 [P] Tests de `preordered` en `dailyQuote.test.ts`; los existentes siguen pasando
- [X] T006 `src/widget/widgetData.ts`: `buildWidgetPayload` (puro) y `writeWidgetData` (llama al plugin `WidgetBridge`, solo iOS)
- [X] T007 [P] `src/widget/widgetData.test.ts`
- [X] T008 `src/daily/refreshDailyContent.ts` y conectar: arranque (`App.tsx`), idioma, temas, hora y fin del onboarding (`UserName.tsx`)

## Phase 2 — Extensión iOS
- [X] T009a `ios/App/App/WidgetBridgePlugin.swift` + `MainViewController.swift` (registro del plugin) y referencia en `Main.storyboard`
- [X] T009 `ios/App/Gr8fulWidget/`: `Gr8fulWidget.swift` (lectura del grupo, línea de tiempo por días, vista pequeña por género × esquema, estado vacío ES/EN/FR), `Info.plist`, `Gr8fulWidget.entitlements`
- [X] T010 `ios/App/App/App.entitlements` con el App Group y enlazarlo en el target `App`
- [X] T011 Script con `xcodeproj`: target `Gr8fulWidget` (bundle `com.zen.gr8ful.widget`), frameworks WidgetKit y SwiftUI, dependencia y embebido en `App`, ajustes de firma
- [X] T012 Compilar con `xcodebuild` para el simulador (app + extensión) sin errores
- [X] T013 `npx cap sync ios` y comprobar `Podfile.lock`

## Phase 3 — Cierre
- [X] T014 `npm run lint && npm run build && npm run test.unit` — 0 errores nuevos
- [X] T015 En el iPhone: compilar con tu equipo, añadir el widget, verificar quickstart.md
- [X] T016 Cerrar: `Status` de `spec.md`; quitar la entrada del `BACKLOG.md` y anotar Android como fase 2

## Dependencies
T001 → T002 → T003/T004 → T005; T002 → T006 → T007; T006 + T004 → T008; T009 + T010 → T011 → T012 → T013 → T014 → T015 → T016
