# Quickstart: Validar Completar Favoritos

## 1. Controles automáticos

```bash
npm run lint       # 0 errores
npm run build        # tsc + vite build, 0 errores
npm run test.unit     # sin regresiones respecto al estado previo
```

## 2. Fix del bug (FR-004) — verificación aislada

Con la app corriendo (`npm run dev` o dispositivo):
1. Marcar 2-3 frases distintas como favoritas desde Home (ver paso 3).
2. Abrir el tab Favoritos.
3. Confirmar que aparecen **exactamente** esas frases — antes del fix, esta lista habría estado siempre vacía sin importar cuántas se marcaran (SC-002).

## 3. Marcar/desmarcar desde Home (User Story 1)

1. En Home, con una tarjeta visible, tocar el ícono de bookmark.
2. Confirmar que el ícono pasa a estado relleno de inmediato.
3. Tocar de nuevo — confirmar que vuelve a outline.
4. Confirmar que tocar el bookmark **no** dispara además el toggle de expandir/colapsar la tarjeta (FR-010).
5. Marcar una frase, cerrar la app completamente (kill, no solo background) y reabrirla. Si esa misma frase vuelve a mostrarse, confirmar que el ícono sigue relleno (SC-003, persistencia real).

## 4. Lista de Favoritos (User Story 2)

1. Con 0 favoritos marcados, abrir el tab Favoritos → debe verse un mensaje de estado vacío, no una lista en blanco (FR-006).
2. Marcar 3+ frases distintas, abrir Favoritos → deben verse las 3, en el idioma actualmente seleccionado.
3. Cambiar el idioma desde Ajustes (EN→ES→FR) y volver a Favoritos → mismas frases, contenido en el nuevo idioma (FR-008).
4. Tocar el bookmark de una frase en la lista → debe desaparecer de la lista inmediatamente, sin recargar la pantalla (FR-007).

## 5. Consistencia entre Home y Favoritos (FR-009, el caso más delicado)

1. En Home, marcar la frase actualmente visible como favorita.
2. Ir al tab Favoritos, ubicar esa misma frase y desmarcarla ahí.
3. Volver al tab Home.
4. Confirmar que el ícono de bookmark de esa frase (si sigue siendo la que se muestra) ya NO aparece como favorita — no debe quedar un estado visualmente desactualizado.

Nota: al tocar el tab Home, la app puede disparar el flujo existente de rewarded ad + nueva frase aleatoria (comportamiento preexistente, no introducido por esta spec — ver research.md). Si eso ocurre, repetir el paso 5 asegurándose de estar viendo la misma frase que se desmarcó en el paso 2 antes de confirmar.

## 6. Edge cases

- Doble tap rápido en el bookmark de Home → debe terminar en un estado consistente (marcado o desmarcado, sin quedar "atascado" a medio camino).
- Abrir el tab Favoritos apenas se lanza la app (antes de que IndexedDB termine de inicializar) → no debe verse ningún error, como mucho una lista vacía momentánea.
- Marcar todas las frases del catálogo como favoritas → la lista de Favoritos debe mostrarlas todas sin truncar.

## 7. Cierre

Si todo lo anterior pasa: marcar `tasks.md` completo, y confirmar en `specs/007-completar-favoritos/spec.md` y `specs/010-completar-bug-favoritos-indexeddb/spec.md` que su nota de "Superada" sigue siendo correcta (ya está aplicada).
