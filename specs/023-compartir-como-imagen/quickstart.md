# Quickstart: Validar Compartir como Imagen

Requiere `npm run build && npx cap sync ios` y reinstalar (plugin nuevo). Parte de la lógica y la vista previa se ve también en `npm run dev`.

## 1. Controles automáticos
```bash
npm run lint && npm run build && npm run test.unit
```

## 2. Menú y texto (User Story 1)
1. En Home, tocar compartir en una tarjeta: aparece el menú «Como imagen / Como texto / Cancelar».
2. «Como texto»: se abre el menú del sistema con la frase y el autor (igual que antes).

## 3. Imagen y formato (User Stories 1 y 2)
1. «Como imagen»: vista previa renderizada con frase del idioma de la tarjeta, autor y logo.
2. Alternar «Historia» y «Cuadrado»: la imagen cambia de proporción, el texto no se corta.
3. Compartir a Mensajes / WhatsApp / Instagram: la imagen llega completa.
4. Cancelar el menú del sistema: vuelve a la vista previa sin errores.

## 4. Estilo (User Story 3)
Repetir con las 4 combinaciones: mujer/hombre × claro/oscuro. Comprobar colores y contraste.

## 5. Bordes
- Frase larga (probar con la más larga del catálogo) en ambos formatos.
- Con la tarjeta abierta (banner visible): al abrir el menú, el banner no debe asomar por encima.
- Sin red: la imagen se genera con tipografía de respaldo.
