# Research: Completar Scheduling de Frase Diaria

## Hallazgos

- **H1 — Repetición con texto fijo.** `Schedule.on`/`every` repite el mismo texto; para frases distintas hay que programar notificaciones individuales con `Schedule.at`.
- **H2 — Límite de iOS.** 64 notificaciones locales pendientes por app; el resto se descarta. Ventana elegida: 30 días.
- **H3 — Reponer.** La app solo puede programar mientras se ejecuta, por eso se repone en cada apertura (`App.tsx`) y tras cada cambio de preferencias.
- **H4 — Permiso.** `App.tsx` pide hoy el permiso de push remoto al arrancar (`PushNotifications.requestPermissions`). En iOS/Android 13+ es el mismo permiso de notificaciones del sistema, de modo que ese diálogo aparece antes del onboarding y quita el contexto a la pregunta.
- **H5 — Toggle.** `Settings.tsx` usa `value` (no `checked`) en `IonToggle` (hallazgo T006/T032 de la spec 019): aparece apagado al abrir y su `IonAlert` tiene botones vacíos.
- **H6 — Android.** El manifiesto del plugin añade `POST_NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED` y receptores; las notificaciones de `at` programadas sobreviven al reinicio. Android 8+ requiere un canal.
- **H7 — Estado de las frases.** `getRandomPhrase` ya filtra por temas y por `hasShown`; su lógica es parte de la selección pero devuelve una sola frase, así que se replica la regla con una función pura sobre `getAllPhrases()`.

- **H8 — Paso de hora oculto.** `Gender.tsx` y `QuoteTopics.tsx` saltan `/quoteTime` mientras `VITE_SHOW_PUSH_NOTIFICACIONS_SCREEN` no sea `"true"` (hoy `false`): ningún usuario nuevo guarda `time`. Se elimina la condición (FR-013). Usuarios que ya terminaron el onboarding sin hora: valor por defecto 12 al activar el interruptor (FR-014).

## Decisión 1 — Notificaciones individuales con IDs fijos

**Decision**: IDs `7000 + i` (i = 0..29), una por día, programadas con `schedule: { at, allowWhileIdle: true }`. Antes de programar se cancelan los 30 IDs, así nunca hay duplicados (FR-012) y cambiar la hora/idioma/temas es la misma operación.

**Rationale**: H1, H2 y FR-007/FR-012 con una sola ruta de código.

## Decisión 2 — Selección de frases (función pura)

**Decision**: `buildSchedule({ phrases, topics, language, hour, now, days })`: candidatas = frases de los temas elegidos (o todas si no hay temas); orden = no vistas primero, luego vistas, barajadas dentro de cada grupo; si faltan, se completan con frases de otros temas y, en último caso, se repiten. Primera fecha = hoy si la hora aún no pasó; si no, mañana. Cuerpo = `frase` + salto de línea + `— autor`; título = nombre de la app.

**Rationale**: Testable sin plugin ni reloj (se inyecta `now`).

## Decisión 3 — Permiso: cuándo y cómo

**Decision**: `enableDailyQuotes()` comprueba el permiso; si es `prompt` lo solicita; si queda `denied` devuelve `"denied"` sin programar. Se llama (a) al elegir la hora en el onboarding y (b) al activar el interruptor. `App.tsx` deja de llamar a `requestPermissions` y solo registra push remoto si el permiso ya está concedido.

**Rationale**: FR-005, FR-009, SC-006.

## Decisión 4 — Toggle y estado

**Decision**: `pushNotifications` en `localStorage` es la fuente de verdad ("true"/"false"). `enable` lo pone a "true" solo si se programó; `disable` a "false". El toggle usa `checked` con estado de React y, si `enable` devuelve `"denied"`, vuelve a apagarse y muestra un `IonAlert` traducido.

**Rationale**: FR-006, FR-008 y arregla H5.

## Decisión 5 — Android: canal

**Decision**: En Android se crea (idempotente) el canal `daily-quote` con nombre traducido y se usa en cada notificación.

## Riesgos

- **R1** — El permiso en iOS solo puede solicitarse una vez; si se rechaza, solo se cambia en Ajustes del sistema (por eso FR-008 explica cómo).
- **R2** — Android 12+ puede restringir alarmas exactas; se usa programación no exacta con `allowWhileIdle`, aceptable para una frase diaria (puede variar minutos).
- **R3** — Icono de notificación en Android: se usa el predeterminado del plugin; un icono propio queda como mejora.
- **R4** — Entrega real solo verificable esperando a la hora; se prueba cambiando la hora del dispositivo o programando una prueba corta (quickstart §2).
