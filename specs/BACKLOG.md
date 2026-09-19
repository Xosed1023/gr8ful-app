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

## Relación con deuda técnica existente

Antes de invertir en features nuevas de esta lista, priorizar cerrar `specs/007` a `specs/014` (deuda técnica) — varias de estas candidatas nuevas (ej. historial de frases) se apoyan en features que hoy están a medio terminar (ej. favoritos).
