# Quickstart: Validar el Widget de la Frase del Día (iOS)

Requiere `npm run build && npx cap sync ios`, abrir `ios/App/App.xcworkspace` en Xcode, elegir tu equipo en **ambos** targets (App y Gr8fulWidget) y compilar en un iPhone. La primera vez Xcode registra el App Group `group.com.zen.gr8ful.shared` en tu cuenta.

## 1. Controles automáticos
```bash
npm run lint && npm run build && npm run test.unit
```

## 2. Estado vacío (User Story 3)
1. Con la app recién instalada (sin abrirla), mantén pulsada la pantalla de inicio → «+» → Gr8ful → widget pequeño.
2. Debe verse el mensaje «Abre Gr8ful…» en el idioma del dispositivo.

## 3. Frase del día (User Stories 1 y 2)
1. Abre la app, termina el onboarding y vuelve a la pantalla de inicio: el widget muestra una frase con su autor.
2. Toca el widget: abre la app en Home.
3. Cambia el idioma desde Ajustes → Idioma: al volver a la pantalla de inicio el widget (tras el refresco del sistema) muestra la frase en el nuevo idioma.
4. Repite con mujer/hombre y con el dispositivo en modo claro/oscuro.
5. Con las notificaciones activadas, la frase de la notificación de hoy es la del widget.
6. Al día siguiente (o cambiando la fecha del dispositivo), el widget muestra otra frase.

## 4. Bordes
- Frase larga: se reduce sin desbordar.
- Dos widgets en pantalla: misma frase.
- Reinstalar la app: el widget vuelve al mensaje vacío hasta abrirla.
