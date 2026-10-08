# Implementation Plan: Estrategia de Anuncios

**Spec**: [spec.md](./spec.md)

## Summary

Lógica pura y testeable (`interstitialPolicy.ts`) con estado persistido; un módulo que precarga y muestra el intersticial sin esperas (`interstitial.ts`); un coordinador (`adMoments.ts`) que recibe los momentos de valor de la UI; el rewarded avisa para abrir su respiro. Se elimina el temporizador de `MainHome.tsx`.

## Constitution Check

Local-first ✔ (todo en el dispositivo) · AdMob como restricción ✔ · reutilizar antes de duplicar ✔ (el intersticial sale de `MainHome` a un módulo; el rewarded ya está en `ads/rewarded.ts`).

## Diseño

- **Política** `src/ads/interstitialPolicy.ts` (pura): `AD_POLICY` (constantes), `parseAdState`, `recordMoment(state, points, now)` → `{ state, due }`, `markShown(state, now)`, `markRewarded(state, now)`, `loadAdState`/`saveAdState`.
- **Intersticial** `src/ads/interstitial.ts`: `initInterstitial()` (listeners Loaded/Failed/Dismissed + precarga) y `showInterstitialIfReady()` (true si se mostró). IDs de prueba como hoy.
- **Coordinador** `src/ads/adMoments.ts`: `registerAdMoment("card_close" | "copy" | "share")`: suma puntos, si toca y nada lo bloquea, espera ~600 ms (que termine la animación) y muestra; si se mostró, `markShown`. Solo en plataformas nativas.
- **Rewarded** (`ads/rewarded.ts`): al ganar la recompensa llama a `markRewarded`.
- **Disparadores**: `CardPhrase.tsx` (cerrar tarjeta, copiar, compartir texto), `ShareSheet.tsx` (compartir imagen).
- **Bloqueos**: `hasOpenCardBanner()` en `cardBanner.ts` y un indicador `shareOpen` del menú.
- **Limpieza**: `MainHome.tsx` pierde el temporizador, los listeners y `isAdVisible`; llama a `initInterstitial()` tras iniciar AdMob.

## Estructura

```text
src/ads/interstitialPolicy.ts, interstitialPolicy.test.ts, interstitial.ts, adMoments.ts
```

## Riesgos

- El anuncio puede no estar listo en el momento: se omite sin esperar.
- Los valores iniciales son una hipótesis: ajustables en `AD_POLICY`.
