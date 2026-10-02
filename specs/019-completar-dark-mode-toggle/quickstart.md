# Quickstart: Validar Modo Oscuro Completo

## 1. Controles automáticos

```bash
npm run lint && npm run build && npm run test.unit
```

## 2. Control y persistencia (User Story 1)

1. Ajustes → activar el toggle de modo oscuro: toda la app cambia a oscuro sin recargar.
2. Desactivarlo: vuelve al tema claro, idéntico al de antes.
3. Activarlo, **cerrar la app por completo y reabrirla**: debe abrir directamente en oscuro en Home (no solo en Ajustes) y **sin destello claro** al arrancar.
4. Cambiar el idioma de la app: la etiqueta del toggle sigue en el idioma correcto.

## 3. Todas las pantallas en oscuro (User Story 2)

Con el modo oscuro activo, recorrer y marcar cada pantalla (se compara contra las pantallas `(dark · mujer)` / `(dark · hombre)` del archivo de Figma «Mokups-Proyecto-Frases»):

| Pantalla | Mujer | Hombre |
|---|---|---|
| Bienvenida / Login | ☐ | ☐ |
| Idioma (Step 2), Género (Step 1) | ☐ | ☐ |
| Hora (Step 3 / 11), Temas (Step 4 / 12), Nombre (Step 5 / 13) | ☐ | ☐ |
| Carga | ☐ | ☐ |
| Home (3 tarjetas, barra del autor, navegación) | ☐ | ☐ |
| Ajustes | ☐ | ☐ |
| Favoritos | ☐ | ☐ |

En cada una confirmar: fondo oscuro, texto legible, botones con contraste invertido (el texto de «A woman» / «A man» y de los botones debe ser **oscuro sobre botón claro**), sin zonas claras fijas, toast oscuro al copiar una frase.

## 4. Paleta por género (User Story 3)

1. Completar el onboarding como **mujer** con el modo oscuro activo: degradado morado atenuado y tarjetas azul / morado / violeta.
2. Repetir como **hombre** (volver al paso de género): degradado azul atenuado y tarjetas en azules.
3. Confirmar que cada tarjeta de Home muestra el texto de la frase con contraste suficiente (≥ 4.5:1; herramienta de contraste del navegador en `npm run dev`).

## 5. Regresión del tema claro (FR-010)

Con el modo oscuro desactivado, recorrer las mismas pantallas y confirmar que no hay ningún cambio visual respecto a antes de esta spec (colores de tarjetas, botones negros, fondos, toast).

## 6. Banners AdMob

En dispositivo/emulador con anuncios de prueba, confirmar que los banners por tarjeta siguen en su posición y no tapan texto.

## 7. Cierre

Si todo pasa: marcar `tasks.md` completo, actualizar `Status` a «Implementado» y anotar en `specs/BACKLOG.md` la vectorización del logo (candidata futura).
