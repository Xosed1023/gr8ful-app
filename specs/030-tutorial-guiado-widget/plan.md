# Implementation Plan: Tutorial Guiado y Aviso del Widget

**Spec**: [spec.md](./spec.md)

## Summary

Una capa `Tutorial` montada en Home, con un único «foco» que se desplaza suavemente entre elementos reales de las tarjetas (localizados por atributos `data-tutorial`). Un flag global `tutorialActive` desactiva anuncios mientras dura. La guía del widget es un componente reutilizado en el último paso y en Ajustes; Android la complementa con un método nuevo del plugin `WidgetBridge`.

## Constitution Check

Local-first ✔ · trilingüe ✔ (`src/tutorial/tutorialLanguage.ts`) · mobile-first ✔ · reutilizar antes de duplicar ✔ (hápticos globales, tokens de tema, patrón de overlay de ShareSheet/StreakRescue).

## Diseño

- **Estado** `src/tutorial/tutorialState.ts`: `isTutorialDone/markTutorialDone/resetTutorial`, bandera `isTutorialActive/setTutorialActive`, petición de repetición (`requestTutorialReplay/peekReplay/consumeReplay`) y `shouldStartTutorial` (pura).
- **Arranque** `src/tutorial/useTutorialTrigger.ts`: en `ionViewDidEnter` de Home, con un retardo para que las tarjetas terminen de entrar; espera si `blocked` (rescate de racha).
- **Vista** `src/tutorial/Tutorial.tsx` (+css): portal con un «agujero» (box-shadow gigante) que se anima entre el objetivo del paso 1 (franja visible de la tarjeta inglesa) y el del paso 2 (grupo de acciones). Bloqueadores transparentes alrededor (y encima en el paso 2) impiden pulsar otra cosa; en el paso 1 el agujero deja pasar el toque a la tarjeta. Abre/cierra la tarjeta con `.click()` sobre `[data-tutorial="card-en"]` y espera `data-tutorial-settled`.
- **Guía del widget** `src/tutorial/WidgetGuide.tsx`: cuerpo reutilizable (iOS: pasos + ilustración SVG; Android: botón + instrucciones) y modal para Ajustes.
- **Android** `WidgetBridgePlugin.requestPin()`: `AppWidgetManager.requestPinAppWidget`; devuelve `{supported, requested, alreadyAdded}`. TS: `requestWidgetPin()` en `src/widget/widgetData.ts` (no-op fuera de Android).
- **Sin anuncios**: `CardPhrase.tsx` omite `registerAdMoment` y `showCardBanner` si `isTutorialActive()`.
- **Ajustes**: dos filas nuevas («Añadir widget…», solo móvil; «Ver el tutorial de nuevo»).

## Estructura

```text
src/tutorial/{tutorialState,useTutorialTrigger,tutorialLanguage}.ts, Tutorial.tsx/.css, WidgetGuide.tsx/.css
```

## Riesgos

- El foco depende de la geometría de las tarjetas: se recalcula al cambiar el tamaño y se verifica con capturas.
- `requestPinAppWidget` varía por launcher; hay alternativa manual.
