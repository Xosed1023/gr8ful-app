---
description: "Task list: widget de la frase del día (Android)"
---

# Tasks: Widget de la Frase del Día en Android

## Phase 1 — Nativo
- [X] T001 `WidgetData.java` y `WidgetPalette.java` (lectura del payload v1, entrada de hoy, paleta género × esquema)
- [X] T002 Recursos: `widget_quote.xml`, `ic_widget_infinity.xml`, `quote_widget_info.xml`, textos ES/EN/FR
- [X] T003 `QuoteWidgetProvider.java` (RemoteViews, fondo en bitmap, alarma de medianoche, toque → app)
- [X] T004 `WidgetBridgePlugin.java` + registro en `MainActivity` + receiver en `AndroidManifest.xml`

## Phase 2 — Web
- [X] T005 `writeWidgetData` también en Android; test

## Phase 3 — Verificación
- [X] T006 `./gradlew assembleDebug` sin errores
- [X] T007 `tsc`, `lint`, `vitest`, `build`, `cap sync android`
- [X] T008 probar en el teléfono según `quickstart.md`
- [X] T009 Cerrar: `Status`, `BACKLOG.md` y nota en la spec 024
