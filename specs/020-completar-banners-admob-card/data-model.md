# Data Model: Completar Banners AdMob por Tarjeta

Sin persistencia. Se documentan las estructuras en memoria del coordinador.

## CardBannerRequest

| Campo | Tipo | Restricción |
|---|---|---|
| `ownerId` | `string` | Identificador estable de la tarjeta: `"en" \| "es" \| "fr"` (el `language` de la tarjeta) |
| `adId` | `string` | Identificador de unidad de banner de esa tarjeta y plataforma (`VITE_{IOS\|ANDROID}_{EN\|ES\|FR}_CARD`). Si está vacío o ausente, la petición se ignora (FR sin banner) |
| `margin` | `number` | Entero ≥ 0, en píxeles CSS (= dp/pt). Distancia del borde inferior (Android) o de la zona segura inferior (iOS) al borde inferior del banner |

## Estado del coordinador (`cardBanner.ts`)

| Estado | Tipo | Descripción |
|---|---|---|
| `open` | `CardBannerRequest[]` | Pila de tarjetas abiertas; la última es la activa (FR-004). Una `ownerId` aparece una sola vez |
| `homeVisible` | `boolean` | `false` mientras Home no es la pestaña visible (FR-007). Inicial `true` |
| `native` | `{ key: string } \| null` | Lo que hay creado en el plugin: `key = adId + "\|" + margin`. `null` si no hay banner creado |
| `queue` | `Promise<void>` | Cadena que serializa las llamadas al plugin; cada paso aplica el estado más reciente |

### Reglas de transición (función `apply`)

1. **Sin activa o `homeVisible = false`** → si `native ≠ null` → `hideBanner()`; `native` conserva su `key` (pausado).
2. **Activa con la misma `key` que `native`** → `resumeBanner()`.
3. **Activa con otra `key`** → `removeBanner()` (ignorar error) → `showBanner(options)`; `native.key = key`.
4. Cualquier error del plugin se registra con `console.error` y no se propaga.

### `BannerAdOptions` enviado

```text
adId:      request.adId
adSize:    ADAPTIVE_BANNER
position:  BOTTOM_CENTER
margin:    request.margin
isTesting: import.meta.env.VITE_IS_TESTING === "true"   // comparar con la cadena (research.md H5)
```

## Slot de la tarjeta

Elemento `div` transparente dentro de `CardPhrase`, bajo la fila de chip y botones, alto mínimo 60 px, sin fondo ni borde. Se mide con `getBoundingClientRect()` solo cuando la tarjeta terminó de abrirse.

## Reglas de validación

- **VR-001**: `margin` = `max(0, round(window.innerHeight − rect.bottom − safeAreaBottomIOS))`, con `safeAreaBottomIOS = 0` en Android.
- **VR-002**: Nunca más de un banner creado en el plugin (`removeBanner` antes de `showBanner` con otra `key`).
- **VR-003**: `adId` vacío → no se llama al plugin.
