# Quickstart: Validar Frase Diaria con Notificaciones Locales

Requiere dispositivo físico (iOS y/o Android). Antes: `npm run build && npx cap sync` y reinstalar la app.

## 1. Controles automáticos

```bash
npm run lint && npm run build && npm run test.unit
```

## 2. Entrega (User Story 1)

1. App recién instalada (o datos borrados): **no** aparece el diálogo de permiso al abrir.
2. Onboarding: idioma → género → hora. Al elegir la hora aparece el diálogo de permiso. Aceptar.
3. Para probar sin esperar: elegir la hora más cercana disponible cambiando la hora del dispositivo a unos minutos antes de 6:00, 12:00 o 18:00; cerrar la app; esperar. Debe llegar la notificación con frase y autor, en el idioma elegido.
4. Tocar la notificación: la app abre en Home.
5. Pasar el reloj al día siguiente: llega otra notificación con una frase distinta.

## 3. Control desde Ajustes (User Story 2)

1. Ajustes: el interruptor aparece **activado** (refleja el estado real).
2. Desactivarlo: no llega ninguna más (comprobar a la hora siguiente).
3. Activarlo de nuevo: vuelven.
4. Cambiar la hora a otra: la notificación llega a la nueva hora y no a la anterior (nunca dos).
5. Cambiar el idioma y los temas: la siguiente notificación sale en el idioma/temas nuevos.

## 4. Permiso denegado (User Story 3)

1. Reinstalar; en el onboarding **rechazar** el permiso: el onboarding sigue y el interruptor queda apagado.
2. Ajustes → activar el interruptor: vuelve a apagarse y aparece el aviso (ES/EN/FR según el idioma) explicando cómo permitirlo en los ajustes del sistema.
3. Conceder el permiso en los ajustes del sistema y volver a activar: se programan.

## 5. Android

Repetir §2-§4. Si no llega a la hora exacta, aceptable variación de minutos (alarma no exacta). Reiniciar el dispositivo y comprobar que siguen llegando.

## 6. Cierre

Si todo pasa: marcar `tasks.md` y pasar `Status` a «Implementado».
