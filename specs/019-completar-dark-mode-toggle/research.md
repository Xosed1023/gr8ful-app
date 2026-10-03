# Research: Completar Toggle de Dark Mode (modo oscuro completo)

Reescrito el 2026-10-02. La versión anterior concluía «no hay decisión de diseño que tomar»; la verificación manual demostró lo contrario (ver Hallazgos).

## Hallazgos del código (base de las decisiones)

- **H1 — La clase solo se aplica en Ajustes.** `ion-palette-dark` se alterna en un `useEffect` de montaje de `Settings.tsx`. Al abrir la app en Home con el modo oscuro persistido, el tema no se aplica hasta visitar Ajustes. Incumple FR-003 («cualquier pantalla») y FR-011 (sin destello).
- **H2 — La paleta Ionic no cubre los estilos propios.** `dark.class.css` redefine variables `--ion-*`; no toca los hex fijos de los CSS de pantalla, `variables.css`, ni las clases Tailwind.
- **H3 — Colores fijos repartidos en 8 CSS + 3 TSX**: `Welcome`, `Languages`, `Gender`, `QuoteTime`, `QuoteTopics`, `UserName`, `LoadingScreen`, `Settings` (CSS) y `CardPhrase`, `CardsContainer`, `Greetings` (TSX), más `variables.css` (`--background-color`, `.ionic-button`, `custom-toast`, `.background-woman/man`).
- **H4 — El género se resuelve en TSX con `useUserGender()`** y se traduce a clases (`background-woman` / `background-man`) o a ternarios `isMale ? ... : ...` (autor, saludo). El género solo se elige en el onboarding (`Gender.tsx`); no hay selector de género en Ajustes.
- **H5 — Las tarjetas ya tienen una entrada de color por género** (`CardColors.WOMAN_*` / `MAN_*` en `colorConfig`), así que no necesitan lógica de género adicional para oscuro, solo cambiar sus clases de color.
- **H6 — Welcome usa ambos degradados (cian y morado)** porque aún no hay género elegido; en oscuro debe mantener esa mezcla atenuada.

## Decisión 1 — Tokens CSS en lugar de variante `dark:` de Tailwind

**Decision**: Definir tokens (`--bg`, `--text`, `--text-muted`, `--accent`, `--btn-bg`, `--btn-text`, `--nav-bg`, `--card-*-bg/text`, `--author-bar-*`, gradientes…) en `:root` con los valores claros actuales, y redefinirlos en `.ion-palette-dark`. Los CSS y las clases Tailwind arbitrarias (`bg-[var(--x)]`) consumen los tokens.

**Rationale**: Los estilos están repartidos en CSS planos y Tailwind; los tokens funcionan en ambos sin configuración extra. Un único interruptor (la clase en `<html>`) ya existe. Garantiza FR-010 (los valores de `:root` son los actuales).

**Alternatives considered**: `darkMode: 'selector'` de Tailwind con variantes `dark:` — descartado: no cubre los 8 CSS planos y obligaría a duplicar cada color en dos sintaxis.

## Decisión 2 — Dónde se aplica la clase al arrancar

**Decision**: Una función `applyStoredTheme()` (p. ej. en `src/theme/`) que lee `localStorage.darkMode` y alterna `ion-palette-dark` en `document.documentElement`; se llama en `main.tsx` **antes** de `createRoot(...).render(...)`. `Settings.tsx` conserva el alternado inmediato al cambiar el toggle (reutilizando la misma función) y deja de depender del `useEffect` de montaje.

**Rationale**: Resuelve H1 y FR-011; reutiliza la lógica en lugar de duplicarla (Principio V). La lectura es síncrona y local.

**Alternatives considered**: Script inline en `index.html` — descartado: el CSS ya se importa desde `main.tsx` y la ejecución de `main.tsx` ocurre antes del primer render de React; el inline añade una segunda fuente de verdad.

## Decisión 3 — Paletas por género sin lógica nueva

**Decision**: Reutilizar los selectores existentes (`.background-woman`, `.background-man`) para fondos/degradados, y reemplazar los ternarios de `Greetings.tsx` y `CardsContainer.tsx` por clases semánticas (`greeting-woman|man`, `author-bar-woman|man`) cuyos colores salen de tokens. Las tarjetas cambian solo el valor de color por entrada de `colorConfig`.

**Rationale**: El género ya determina estas clases (H4/H5); no se necesita atributo `data-gender` ni estado nuevo.

**Alternatives considered**: `data-gender` en `<html>` y selectores `:root[data-gender=M].ion-palette-dark` — descartado por añadir estado global que hay que mantener sincronizado.

## Decisión 4 — Valores de color

**Decision**: Los de la sección «Referencia de diseño» de `spec.md` (Figma, 16 pantallas). Mapeo completo claro → oscuro en [data-model.md](./data-model.md).

**Rationale**: Diseño aprobado por el usuario.

## Decisión 5 — Texto de botones de contraste invertido

**Decision**: En oscuro, `.ionic-button` y los botones del onboarding (`Gender`, `Languages`, `QuoteTime`) usan `--btn-bg` claro y `--btn-text` igual al fondo de pantalla. Cualquier texto «blanco fijo» sobre esos botones pasa a `--btn-text`.

**Rationale**: Es el defecto detectado en el diseño (Step 1: «A woman» / «A man» casi blanco sobre botón claro); se corrige en código y se confirma en el diseño.

## Riesgos y preguntas abiertas

- **R1 — Spec: «cambiar género desde Ajustes».** El escenario 3 de la User Story 3 asume un selector de género en Ajustes que no existe (H4). Se reescribe como «al elegir otro género en el onboarding». No cambia el plan.
- **R2 — Destello nativo.** Antes de que el WebView pinte, la ventana Android/iOS puede mostrar su color de fondo (blanco). Si el destello aparece en la verificación, ajustar `backgroundColor` de la ventana nativa / splash. No bloquea la implementación del tema.
- **R3 — Contraste (SC-004).** Los valores de Figma son una propuesta: se mide el contraste de texto en cada tarjeta durante la verificación y se ajusta el token si queda por debajo de 4.5:1.
- **R4 — Logo.** Imagen estática sin recolorear: fuera de alcance (spec.md, Assumptions).
- **R5 — Diseño sin revisar.** Quedan pantallas dark de Figma sin inspeccionar visualmente (ver spec.md). Se confirman al implementar; los tokens son fácilmente ajustables.
