# Quickstart: Banner fijo en Favoritos

Los anuncios son de prueba (`VITE_IS_TESTING=true`: banner de prueba de Google). Requiere `npm run build && npx cap sync` y ejecutar en el dispositivo.

1. Guarda 8 o más frases en favoritos desde Inicio.
2. Abre **Favoritos**: aparece un banner de prueba **justo encima de la barra de pestañas**, con un pequeño aire entre ambos.
3. Desplázate hasta el final: la última frase queda **completa por encima del banner**; el banner no se mueve.
4. Quita todas las frases: se ve el estado vacío («Aún no tienes favoritos») y el banner, sin solaparse.
5. Cambia a **Ajustes**: no se ve ningún banner. Vuelve a Favoritos: reaparece.
6. En **Inicio**, abre una tarjeta (aparece su banner), cambia a **Favoritos**: se ve el banner de Favoritos. Vuelve a Inicio con la tarjeta aún abierta: reaparece el banner de la tarjeta.
7. Prueba mujer y hombre, claro y oscuro, y los tres idiomas.
8. Android: comprueba que el banner no queda recortado ni flotando lejos de la barra (si lo hiciera, afinar `PLATFORM_OFFSET` en `src/ads/bannerMargin.ts`). Pantallas pequeñas en iOS: lo mismo.

## Producción

Crea en AdMob dos unidades de banner («Favoritos» iOS y Android) y añade al `.env`:

```
VITE_IOS_FAVORITES_BANNER=ca-app-pub-…/…
VITE_ANDROID_FAVORITES_BANNER=ca-app-pub-…/…
```

Mientras no existan, se usa la unidad de la tarjeta EN.
