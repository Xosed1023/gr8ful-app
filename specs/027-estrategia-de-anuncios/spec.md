# Feature Specification: Estrategia de Anuncios (intersticiales por eventos)

**Feature Branch**: `027-estrategia-de-anuncios`

**Created**: 2026-10-08

**Status**: Completed

**Input**: Hoy el intersticial sale cada 45 s por temporizador. Se busca maximizar los ingresos sin dañar la retención: la app se usa en sesiones muy cortas (leer la frase, quizá compartirla, salir; o entrar desde el widget).

## Principios de UX de anuncios

1. **Valor primero, anuncio después**: el anuncio aparece tras una acción completada por el usuario, nunca mientras lee ni al abrir la app.
2. **Frecuencia limitada y persistente**: los límites cuentan entre sesiones (reloj real), no por sesión; si no, un usuario de sesiones cortas nunca los vería y uno que abre la app 10 veces seguidas los vería todos.
3. **Gracia inicial**: sin intersticiales en las primeras 24 h; lo que más retención compra es una primera impresión limpia.
4. **El usuario manda**: el anuncio recompensado (renovar frase, rescatar racha) es voluntario y el mejor pagado; tras verlo se concede un respiro sin intersticiales.
5. **Nunca interrumpir**: ni con una tarjeta abierta, ni con el menú de compartir, ni inmediatamente tras otro anuncio.
6. **Sin esperas**: si el anuncio no está listo, no se muestra y no se hace esperar al usuario.
7. Los banners por tarjeta (spec 020) y el rewarded no cambian.

## Decisiones de producto (2026-10-08)

- Se elimina el temporizador de 45 s.
- **Disparadores** (momentos de valor): cerrar una tarjeta tras leerla (1 punto), copiar una frase (1), compartirla como texto o imagen (2).
- **Un anuncio cada 3 puntos** acumulados desde el último anuncio.
- **Separación mínima de 4 minutos** entre anuncios (reloj real, entre sesiones).
- **Tope de 3 intersticiales al día** (día local).
- **Gracia de 24 h** desde el primer uso.
- **Respiro de 10 minutos** sin intersticiales tras ver un anuncio recompensado.
- Parámetros ajustables en una sola constante para calibrarlos con datos reales.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - No me interrumpen mientras leo (Priority: P1)

**Independent Test**: Abrir la app, dejarla un par de minutos en Home y con una tarjeta abierta: no sale ningún intersticial.

**Acceptance Scenarios**:
1. **Given** la app abierta sin interactuar, **When** pasan varios minutos, **Then** no aparece ningún intersticial.
2. **Given** un usuario nuevo, **When** abre, lee, comparte y cierra tarjetas durante sus primeras 24 h, **Then** no ve intersticiales.

### User Story 2 - Un anuncio tras una acción completada (Priority: P1)

**Independent Test**: Pasadas 24 h de uso, cerrar/copiar/compartir hasta sumar 3 puntos: aparece un intersticial tras la acción.

**Acceptance Scenarios**:
1. **Given** 24 h de uso y 3 puntos acumulados, **When** cierro una tarjeta, **Then** aparece un intersticial poco después, sin tapar la animación de cierre.
2. **Given** un anuncio mostrado hace menos de 4 minutos, **When** acumulo 3 puntos, **Then** no aparece otro todavía; sale en la primera acción posterior a los 4 minutos.
3. **Given** 3 anuncios mostrados hoy, **When** sigo usando la app, **Then** no salen más hasta mañana.
4. **Given** un anuncio recompensado visto hace menos de 10 minutos, **When** acumulo 3 puntos, **Then** no sale intersticial.
5. **Given** el anuncio aún no cargó, **When** se cumple la regla, **Then** no se muestra ni hay espera, y se reintenta en la siguiente acción.
6. **Given** otra tarjeta abierta o el menú de compartir abierto, **When** se cumple la regla, **Then** no se muestra.

### User Story 3 - Los límites sobreviven a cerrar la app (Priority: P2)

**Acceptance Scenarios**:
1. **Given** un anuncio mostrado y la app cerrada, **When** la reabro a los 2 minutos, **Then** sigue vigente la separación de 4 minutos.

### Edge Cases

- Cambio de día con la app abierta: el contador diario se reinicia.
- Reloj del dispositivo atrasado: no se rompe (se trata como «aún no»).
- Datos guardados corruptos: se tratan como estado inicial con gracia de 24 h.
- Sin conexión o sin anuncio cargado: nunca bloquea la acción del usuario.
- Web (navegador): no hace nada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El intersticial MUST dejar de depender de temporizadores.
- **FR-002**: Un intersticial solo MAY mostrarse tras un momento de valor (cerrar tarjeta, copiar, compartir).
- **FR-003**: MUST cumplirse a la vez: gracia de 24 h, ≥ 3 puntos desde el último anuncio, ≥ 4 min desde el último, < 3 en el día y fuera del respiro de un rewarded.
- **FR-004**: El estado MUST persistir en el dispositivo (`localStorage`).
- **FR-005**: Si el anuncio no está cargado, MUST NOT esperar ni bloquear; el anuncio se precarga tras iniciar AdMob y tras cada uno mostrado.
- **FR-006**: Tras mostrarse un rewarded, MUST aplicarse un respiro de 10 minutos.
- **FR-007**: MUST NOT mostrarse con una tarjeta abierta ni con el menú de compartir abierto.
- **FR-008**: Los parámetros MUST estar centralizados en una sola constante.

### Key Entities

- **Estado de anuncios**: primer uso, último anuncio, respiro hasta, día y cuenta del día, puntos acumulados. Persistido en `localStorage.adPolicy`.

## Success Criteria *(mandatory)*

- **SC-001**: La política tiene tests para todas las reglas y los bordes.
- **SC-002**: En un dispositivo, ningún intersticial aparece sin acción del usuario, y respetando los límites.
- **SC-003**: Ya no queda código de temporizador de anuncios.

## Assumptions

- Se mantienen los IDs de prueba hasta resolver el bloqueante de AdMob (producción y UMP/GDPR).
- Los valores iniciales son una hipótesis razonable; conviene recalibrarlos con datos de retención e ingresos.
- Fuera de alcance (ideas para el backlog): anuncio nativo o banner en Favoritos, premios del rewarded (p. ej. temas extra de imagen al compartir), formato App Open para quien solo lee desde el widget.
