# Implementation Plan: Completar Toggle de Dark Mode (modo oscuro completo)

**Branch**: `develop` | **Date**: 2026-10-02 (reescrito; versión anterior del 2026-09-21 cubría solo el toggle) | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/019-completar-dark-mode-toggle/spec.md`

## Summary

El toggle de Ajustes ya está cableado, pero (a) la clase `ion-palette-dark` solo se aplica cuando se monta `Settings.tsx`, por lo que el tema no se restaura al abrir la app en otra pantalla (incumple FR-003/FR-011), y (b) el resto de la app usa colores fijos (CSS por pantalla, `variables.css`, clases Tailwind en `CardPhrase.tsx`, `Greetings.tsx`, `CardsContainer.tsx`, `.ionic-button`, `custom-toast`) que no reaccionan a la clase.

Enfoque: **tokens CSS** (variables) definidos en `:root` con los valores claros actuales y redefinidos bajo `.ion-palette-dark` con los valores del diseño de Figma; reemplazar cada color fijo por su token; aplicar la clase en el arranque, antes del primer render. Las paletas de mujer y hombre se resuelven con los selectores de clase que ya existen (`.background-woman` / `.background-man`) y con clases semánticas nuevas para las piezas que hoy usan ternarios `isMale ? ... : ...` en TSX.

## Technical Context

**Language/Version**: TypeScript ~5.1, CSS plano + Tailwind (sin cambios de versión)

**Primary Dependencies**: Ninguna nueva. `@ionic/react` ya aporta `@ionic/react/css/palettes/dark.class.css` (oscurece solo componentes Ionic). Tailwind ya instalado.

**Storage**: `localStorage.darkMode` y `localStorage.gender`, ya usados — sin cambios de mecanismo (Principio I)

**Testing**: `vitest` para la lógica de arranque (función que aplica la clase) y regresión (`npm run lint && npm run build && npm run test.unit`); verificación visual manual en emulador/navegador de las 16 pantallas del diseño (el color no es verificable con jsdom)

**Target Platform**: Android/iOS vía Capacitor; el navegador (`npm run dev`) sirve para la mayor parte de la verificación visual

**Constraints**:
- Con modo oscuro desactivado la app debe verse idéntica a hoy (FR-010): los valores de los tokens en `:root` son exactamente los colores fijos actuales.
- Sin destello claro al abrir (FR-011): la clase se aplica antes de `createRoot().render()`.
- Los banners AdMob (Principio IV) no cambian: no se tocan `bottomAdSpace` ni posiciones.
- Las tarjetas de Home usan posiciones/alturas en `colorConfig`; solo se reemplazan sus clases de color.

**Scale/Scope**: ~12 archivos de estilo/TSX tocados, 1 archivo nuevo opcional (`src/theme/dark.css`), 1 función de arranque. Ver [data-model.md](./data-model.md) para el inventario de tokens.

## Constitution Check

| Principio | Evaluación | Estado |
|---|---|---|
| I. Local-First / Sin Backend | Solo `localStorage`. Sin red. | PASS |
| II. Trilingüe Obligatorio | No se agregan textos nuevos; la etiqueta del toggle ya existe en EN/ES/FR (`darkModeButton`). | PASS |
| III. Mobile-First vía Capacitor | Verificación en emulador Android; se revisa el color de fondo de la ventana nativa para evitar destello (R2 en research.md). | PASS |
| IV. Monetización AdMob | Sin cambios en IDs, tamaños ni márgenes de banners. Se verifica que el banner no quede sobre una zona clara. | PASS |
| V. Reutilizar Antes de Duplicar | Se reutiliza `useUserGender`, las clases `background-woman/man` y la paleta Ionic existente; los tokens eliminan duplicación de hex repetidos en 8 CSS. | PASS |

Re-evaluado tras el diseño (Fase 1): sin cambios, todos PASS.

## Project Structure

### Documentation (this feature)

```text
specs/019-completar-dark-mode-toggle/
├── plan.md          # este archivo
├── research.md      # decisiones y riesgos
├── data-model.md    # inventario de tokens y mapeo claro → oscuro
├── quickstart.md    # guía de validación
└── tasks.md         # (siguiente paso: /speckit-tasks)
```

### Source Code (archivos afectados)

```text
src/
├── main.tsx                         # aplicar ion-palette-dark antes del primer render
├── theme/
│   ├── variables.css                # tokens :root + override .ion-palette-dark; .ionic-button, custom-toast, fondos
│   └── (dark.css opcional)          # si variables.css se vuelve demasiado largo
├── components/home/
│   ├── CardPhrase.tsx               # colorConfig: clases Tailwind → clases/tokens
│   ├── CardsContainer.tsx           # barra del autor por género → clase semántica
│   └── Greetings.tsx                # color del saludo por género → clase semántica
└── pages/
    ├── Welcome.css  Languages.css  Gender.css  QuoteTime.css  QuoteTopics.css
    ├── UserName.css  LoadingScreen.css  Settings.css      # colores fijos → tokens
    └── Settings.tsx                 # el useEffect de montaje deja de ser el único que aplica la clase
```

**Structure Decision**: sin carpetas nuevas. Los tokens viven en `src/theme/variables.css` (ya es el punto de entrada del tema); si crece demasiado se separa en `src/theme/dark.css` importado desde `variables.css`.

## Complexity Tracking

Sin violaciones de la constitución. La única decisión no trivial (tokens CSS frente a variante `dark:` de Tailwind) está justificada en research.md (Decisión 1).
