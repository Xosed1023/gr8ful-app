# Backlog de Features Futuras

Candidatas a futuro sin spec formal todavía. Cuando se decida priorizar una, se convierte en spec completa con `/speckit-specify`. Esta lista no es exhaustiva ni compromete ningún orden — es solo un punto de partida para discutirlo en sesiones futuras.

- **Racha de días de uso ("streak")** — incentivar apertura diaria mostrando cuántos días consecutivos el usuario abrió la app, reforzando el hábito de aprendizaje de idiomas.
- **Compartir frase como imagen** — versión más elaborada de `specs/008-completar-compartir`: generar una imagen con la frase estilizada para compartir en redes, en vez de solo texto.
- **Widget nativo (Android/iOS)** — mostrar la frase del día directamente en la pantalla de inicio del dispositivo, sin abrir la app.
- **Más idiomas** — extender más allá de ES/EN/FR (ej. portugués, alemán) si se valida demanda; implicaría revisar el modelo `Phrase.content` (hoy hardcodeado a 3 idiomas) y todo `src/persistence/languages.ts`.
- **Quiz/práctica de vocabulario** — a partir de las frases ya mostradas, ejercicios simples de traducción o selección múltiple para reforzar el aprendizaje de idiomas (más allá de solo "leer" frases).
- **Historial de frases vistas** — pantalla que liste todas las frases ya mostradas (`hasShown: true`), no solo las favoritas.
- **Exportar/importar datos locales** — dado que todo es local (sin backend), permitir exportar favoritos/preferencias a un archivo para respaldo o cambio de dispositivo.
- **Selección de fuente/tamaño de texto** — accesibilidad para usuarios que necesitan texto más grande al leer las frases.
- **Vectorizar el logo de Gr8ful** — hoy es una imagen estática que no se puede recolorear, así que en modo oscuro (spec 019) se ve con menos contraste; vectorizarlo permitiría tokenizar sus colores y adaptarlo a ambos temas.
- **Validar la posición de los banners por tarjeta en Android** — `specs/020-completar-banners-admob-card` se verificó solo en un iPhone 17 Pro. En Android (sobre todo con pantalla completa/borde a borde) el contenedor del plugin puede no coincidir con `window.innerHeight`; si el banner sale desplazado, ajustar `PLATFORM_OFFSET` en `src/ads/bannerMargin.ts` (quickstart.md §5). También conviene revisar tamaños de pantalla pequeños en iOS.

## Relación con deuda técnica existente

Antes de invertir en features nuevas de esta lista, priorizar cerrar `specs/007` a `specs/014` (deuda técnica) — varias de estas candidatas nuevas (ej. historial de frases) se apoyan en features que hoy están a medio terminar (ej. favoritos).

## Bloqueante antes de publicar en las stores

- **Volver a Ad Unit IDs de producción de AdMob** — durante `specs/015-actualizar-dependencias-calidad` (T016) se reemplazaron temporalmente los Ad Unit ID de producción (intersticial y rewarded, iOS y Android) por los IDs de test oficiales de Google, para poder verificar que los anuncios seguían funcionando tras la actualización de dependencias sin arriesgar la cuenta real. Hoy la app queda fija en modo test — **no genera ingresos por ads** hasta revertir este cambio en `src/pages/MainHome.tsx`.
- **Implementar el flujo de consentimiento GDPR/UMP** — `AdMob.requestConsentInfo`/`showConsentForm` no están implementados hoy; es requisito legal antes de servir ads personalizados a usuarios en la UE/EEE.
- **Nota de contexto**: las cuentas de AdMob y AdSense están actualmente en proceso de verificación por parte de Google — hasta que ese proceso no se resuelva, no tiene sentido revertir a IDs de producción ni publicar con monetización real activa. Revisar el estado de la verificación antes de abordar estos dos puntos.
