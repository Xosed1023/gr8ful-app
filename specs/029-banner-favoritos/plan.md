# Implementation Plan: Banner fijo en Favoritos

**Spec**: [spec.md](./spec.md)

## Summary

Se reutiliza el coordinador de banners de las tarjetas (`src/ads/cardBanner.ts`): una petición pasa a declarar su **pantalla** (`screen: "home" | "favorites"`) y las de Favoritos se muestran aunque Home esté oculto. La pantalla Favoritos reserva un hueco transparente encima de la barra flotante, mide su posición con `computeBannerMargin` y pide el banner al terminar la transición.

## Constitution Check

Local-first ✔ · trilingüe ✔ (no añade textos) · mobile-first ✔ · AdMob como restricción ✔ · reutilizar antes de duplicar ✔ (mismo coordinador, mismo cálculo de margen).

## Diseño

- **Coordinador** (`cardBanner.ts`): `CardBannerRequest.screen?` (por omisión, Home). `apply()` elige la última petición **visible**: las de Favoritos siempre, las de Home solo si `homeVisible`. Al salir de Favoritos, si Home sigue con una tarjeta abierta vuelve su banner; si no hay ninguna, se oculta. `hasOpenCardBanner()` ignora las de Favoritos (el banner no es una tarjeta abierta; spec 027).
- **Helper** (`src/ads/favoritesBanner.ts`): `favoritesBannerAdId(env, plataforma)` (unidad propia o, si falta, la de la tarjeta EN), `showFavoritesBanner(adId, margin)` y `hideFavoritesBanner()`.
- **Pantalla** (`Favorites.tsx` / `.css`):
  - `.favorites-ad-slot`: hueco transparente de 60 px, `position: absolute; bottom: var(--nav-space)`, es decir, 12 px sobre la barra de pestañas (la barra está a `safe-area + 12 px` y mide 60 px).
  - El relleno inferior del `IonContent` pasa de `--nav-space` a `--nav-space + 60 px + 8 px` (`--favorites-bottom-space`), también para el estado vacío.
  - `useIonViewDidEnter` mide el hueco y pide el banner; `useIonViewWillLeave` y el desmontaje lo quitan.
- **Margen**: `computeBannerMargin` (sin cambios): Android mide desde el borde inferior del contenido (el plugin parcheado aplica el margen solo abajo); iOS descuenta la zona segura.
- **Producción**: variables `VITE_IOS_FAVORITES_BANNER` / `VITE_ANDROID_FAVORITES_BANNER`. **La usuaria debe crear esas unidades de banner en AdMob** y añadirlas al `.env` (no se edita desde aquí); mientras falten, se reutiliza la de la tarjeta EN para que nunca quede vacío. Anotado en `specs/BACKLOG.md`.

## Estructura

```text
src/ads/cardBanner.ts (+ test), src/ads/favoritesBanner.ts (+ test)
src/pages/Favorites.tsx, src/pages/Favorites.css
```

## Riesgos

- El alto real del banner adaptativo varía (50–60 dp): se reserva 60 px; un banner más alto sobresaldría sobre la última frase (poco probable).
- Posición exacta del banner nativo (iOS/Android): validar en teléfono; `bannerMargin.ts` conserva `PLATFORM_OFFSET` para afinar.
