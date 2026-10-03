# Quickstart: Validar Banners AdMob por Tarjeta

Requiere dispositivo o emulador iOS/Android con anuncios de prueba (`VITE_IS_TESTING=true`). En el navegador el coordinador es no-op: solo sirve para `npm run dev` sin errores.

## 1. Controles automáticos

```bash
npm run lint && npm run build && npm run test.unit
```

## 2. Aparece al abrir (User Story 1)

1. Abrir Home con las 3 tarjetas cerradas: **no hay banner**.
2. Tocar la tarjeta EN: al terminar la animación aparece un banner de prueba **dentro de la tarjeta**, bajo la fila de chip y botones; la frase y los botones (favorito, compartir, copiar) siguen visibles y pulsables.
3. Tocar de nuevo la tarjeta: el banner desaparece de inmediato.
4. Repetir con ES y FR.
5. Abrir EN y luego ES: se ve **un solo** banner (el de ES). Cerrar ES: reaparece el de EN si EN sigue abierta.

## 3. No estorba ni deja huecos (User Story 2)

1. Modo avión, abrir una tarjeta: la tarjeta se ve completa, sin recuadro vacío ni mensaje de error.
2. Con un banner visible, ir a Favoritos y a Ajustes: el banner no se ve. Volver a Home con la tarjeta abierta: reaparece.
3. Abrir y cerrar una tarjeta muchas veces seguidas: no queda ningún banner "fantasma" con la tarjeta cerrada.
4. Dejar pasar un intersticial (cada 45 s): el anuncio a pantalla completa aparece como siempre y, al cerrarlo, el banner sigue ahí.
5. Usar el rewarded (tocar Home estando en Home): sin cambios respecto a antes.

## 4. Posición y temas (User Story 3)

| Combinación | EN | ES | FR |
|---|---|---|---|
| iOS · claro | ☐ | ☐ | ☐ |
| iOS · oscuro | ☐ | ☐ | ☐ |
| Android · claro | ☐ | ☐ | ☐ |
| Android · oscuro | ☐ | ☐ | ☐ |

En cada celda: banner centrado, dentro de los límites de su tarjeta, sin quedar cortado por la barra del autor ni por la barra de navegación.

## 5. Calibración de posición (si hay desfase constante)

Si en una plataforma el banner queda desplazado siempre la misma distancia respecto al slot, ajustar la constante de plataforma en `src/ads/bannerMargin.ts` (`PLATFORM_OFFSET`) y repetir §4. No debe depender de la tarjeta.

## 6. Cierre

Si todo pasa: marcar `tasks.md`, pasar `Status` de la spec a «Implementado».
