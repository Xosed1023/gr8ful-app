# Implementation Plan: Widget de la Frase del Día en Android

**Spec**: [spec.md](./spec.md)

## Summary

Reutiliza el payload v1 y el plan diario de la spec 024. Se añade el plugin local `WidgetBridge` para Android (guarda el JSON en `SharedPreferences` y redibuja el widget), un `AppWidgetProvider` que pinta un `RemoteViews` con la misma paleta que iOS, y una alarma de medianoche. La web solo amplía `writeWidgetData` a Android.

## Constitution Check

Local-first ✔ · trilingüe ✔ (mensajes ES/EN/FR) · mobile-first ✔ · reutilizar antes de duplicar ✔ (mismo payload y plan).

## Diseño

- **Plugin** `WidgetBridgePlugin.java` (`@CapacitorPlugin(name="WidgetBridge")`, método `setData(json)`); registrado en `MainActivity`. Guarda en `SharedPreferences("gr8ful_widget")` clave `widgetData` y llama a `QuoteWidgetProvider.refreshAll`.
- **Datos** `WidgetData.java`: lee y valida el JSON (v == 1), devuelve la entrada de hoy (o la última) y el idioma/género.
- **Paleta** `WidgetPalette.java`: los mismos colores que `Gr8fulWidget.swift` por género × esquema.
- **Fondo**: un `Bitmap` dibujado en código (base + 3 gradientes radiales + esquinas redondeadas) a la medida del widget, colocado en un `ImageView` detrás del texto.
- **Provider** `QuoteWidgetProvider.java`: `onUpdate`/`onAppWidgetOptionsChanged` pintan el `RemoteViews`; programa una alarma inexacta a las 00:00 que vuelve a pintar (sin permiso de alarmas exactas); `onDisabled` la cancela. `updatePeriodMillis` de 1 h como respaldo.
- **Layout** `widget_quote.xml`: ∞ (vector), frase, autor; sirve también de vista previa en el selector.
- **Tocar**: `PendingIntent` a `MainActivity`.
- **Web**: `writeWidgetData` deja de limitarse a iOS (iOS y Android).

## Estructura

```text
android/app/src/main/java/com/zen/gr8ful/{WidgetBridgePlugin,QuoteWidgetProvider,WidgetData,WidgetPalette}.java
android/app/src/main/res/{layout/widget_quote.xml, xml/quote_widget_info.xml, drawable/ic_widget_infinity.xml, values*/strings.xml}
android/app/src/main/AndroidManifest.xml  (receiver)
```

## Riesgos

- Android no sigue la paleta oscura al instante si el sistema cambia de tema con el widget visible; se corrige en la siguiente actualización.
- Algunos fabricantes retrasan alarmas: la actualización de medianoche puede tardar.
