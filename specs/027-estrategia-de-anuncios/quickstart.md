# Quickstart: Estrategia de Anuncios

Los anuncios son de prueba. En Chrome (`chrome://inspect`) elige la página **«Gr8ful» (https://localhost/…)**, no los marcos de `googleads.g.doubleclick.net`: son WebViews del propio anuncio con otro `localStorage`. Para no esperar 24 h de gracia, en la consola del WebView (Chrome `chrome://inspect` o Safari) ejecuta:

```js
// Simula 2 días de uso y fuerza puntos acumulados
localStorage.adPolicy = JSON.stringify({firstSeenAt: Date.now() - 2*864e5, lastShownAt: 0, quietUntil: 0, day: "", shownToday: 0, points: 0}); location.reload()
```

1. Abre la app y espera 2 minutos en Home: **no sale ningún intersticial**.
2. Abre y cierra una tarjeta, copia y comparte hasta sumar 3 puntos (cerrar = 1, copiar = 1, compartir = 2): sale un intersticial tras la acción.
3. Repite enseguida: **no sale** hasta pasados 4 minutos.
4. Tras 3 en el día, no salen más.
5. Ve un anuncio recompensado («Renovar inspiración»): durante 10 minutos no sale intersticial.
6. Con una tarjeta abierta o el menú de compartir abierto, no sale.
7. Sin los 2 días de uso simulados (instalación nueva): no salen intersticiales en 24 h.
