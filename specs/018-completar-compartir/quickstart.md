# Quickstart: Validar Completar Compartir Frase

## 1. Controles automáticos

```bash
npm run lint && npm run build && npm run test.unit
```

## 2. Idioma de cada tarjeta (User Story 1)

1. En Home, las 3 tarjetas deben mostrar la misma frase en idiomas distintos: la primera en EN, la segunda en ES y la tercera en FR.
2. Cambiar el idioma de la app desde Ajustes (EN, ES, FR) y volver a Home → las 3 tarjetas no cambian: siguen en EN, ES y FR respectivamente.
3. Tocar el botón de copiar en cada tarjeta y pegar en otra app (notas, mensajes) → el texto pegado debe estar en el idioma de la tarjeta tocada.

## 3. Compartir (User Story 2) — requiere dispositivo físico o simulador

1. Expandir una tarjeta, tocar el botón de compartir → debe abrirse el share sheet nativo del sistema.
2. Confirmar que el texto incluye la frase (en el idioma de la tarjeta tocada) y el autor. Repetir en las 3 tarjetas.
3. Cancelar el share sheet → la app debe seguir funcionando con normalidad, sin ningún error visible.
4. Confirmar que tocar compartir no colapsa/expande la tarjeta de fondo.
5. Compartir a una app real instalada (ej. Mensajes/WhatsApp) y confirmar que el texto llega completo y legible.

## 4. Cierre

Si todo pasa: marcar `tasks.md` completo.
