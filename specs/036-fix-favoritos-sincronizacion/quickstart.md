# Quickstart: Sincronización de favoritos

## En el teléfono
1. Guarda la frase de hoy (corazón en una tarjeta abierta).
2. Pulsa «Renovar inspiración» y ve el anuncio: la frase cambia.
3. Guarda también la frase nueva, ve a Favoritos y quita **la frase nueva**.
4. Vuelve a Diario: el corazón debe estar **vacío** (la frase ya no está guardada).
5. Púlsalo una vez: se llena y aparece en Favoritos. Púlsalo otra vez: se vacía y desaparece de Favoritos.
6. Repite quitando la **otra** frase desde Favoritos y volviendo: el corazón de la frase actual no cambia.

## Verificación automática (navegador)
```bash
npm run dev -- --port 5231
node specs/036-fix-favoritos-sincronizacion/verify-favoritos.mjs 5231
```
(requiere `playwright` con Chromium). Debe terminar con `RESULTADO desincronizaciones: 0`.
