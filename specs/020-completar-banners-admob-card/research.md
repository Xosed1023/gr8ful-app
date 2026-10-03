# Research: Completar Banners AdMob por Tarjeta

## Hallazgos del código y del plugin

- **H1 — El banner es una vista nativa.** `@capacitor-community/admob` 5.3.1 añade el `AdView` al contenedor de la actividad (Android) o a la vista raíz (iOS); no es un nodo del DOM, así que no se mueve con el scroll ni con las animaciones de la tarjeta.
- **H2 — Posicionamiento por margen.** `position: BOTTOM_CENTER` + `margin` = distancia al borde inferior. Android: `margin` (dp) como margen inferior del contenedor del contenido. iOS: `constant = -margin` respecto a `safeAreaLayoutGuide.bottom`. Un píxel CSS equivale a un dp/pt.
- **H3 — Un solo banner.** El plugin mantiene una única instancia de banner; `showBanner` de otro identificador sustituye al anterior. `hideBanner`/`resumeBanner` pausan y reanudan; `removeBanner` lo destruye.
- **H4 — Código previo retirado.** Commit `4d1ee27` quitó el render de banners (se mostraban con la tarjeta cerrada). Quedan `adBannerId` (calculado y sin uso), imports `BannerAd*` sin uso y `bottomAdSpace` (6 valores empíricos que ya no aplican).
- **H5 — `isTesting` como cadena.** El código antiguo pasaba `import.meta.env.VITE_IS_TESTING` directamente; al ser un string, `"false"` también contaría como verdadero. Se compara explícitamente con `"true"`.
- **H6 — Ionic mantiene las pestañas montadas.** Al cambiar de pestaña, Home no se desmonta; hay que usar el ciclo de vida de la vista (`useIonViewWillLeave` / `useIonViewDidEnter`) para ocultar y volver a mostrar.
- **H7 — Geometría de las tarjetas.** Las tarjetas son `absolute` con posiciones en `vh` (`colorConfig`); la expandida cubre desde su `expandedPosition` hasta el fondo. El contenido (frase `min-h-32`, fila de chip y botones) deja espacio suficiente para un slot de ~60 px en las tres.

## Decisión 1 — Posición: medir un slot del DOM en lugar de valores fijos

**Decision**: Cada tarjeta incluye un `div` de reserva (`slot`, transparente, ~60 px de alto) bajo la fila de chip y botones. Al terminar de abrirse, se mide con `getBoundingClientRect()` y `margin = round(window.innerHeight − rect.bottom)` (en iOS, además `− safeAreaBottom`, medido con un elemento de prueba con `padding-bottom: env(safe-area-inset-bottom)`). `margin` nunca es negativo.

**Rationale**: Los `bottomAdSpace` antiguos eran valores empíricos atados a una geometría que ya cambió (alturas, safe area, modo oscuro). Medir el slot sigue al diseño real en cualquier pantalla y plataforma (FR-002, FR-010).

**Alternatives considered**: Reutilizar `bottomAdSpace` — descartado (obsoletos, estaban pensados para tarjeta cerrada). Calcular a partir de `vh` — descartado (ignora safe area y alturas reales).

## Decisión 2 — Coordinador de banner único con pila y cola serializada

**Decision**: Módulo `cardBanner.ts` con: `showCardBanner({ownerId, adId, margin})`, `hideCardBanner(ownerId)`, `setHomeVisible(boolean)`. Mantiene una pila de tarjetas abiertas (la última es la activa, FR-004), una bandera de Home visible y una cola de promesas que aplica siempre el estado más reciente. Reglas: sin activa o Home oculto → `hideBanner`; misma tarjeta y mismo margen ya cargados → `resumeBanner`; en otro caso → `removeBanner` + `showBanner`.

**Rationale**: Evita carreras al abrir/cerrar rápido (edge case de la spec), garantiza un solo banner (H3) y centraliza el manejo de errores. Reabrir la misma tarjeta reanuda el banner en lugar de pedir un anuncio nuevo cada vez.

**Alternatives considered**: Llamar al plugin directo desde cada `CardPhrase` — descartado: tres tarjetas compitiendo por un único banner nativo y sin protección contra carreras.

## Decisión 3 — Cuándo mostrar

**Decision**: En `CardPhrase`, un estado `settledOpen` pasa a `true` en `onAnimationComplete` cuando la tarjeta está expandida y a `false` en cuanto se pulsa para cerrar. Un `useEffect` sobre `settledOpen` pide el banner (o lo oculta en la limpieza). `onAnimationComplete` también se dispara con la animación de entrada inicial: solo cuenta si `isExpanded`.

**Rationale**: FR-005 (no mostrar durante la animación) y FR-003 (ocultar de inmediato al cerrar). La limpieza del efecto cubre además el desmontaje.

## Decisión 4 — Salir de Home

**Decision**: `CardsContainer` ya usa `useIonViewWillEnter`; se añaden `useIonViewWillLeave` → `setHomeVisible(false)` y `useIonViewDidEnter` → `setHomeVisible(true)` (FR-007).

**Rationale**: H6. Al volver, si hay tarjeta abierta, el coordinador reanuda su banner.

## Decisión 5 — Tamaño del anuncio

**Decision**: `ADAPTIVE_BANNER` (el predeterminado del plugin, ancho completo y altura automática ~50-60 px). El slot reserva 60 px. Si el anuncio es más bajo, queda alineado al borde inferior del slot.

**Rationale**: El diseño muestra un recuadro de ~344×78 que es una reserva, no un formato AdMob; los formatos estándar caben en ese alto. El adaptativo ofrece mejor relleno que `BANNER` (320×50) sin superar el slot.

**Alternatives considered**: `LARGE_BANNER` (320×100) — descartado: más alto que el slot y puede tapar los botones en la tarjeta FR (la más baja).

## Decisión 6 — Fallos de carga y web

**Decision**: Escuchar `bannerAdFailedToLoad` una sola vez con `console.warn`; sin toast (la versión antigua mostraba un toast de error, que viola FR-006). Fuera de plataforma nativa (`Capacitor.isNativePlatform()` falso) el coordinador es no-op.

**Rationale**: FR-006 y desarrollo en navegador sin errores.

## Decisión 7 — Limpieza

**Decision**: Quitar `bottomAdSpace` de `colorConfig` y los imports `BannerAd*` de `CardPhrase.tsx`; `adBannerId` pasa a usarse (ya no es código muerto). Las 6 variables `VITE_*_CARD` se conservan (ahora se usan).

**Rationale**: FR-011 / SC-001 de la spec 011.

## Riesgos y preguntas abiertas

- **R1 — Margen en Android con borde a borde.** En Android 15 la app se dibuja bajo las barras del sistema; el contenedor del plugin puede no coincidir con `window.innerHeight`. Se mide en dispositivo; si hay desfase constante, se ajusta con una constante por plataforma en `bannerMargin.ts` (documentada en quickstart.md).
- **R2 — Anuncios reales.** Mientras AdMob/AdSense siguen en verificación (BACKLOG), solo se usan anuncios de prueba; no cambia aquí.
- **R3 — Teclado/rotación.** La app es vertical y Home no tiene entradas de texto; no se contempla.
- **R4 — Tarjetas superpuestas.** El banner nativo flota sobre cualquier tarjeta que quede por encima; se verifica que la tarjeta abierta más reciente sea la visible (FR-004).
