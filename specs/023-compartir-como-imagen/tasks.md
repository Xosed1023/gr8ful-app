---
description: "Task list: compartir como imagen"
---

# Tasks: Compartir Frase como Imagen

- [X] T001 Instalar `@capacitor/filesystem@^7.1.9` y confirmar que `npm run build` pasa
- [X] T002 [P] `src/persistence/languages.ts`: `AppShareLanguage` (ES/EN/FR): título del menú, «como imagen», «como texto», cancelar, vista previa, formatos, compartir, generando, error
- [X] T003 [P] `src/share/layoutQuote.ts`: saltos de línea por palabras con una función de medida inyectable y ajuste de tamaño (puro)
- [X] T004 [P] `src/share/layoutQuote.test.ts`: una línea, varias líneas, palabra más larga que el ancho, reducción de tamaño hasta caber, mínimo respetado
- [X] T005 `src/share/renderQuoteImage.ts`: dibujar fondo, manchas (degradados radiales), tarjeta de vidrio, etiqueta de idioma, frase, autor y logo teñido; paleta por género × tema; formatos 1080×1920 y 1080×1080; esperar fuentes con respaldo — **Verificado visualmente** en Chromium (Edge): las 4 combinaciones género × tema y ambos formatos salen sin texto cortado; la tipografía de la app se comprueba en dispositivo
- [X] T006 `src/share/shareImage.ts`: PNG → archivo temporal → `Share.share({ files })`; ignorar la cancelación; fallback web (`navigator.share` con archivo o descarga)
- [X] T007 [P] `src/share/shareImage.test.ts`: con plugins simulados, escribe el archivo y comparte con la URI; la cancelación no lanza; un fallo real sí
- [X] T008 `src/share/ShareSheet.tsx` + `ShareSheet.css`: menú (Imagen / Texto / Cancelar) y vista previa con selector de formato, estado de carga y error; portal a `document.body`; `setHomeVisible(false)` mientras está abierto
- [X] T009 `src/components/home/CardPhrase.tsx`: el botón de compartir abre `ShareSheet`; el compartir de texto pasa a callback
- [X] T010 `npm run lint && npm run build && npm run test.unit` — 0 errores nuevos — **Resultado**: `tsc`, `eslint` y `vite build` sin errores; `vitest` 52/52 (13 tests nuevos)
- [X] T011 Verificación en iPhone — Verificación en iPhone (quickstart.md §2-§5) tras `npx cap sync` — **verificado por el usuario en iPhone (2026-10-03)**: funciona
- [X] T012 Cerrar: `Status` de `spec.md` y quitar la entrada del `BACKLOG.md`

## Dependencies
T001 → T005/T006; T003 → T004, T005; T005 + T006 → T008 → T009 → T010 → T011 → T012
