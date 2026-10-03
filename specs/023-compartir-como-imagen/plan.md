# Implementation Plan: Compartir Frase como Imagen

**Branch**: `develop` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

## Summary

Un módulo `src/share/` que (1) dibuja la imagen en un `<canvas>` (frase, autor, paleta de género, tema, logo) en formato 9:16 o 1:1, (2) la guarda como PNG temporal con `@capacitor/filesystem` y la entrega al menú nativo con `@capacitor/share` (`files`), y (3) un componente `ShareSheet` con el menú Imagen/Texto y la vista previa con selector de formato. El botón de compartir de `CardPhrase` abre ese componente.

## Technical Context

**Language/Version**: TypeScript ~5.1, React 18, Ionic 8

**Primary Dependencies**: `@capacitor/share` (ya instalado, `files` soportado); `@capacitor/filesystem` `^7.1.9` **NUEVA** (mismo major que el resto de `@capacitor/*`; requiere `npx cap sync`). Sin librerías de renderizado (se dibuja con la API de canvas).

**Storage**: ninguno persistente; el PNG se escribe en la carpeta de caché y el sistema la limpia.

**Testing**: `vitest` para el cálculo de saltos de línea y ajuste de tamaño (funciones puras) y para el flujo de compartir con plugins simulados; verificación visual y en dispositivo para el resultado final.

**Constraints**:
- Funciona sin red; las fuentes de la app (Montserrat) se cargan si hay red, con respaldo del sistema.
- iOS: `ctx.filter` (desenfoque de canvas) no es fiable en Safari → los brillos se dibujan con degradados radiales.
- El banner AdMob es una vista nativa que flota sobre la web → se oculta mientras el menú o la vista previa están abiertos.

**Scale/Scope**: 3 archivos nuevos en `src/share/` + componente + CSS + tests, cambios en `CardPhrase.tsx` y `languages.ts`.

## Constitution Check

| Principio | Evaluación | Estado |
|---|---|---|
| I. Local-First / Sin Backend | La imagen se genera y comparte en el dispositivo. | PASS |
| II. Trilingüe Obligatorio | Textos nuevos en ES/EN/FR; la imagen usa el idioma de la tarjeta. | PASS |
| III. Mobile-First vía Capacitor | Usa Filesystem y Share nativos; verificación en iPhone; fallback web para desarrollo. | PASS |
| IV. Monetización AdMob | No altera anuncios; solo oculta el banner mientras el menú está abierto (FR-012). | PASS |
| V. Reutilizar Antes de Duplicar | Reutiliza `@capacitor/share`, `QUOTE_MARKS`, los tokens de color y `setHomeVisible`; la única dependencia nueva está justificada (no hay forma de adjuntar archivos sin ella). | PASS |

## Decisiones

1. **Canvas 2D a mano en vez de capturar el DOM** (html-to-image / html2canvas): captura fiel en WebKit exige soluciones frágiles (SVG `foreignObject`, fuentes e imágenes sin cargar la primera vez, `backdrop-filter` no capturado). Dibujar con canvas es determinista, sin dependencias y probable en pruebas.
2. **Paleta en el módulo**: valores de los tokens (género × tema) copiados a una tabla en `renderQuoteImage.ts`, con comentario de que reflejan `variables.css` (los tokens CSS no se pueden leer fiablemente fuera del DOM de la tarjeta).
3. **Ajuste de texto**: empezar en un tamaño grande y reducir de 4 en 4 px hasta que las líneas quepan en el alto disponible (mínimo 34 px); saltos de línea por palabras con `measureText`.
4. **Logo**: `logo.svg` se dibuja sobre un lienzo auxiliar y se tiñe con `source-in` al color del texto con opacidad; si no carga, se escribe «Gr8ful» como texto.
5. **Entrega**: PNG → base64 → `Filesystem.writeFile` (Cache) → `getUri` → `Share.share({ files: [uri] })`. Cancelar el menú del sistema lanza una excepción que se ignora. En web: `navigator.share({ files })` si existe; si no, descarga.
6. **Menú y vista previa propios** (portal en `document.body`, estilo del kit de vidrio), no `IonActionSheet`, para coherencia visual y para cubrir el banner nativo con `setHomeVisible(false)`.

## Archivos

```text
src/share/
├── renderQuoteImage.ts      # dibuja el PNG (formato, género, tema)
├── layoutQuote.ts           # saltos de línea + ajuste de tamaño (puro, con tests)
├── shareImage.ts            # escribe el PNG y abre el menú nativo
├── layoutQuote.test.ts
├── shareImage.test.ts
├── ShareSheet.tsx           # menú Imagen/Texto + vista previa con formato
└── ShareSheet.css
src/components/home/CardPhrase.tsx   # el botón abre ShareSheet; el texto pasa a callback
src/persistence/languages.ts         # AppShareLanguage (ES/EN/FR)
```
