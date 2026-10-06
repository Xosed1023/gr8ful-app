# Feature Specification: Widget de la Frase del Día

**Feature Branch**: `024-widget-frase-del-dia`

**Created**: 2026-10-03

**Status**: Completed (iOS; Android en fase 2)

**Input**: Candidata del `specs/BACKLOG.md` («Widget nativo»): mostrar la frase del día directamente en la pantalla de inicio del dispositivo, sin abrir la app.

## Decisiones de producto (2026-10-03)

1. **Plataformas**: primero **iOS**; Android queda para una segunda fase.
2. **Tamaño**: solo el **widget pequeño** (cuadrado) en esta versión.
3. **Contenido**: **una frase por día**, en el **idioma de la app**, que **cambia a medianoche** y respeta los temas elegidos. Es la **misma frase** que la notificación diaria de ese día.
4. **Estilo**: paleta del género del usuario, fondo de manchas y vidrio; los widgets siguen el tema claro u oscuro **del dispositivo**.
5. **Toque**: abre la app en Home. Sin botones dentro del widget.
6. **Estado vacío**: si la app aún no se ha abierto o no se terminó el onboarding, el widget muestra un mensaje amable en lugar de quedar en blanco.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver la frase del día sin abrir la app (Priority: P1)

Como usuario, quiero añadir un widget a mi pantalla de inicio que muestre la frase de hoy, para leerla cada vez que desbloqueo el teléfono.

**Why this priority**: Es el valor de la feature.

**Independent Test**: Terminar el onboarding, añadir el widget pequeño de Gr8ful a la pantalla de inicio y comprobar que muestra una frase con su autor. Pasada la medianoche, la frase es otra.

**Acceptance Scenarios**:

1. **Given** el onboarding terminado y la app abierta al menos una vez, **When** el usuario añade el widget pequeño, **Then** muestra la frase de hoy en el idioma de la app, con comillas tipográficas, y su autor.
2. **Given** el widget en pantalla, **When** pasa la medianoche, **Then** muestra la frase del nuevo día sin que el usuario abra la app.
3. **Given** el widget en pantalla, **When** el usuario lo toca, **Then** se abre la app en Home.
4. **Given** la notificación diaria activada, **When** llega la notificación de hoy, **Then** su frase es la misma que muestra el widget ese día.

---

### User Story 2 - El widget refleja mis preferencias (Priority: P1)

Como usuario, quiero que el widget use mi idioma, mis temas y mi estilo, para que se sienta parte de la app.

**Why this priority**: Un widget con otro idioma o tema que el de la app se sentiría ajeno.

**Independent Test**: Cambiar el idioma y los temas desde Ajustes, y comprobar que el widget se actualiza; repetir con mujer y hombre y con el dispositivo en modo claro y oscuro.

**Acceptance Scenarios**:

1. **Given** el usuario cambia el idioma de la app, **When** vuelve a la pantalla de inicio, **Then** el widget muestra la frase en el nuevo idioma.
2. **Given** el usuario cambia los temas, **When** se renueva el contenido, **Then** las frases futuras del widget corresponden a los nuevos temas.
3. **Given** género mujer u hombre, **When** se muestra el widget, **Then** usa los violetas (mujer) o los azules (hombre) de la app.
4. **Given** el dispositivo en modo claro u oscuro, **When** se muestra el widget, **Then** usa la versión clara u oscura de la paleta.

---

### User Story 3 - Estado vacío amable (Priority: P2)

Como usuario que añadió el widget antes de terminar el onboarding, quiero ver un mensaje claro en lugar de un recuadro en blanco.

**Why this priority**: La primera impresión del widget puede ocurrir antes de que existan datos.

**Independent Test**: Instalar la app, añadir el widget sin abrir la app y comprobar el mensaje; abrir la app, terminar el onboarding y comprobar que el widget pasa a mostrar la frase.

**Acceptance Scenarios**:

1. **Given** la app aún no tiene frases preparadas para el widget, **When** se muestra, **Then** aparece un mensaje de bienvenida que invita a abrir la app, en el idioma del dispositivo (ES, EN o FR; inglés por defecto).
2. **Given** el mensaje vacío en pantalla, **When** el usuario termina el onboarding, **Then** el widget se actualiza y muestra la frase del día.

---

### Edge Cases

- **Frase muy larga**: el texto se reduce hasta caber en el widget pequeño; nunca queda cortado a media palabra sin indicación (se recorta con puntos suspensivos solo como último recurso).
- **Pasan más de ~30 días sin abrir la app**: se acaban las frases preparadas; el widget conserva el último contenido o el mensaje amable hasta que se abra la app.
- **Cambio de idioma del dispositivo frente al de la app**: el widget usa el idioma de la **app**; el mensaje vacío usa el del dispositivo porque aún no hay preferencia guardada.
- **Cambio de zona horaria o de la hora del sistema**: el widget cambia de frase a medianoche local.
- **Varios widgets en pantalla**: todos muestran la misma frase del día.
- **Reinstalar la app**: se pierde el contenido compartido; el widget muestra el mensaje vacío hasta que se abra la app.
- **Privacidad**: la frase y las preferencias se comparten solo con el widget del propio dispositivo; no salen de él.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: En iOS, el sistema DEBE ofrecer un widget pequeño de Gr8ful en la galería de widgets.
- **FR-002**: El widget DEBE mostrar la frase del día, en el idioma de la app, con comillas tipográficas y su autor.
- **FR-003**: La frase DEBE cambiar a medianoche (hora local) sin que el usuario abra la app, mientras haya frases preparadas.
- **FR-004**: La app DEBE preparar por adelantado las frases de los próximos ~30 días (una por día) y reponerlas cada vez que se abre y cuando cambian el idioma o los temas.
- **FR-005**: La frase del día del widget DEBE ser la misma que la de la notificación diaria de ese día (plan diario único y estable entre aperturas).
- **FR-006**: El plan diario DEBE respetar los temas elegidos y priorizar frases aún no vistas.
- **FR-007**: El widget DEBE usar la paleta del género del usuario con fondo de manchas y tarjeta de vidrio, y la variante clara u oscura según el dispositivo.
- **FR-008**: Tocar el widget DEBE abrir la app en Home.
- **FR-009**: Si no hay contenido preparado, el widget DEBE mostrar un mensaje amable en ES, EN o FR según el idioma del dispositivo (EN por defecto).
- **FR-010**: Cambiar el idioma o los temas desde Ajustes DEBE reflejarse en el widget en el siguiente refresco del sistema, sin intervención del usuario.
- **FR-011**: El texto del widget DEBE ajustarse al espacio disponible sin desbordarse.
- **FR-012**: El intercambio de datos entre la app y el widget DEBE ser local al dispositivo (Principio I).

### Key Entities

- **Plan diario**: lista de ~30 días, cada uno con una frase asignada; fuente única para la notificación y el widget.
- **Contenido del widget**: idioma, género y, por día, frase y autor ya resueltos en el idioma de la app.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tras añadir el widget con la app ya configurada, la frase del día aparece sin abrir la app.
- **SC-002**: Durante al menos 30 días de uso regular, el widget muestra una frase distinta cada día sin intervención.
- **SC-003**: El 100 % de los días, la frase del widget coincide con la de la notificación de ese día (si está activada).
- **SC-004**: El widget cumple contraste de texto ≥ 4.5:1 en las 4 combinaciones de género y tema del dispositivo.
- **SC-005**: Con la app sin configurar, el widget muestra el mensaje amable en el 100 % de los casos, nunca un recuadro vacío.
- **SC-006**: Las notificaciones diarias siguen funcionando igual que antes de esta feature.

## Assumptions

- Plataforma de esta spec: **iOS** (iOS 17+, el mínimo del proyecto). Android queda para una spec posterior.
- El widget es código nativo (extensión de widget) porque el sistema lo dibuja sin la app en ejecución; comparte datos con la app mediante un grupo de la app, y el equipo de Apple Developer debe registrar ese grupo.
- La tipografía de la app (Montserrat) no está disponible en el widget; se usa la del sistema.
- El logo se representa con un símbolo del sistema (∞) como marca discreta, en vez del SVG completo, por tamaño.
- Fuera de alcance: widgets mediano y grande, pantalla de bloqueo, widgets interactivos, Android, y rotar idiomas durante el día.
- Cambios de configuración se reflejan cuando el sistema refresca el widget (hasta unas horas), salvo que la app lo pida explícitamente.
