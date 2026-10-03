# Feature Specification: Completar Scheduling de Frase Diaria

**Feature Branch**: `021-completar-scheduling-frase-diaria`

**Created**: 2026-10-02

**Status**: ✅ Implementado (verificado en iOS; Android pendiente de validar)

**Input**: "Completar specs/013-completar-scheduling-frase-diaria": usar el horario elegido en la app para enviar cada día una notificación local con una frase.

## Reemplaza a

Esta spec reemplaza a `specs/013-completar-scheduling-frase-diaria`, que queda superada. También cierra el requisito FR-003 de `specs/005-notificaciones-push` («no cumplido actualmente»).

## Decisiones de producto (2026-10-02)

1. **Contenido**: una **frase distinta cada día**. La app programa por adelantado las próximas notificaciones, cada una con una frase diferente, en el idioma de la app, priorizando frases aún no vistas y los temas elegidos. Se reponen cada vez que se abre la app. Funciona sin conexión.
2. **Control**: el interruptor «Notificaciones» de Ajustes **controla** las notificaciones diarias. Al activarlo se pide el permiso del sistema y se programan; al desactivarlo se cancelan todas. Al terminar de elegir la hora en el onboarding, las notificaciones quedan **activadas por defecto** y el permiso se pide en ese momento.

## Contexto y estado actual

- El horario (6:00, 12:00 o 18:00) se guarda en el dispositivo pero nada lo usa.
- El interruptor «Notificaciones» de Ajustes guarda un valor pero no hace nada real; su aviso de permisos tiene botones sin acción.
- El paso del onboarding donde se elige la hora está **oculto** por una variable de entorno de la app (`VITE_SHOW_PUSH_NOTIFICACIONS_SCREEN=false`), de modo que hoy ningún usuario nuevo llega a elegir hora. Con esta spec ese paso pasa a formar parte fija del onboarding.
- Hoy la app pide el permiso de notificaciones **al abrirse por primera vez**, antes de que el usuario sepa para qué (el registro de notificaciones remotas no tiene servidor que las envíe). Con esta spec el permiso se pide en el momento en que el usuario elige la hora o activa el interruptor.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recibir una frase cada día a la hora elegida (Priority: P1)

Como usuario que eligió una hora en el onboarding, recibo cada día a esa hora una notificación con una frase, sin necesidad de abrir la app ni de conexión a internet.

**Why this priority**: Es el valor central de la feature y de la promesa «When should we send your daily quote?».

**Independent Test**: Elegir una hora próxima, aceptar el permiso, cerrar la app y esperar: debe llegar la notificación con una frase. Repetir al día siguiente: la frase es otra.

**Acceptance Scenarios**:

1. **Given** el usuario terminó de elegir la hora y aceptó el permiso, **When** llega esa hora, **Then** recibe una notificación con una frase en el idioma de la app y su autor.
2. **Given** pasan varios días, **When** llega la hora cada día, **Then** cada notificación trae una frase diferente de las anteriores (mientras haya frases suficientes).
3. **Given** el usuario eligió temas en el onboarding, **When** se programan las notificaciones, **Then** las frases corresponden a esos temas (o a cualquiera si no eligió ninguno).
4. **Given** la hora de hoy ya pasó cuando el usuario la elige, **When** se programan, **Then** la primera notificación llega mañana a esa hora, no hoy.
5. **Given** el usuario toca la notificación, **When** se abre la app, **Then** abre normalmente en Home.

---

### User Story 2 - Controlar las notificaciones desde Ajustes (Priority: P1)

Como usuario, quiero activar, desactivar y cambiar la hora de las notificaciones desde Ajustes, y que el cambio se aplique de inmediato.

**Why this priority**: Sin control el usuario no puede dejar de recibirlas; además el interruptor ya existe y hoy es engañoso.

**Independent Test**: En Ajustes, desactivar el interruptor y confirmar que ya no llegan; activarlo y confirmar que vuelven; cambiar la hora y confirmar que llegan a la nueva hora y no a la anterior.

**Acceptance Scenarios**:

1. **Given** las notificaciones activas, **When** el usuario desactiva el interruptor, **Then** se cancelan todas las pendientes y no llega ninguna más.
2. **Given** las notificaciones desactivadas, **When** el usuario activa el interruptor, **Then** se pide el permiso si hace falta y, si lo concede, se programan las notificaciones.
3. **Given** el usuario cambia la hora en Ajustes, **When** guarda, **Then** las notificaciones anteriores se cancelan y se reprograman a la hora nueva (nunca llegan a las dos horas).
4. **Given** el usuario cambia el idioma o los temas, **When** guarda, **Then** las próximas notificaciones usan el idioma y los temas nuevos.
5. **Given** el interruptor refleja el estado real, **When** el usuario abre Ajustes, **Then** el interruptor aparece activado o desactivado según lo guardado (y no siempre apagado).

---

### User Story 3 - Permiso denegado sin errores ni confusión (Priority: P2)

Como usuario que rechaza el permiso de notificaciones, quiero que la app lo respete y me explique cómo activarlo después, sin pantallas rotas.

**Why this priority**: Es un caso muy frecuente; manejarlo mal deja el interruptor mintiendo.

**Independent Test**: Rechazar el permiso en el onboarding y comprobar que la app continúa; en Ajustes intentar activar el interruptor y comprobar el aviso.

**Acceptance Scenarios**:

1. **Given** el usuario rechaza el permiso al elegir la hora, **When** continúa el onboarding, **Then** el onboarding sigue con normalidad y las notificaciones quedan desactivadas.
2. **Given** el permiso está denegado, **When** el usuario activa el interruptor en Ajustes, **Then** el interruptor vuelve a apagarse y se muestra un aviso (en su idioma) que explica que debe permitir las notificaciones en los ajustes del sistema.
3. **Given** el permiso fue concedido en el sistema después, **When** el usuario vuelve a activar el interruptor, **Then** se programan las notificaciones.

---

### Edge Cases

- **Sin frases en el idioma/tema**: si los temas elegidos tienen menos frases que días a programar, se completan con frases de otros temas o se repiten solo cuando ya no quedan sin repetir.
- **App sin abrir durante semanas**: las notificaciones programadas se acaban tras el último día cubierto; la siguiente apertura las repone. Hasta entonces el usuario recibe las que quedaron programadas.
- **Cambio de zona horaria o de hora del sistema**: las notificaciones se disparan a la hora local programada; si el cambio es grande, se corrigen en la siguiente apertura de la app.
- **Reinicio del dispositivo**: las notificaciones programadas deben seguir vigentes.
- **Varias aperturas el mismo día**: reprogramar no debe duplicar notificaciones (siempre hay como máximo una por día).
- **Sin hora guardada**: si por alguna razón no hay hora elegida, no se programa nada.
- **App en primer plano a la hora de la notificación**: se muestra igualmente o no molesta; en ningún caso rompe la pantalla actual.
- **Idioma de la notificación**: el de la app en el momento de programar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cuando las notificaciones están activadas, el sistema DEBE entregar una notificación local por día, a la hora elegida (6:00, 12:00 o 18:00 hora local), sin conexión a internet.
- **FR-002**: Cada notificación DEBE contener una frase en el idioma de la app y su autor; las frases de días consecutivos DEBEN ser distintas mientras haya frases suficientes.
- **FR-003**: El sistema DEBE programar por adelantado las próximas notificaciones y reponerlas cada vez que se abre la app, de modo que no se agoten mientras el usuario use la app con regularidad.
- **FR-004**: Las frases DEBEN respetar los temas elegidos por el usuario; sin temas elegidos, pueden ser de cualquiera.
- **FR-005**: Al terminar de elegir la hora en el onboarding, las notificaciones DEBEN quedar activadas y el permiso del sistema DEBE pedirse en ese momento.
- **FR-006**: El interruptor «Notificaciones» de Ajustes DEBE reflejar el estado real (activado/desactivado) y DEBE controlar las notificaciones: activarlo las programa, desactivarlo cancela todas las pendientes.
- **FR-007**: Cambiar la hora, el idioma o los temas DEBE cancelar las notificaciones pendientes y reprogramarlas con los valores nuevos, sin dejar duplicados ni notificaciones a la hora anterior.
- **FR-008**: Si el permiso está denegado, el sistema DEBE mantener las notificaciones desactivadas, devolver el interruptor a apagado y explicar al usuario, en su idioma (ES/EN/FR), cómo permitirlas en los ajustes del sistema.
- **FR-009**: La app NO DEBE pedir el permiso de notificaciones al abrirse por primera vez; solo cuando el usuario elige la hora o activa el interruptor.
- **FR-010**: Tocar la notificación DEBE abrir la app en Home.
- **FR-011**: Los textos nuevos visibles (aviso de permiso denegado) DEBEN existir en ES, EN y FR (Principio II).
- **FR-013**: El paso de elegir la hora DEBE formar parte siempre del onboarding (entre el género y los temas), sin depender de configuración.
- **FR-014**: Si un usuario que ya terminó el onboarding antes de esta feature activa el interruptor sin tener hora guardada, el sistema DEBE usar 12:00 por defecto (modificable desde Ajustes).
- **FR-012**: Reprogramar NO DEBE dejar más de una notificación pendiente por día.

### Key Entities

- **Preferencias de notificación** (locales al dispositivo): activadas sí/no, hora elegida, idioma y temas (estos dos ya existen).
- **Notificación programada**: fecha y hora local, frase (texto en el idioma de la app) y autor; una por día.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con las notificaciones activadas, el usuario recibe exactamente una por día, a la hora elegida, sin conexión, durante al menos 30 días seguidos de uso regular de la app.
- **SC-002**: En 7 días consecutivos, las 7 frases recibidas son distintas entre sí.
- **SC-003**: Tras desactivar el interruptor, no llega ninguna notificación más (0 notificaciones en las 48 horas siguientes).
- **SC-004**: Tras cambiar la hora, la siguiente notificación llega a la hora nueva y no llega ninguna a la anterior.
- **SC-005**: Con el permiso denegado, el 100 % de los intentos de activar el interruptor terminan con el interruptor apagado y el aviso visible.
- **SC-006**: La app no muestra ningún diálogo de permiso de notificaciones antes de que el usuario elija la hora.

## Assumptions

- Se reemplaza el uso del permiso de notificaciones remotas al arrancar: no hay servidor que envíe notificaciones remotas, así que no tiene sentido pedir ese permiso antes de tiempo. El registro remoto solo se mantiene si el permiso ya fue concedido.
- La ventana de programación es de unas 30 notificaciones (límite práctico de la plataforma: iOS admite 64 pendientes por app).
- Una notificación no se marca como «vista» al enviarse; las frases «vistas» siguen siendo las que el usuario ve en Home.
- Fuera de alcance: notificaciones remotas (push desde servidor), sonidos personalizados, varias horas al día, acciones dentro de la notificación y ajustar la hora a minutos libres (solo 6, 12 y 18).
- Es compatible con el principio Local-First: todo ocurre en el dispositivo.
