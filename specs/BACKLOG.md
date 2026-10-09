# Backlog de Features Futuras

Candidatas a futuro sin spec formal todavía. Cuando se decida priorizar una, se convierte en spec completa con `/speckit-specify`. Esta lista no es exhaustiva ni compromete ningún orden — es solo un punto de partida para discutirlo en sesiones futuras.

- **Widget: tamaños mediano/grande** — los widgets de iOS (spec 024) y Android (spec 026) son solo pequeños (2×2); añadir más tamaños si se valida demanda.
- **Más idiomas** — extender más allá de ES/EN/FR (ej. portugués, alemán) si se valida demanda; implicaría revisar el modelo `Phrase.content` (hoy hardcodeado a 3 idiomas) y todo `src/persistence/languages.ts`.
- **Quiz/práctica de vocabulario** — a partir de las frases ya mostradas, ejercicios simples de traducción o selección múltiple para reforzar el aprendizaje de idiomas (más allá de solo "leer" frases).
- **Historial de frases vistas** — pantalla que liste todas las frases ya mostradas (`hasShown: true`), no solo las favoritas.
- **Exportar/importar datos locales** — dado que todo es local (sin backend), permitir exportar favoritos/preferencias a un archivo para respaldo o cambio de dispositivo.
- **Selección de fuente/tamaño de texto** — accesibilidad para usuarios que necesitan texto más grande al leer las frases.
- **Vectorizar el logo de Gr8ful** — hoy es una imagen estática que no se puede recolorear, así que en modo oscuro (spec 019) se ve con menos contraste; vectorizarlo permitiría tokenizar sus colores y adaptarlo a ambos temas.
- **Validar los banners por tarjeta en un teléfono Android físico** — `specs/020-completar-banners-admob-card` se validó en iPhone y en un emulador Android (Pixel, 1080×2400): el banner queda en su hueco. Para ello hubo que parchear `@capacitor-community/admob` (`patches/`, vía `patch-package`): el plugin de Android aplicaba el margen arriba y abajo a la vez y, con márgenes grandes, el banner quedaba sin altura. Falta confirmarlo en un teléfono físico y en pantallas pequeñas.
- **Validar las notificaciones de frase diaria en Android** — `specs/021-completar-scheduling-frase-diaria` se verificó solo en iPhone. Revisar entrega con la app cerrada, tras reiniciar el dispositivo, y en fabricantes con optimización agresiva de batería.
- **Icono propio para las notificaciones en Android** — hoy se usa el icono por defecto del plugin; añadir un icono monocromo de la app (`smallIcon`).
- **Validar «compartir como imagen» en Android** — `specs/023-compartir-como-imagen` se verificó solo en iPhone. Revisar que el archivo temporal en la caché llegue a las apps destino (permisos de FileProvider) y la tipografía en el dispositivo.
- **Ampliar la racha** — mostrar la mejor racha (ya se guarda), celebrar hitos (7, 30, 100 días) y/o mostrarla en Ajustes y en el widget (`specs/025-racha-de-dias`).
- **Crear en AdMob las unidades de banner de Favoritos** (`specs/029-banner-favoritos`) — el banner fijo de Favoritos ya está implementado; para producción crear dos unidades de banner («Favoritos» iOS y Android) y añadir `VITE_IOS_FAVORITES_BANNER` y `VITE_ANDROID_FAVORITES_BANNER` al `.env`. Mientras no existan se reutiliza la unidad de la tarjeta EN (hoy no afecta: en pruebas se usa el banner de prueba de Google). Validar su posición en un teléfono iOS y Android.
- **Más ingresos sin más intrusión** (continuación de `specs/027-estrategia-de-anuncios`) — anuncio nativo cada N frases en Favoritos; premios del rewarded (p. ej. temas extra para la imagen al compartir, o «un día sin intersticiales»); formato App Open para quien solo lee desde el widget (comprobar soporte del plugin); recalibrar `AD_POLICY` con datos reales de retención e ingresos.
- **Compartir las tres versiones en una sola imagen** — variante de la spec 023 que apila la frase en ES, EN y FR; encaja con el propósito de aprendizaje de idiomas.

## Relación con deuda técnica existente

Antes de invertir en features nuevas de esta lista, priorizar cerrar `specs/007` a `specs/014` (deuda técnica) — varias de estas candidatas nuevas (ej. historial de frases) se apoyan en features que hoy están a medio terminar (ej. favoritos).

## Bloqueante antes de publicar en las stores

- **Volver a Ad Unit IDs de producción de AdMob** — durante `specs/015-actualizar-dependencias-calidad` (T016) se reemplazaron temporalmente los Ad Unit ID de producción (intersticial y rewarded, iOS y Android) por los IDs de test oficiales de Google, para poder verificar que los anuncios seguían funcionando tras la actualización de dependencias sin arriesgar la cuenta real. Hoy la app queda fija en modo test — **no genera ingresos por ads** hasta revertir este cambio en `src/pages/MainHome.tsx`.
- **Poner `VITE_IS_TESTING=false` al publicar** — con `true` la app usa anuncios de prueba y muestra la sección «Herramientas de prueba» en Ajustes (`specs/032-herramientas-de-prueba`).
- **Implementar el flujo de consentimiento GDPR/UMP** — `AdMob.requestConsentInfo`/`showConsentForm` no están implementados hoy; es requisito legal antes de servir ads personalizados a usuarios en la UE/EEE.
- **Nota de contexto**: las cuentas de AdMob y AdSense están actualmente en proceso de verificación por parte de Google — hasta que ese proceso no se resuelva, no tiene sentido revertir a IDs de producción ni publicar con monetización real activa. Revisar el estado de la verificación antes de abordar estos dos puntos.
