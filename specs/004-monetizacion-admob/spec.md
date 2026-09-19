# Feature Specification: Monetización con AdMob

**Feature Branch**: `004-monetizacion-admob`

**Created**: 2026-09-18

**Status**: ✅ Implementado (línea base retroactiva) — con deuda técnica asociada

**Input**: Documentación del estado actual del código, no una nueva feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Anuncio intersticial periódico (Priority: P1)

Mientras usa la app, al usuario se le muestra un anuncio intersticial cada 45 segundos si no hay uno visible.

**Why this priority**: Fuente principal de monetización pasiva.

**Independent Test**: Con AdMob inicializado en `MainHome`, esperar 45s sin interacción y verificar que se dispara `showAdMobInterstitial()`.

**Acceptance Scenarios**:

1. **Given** la app está en `MainHome` y no hay anuncio visible, **When** pasan 45 segundos, **Then** se muestra un intersticial con IDs específicos por plataforma (iOS/Android).
2. **Given** el intersticial fue descartado (`Dismissed`) o falló al cargar (`FailedToLoad`), **When** ocurre el evento, **Then** el listener correspondiente actualiza el estado interno (`isAdVisible`).

---

### User Story 2 - Rewarded ad para nueva frase (Priority: P2)

El usuario toca de nuevo el tab "home" para forzar una nueva frase, lo que dispara un anuncio recompensado; si lo completa, recibe una frase nueva.

**Why this priority**: Incentiva ver anuncios adicionales a cambio de valor real (frase nueva) sin depender solo de intersticiales pasivos.

**Independent Test**: Tocar el tab "home" estando ya en Home y verificar `loadRandomPhraseWithAd()`.

**Acceptance Scenarios**:

1. **Given** el usuario toca el tab "home" estando en Home, **When** el rewarded ad se completa, **Then** se carga una nueva frase aleatoria.

---

### Edge Cases

- TODO explícito en código: falta animación para ocultar/mostrar tarjetas tras un rewarded exitoso (`MainHome.tsx` línea ~165).
- TODOs explícitos: verificar que el usuario esté en Home antes de recargar, y solicitar el anuncio correctamente al tocar el tab (`MainHome.tsx` líneas ~227-228) — posible comportamiento incompleto/no verificado.
- Banners por tarjeta calculados pero nunca renderizados (ver spec `completar-banners-admob-card`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE inicializar AdMob al entrar a `MainHome`.
- **FR-002**: El sistema DEBE mostrar un intersticial cada 45s de inactividad si no hay anuncio visible.
- **FR-003**: El sistema DEBE mostrar un rewarded ad al re-tocar el tab "home", y solo cargar frase nueva si se otorga la recompensa.
- **FR-004**: Los IDs de anuncio DEBEN diferenciarse por plataforma (iOS/Android) vía variables de entorno.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los intersticiales se muestran de forma consistente cada ~45s sin bloquear la interacción básica de la app.
- **SC-002**: El flujo de rewarded ad nunca entrega una frase nueva sin que la recompensa haya sido otorgada por AdMob.

## Implementación actual (archivos)

- `src/pages/MainHome.tsx` — inicialización de AdMob, lógica de intersticial (45s) y rewarded ad, listeners, TODOs pendientes.
- `.env` — IDs de AdMob por plataforma (`VITE_*_INTERSTICIAL*`, etc.).

## Assumptions

- La cadencia de 45s y el modelo intersticial+rewarded son decisiones de producto ya tomadas (commit `0f1df76`) — no se cuestionan en esta spec, solo se documentan.
