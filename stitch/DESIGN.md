---
name: Gr8ful — Serene Glass Stationery
description: Sistema de diseño vigente de Gr8ful (regenerado desde src/ el 2026-10-03, tras el rediseño con Stitch).
colors:
  # Lienzo y texto (tema claro)
  background: '#F8F6F6'
  surface: '#FFFFFF'
  on-surface: '#000000'
  on-surface-muted: '#506A7B'
  accent-text: '#19104C'
  # Acentos por género
  woman-accent: '#5602D3'
  woman-accent-vibrant: '#6F36EB'
  man-accent: '#006493'
  man-accent-soft: '#3C91C7'
  # Tarjetas de frase — mujer
  card-woman-1: '#0EA5E9'
  card-woman-1-text: '#0C4A6E'
  card-woman-2: '#A78BFA'
  card-woman-2-text: '#581C87'
  card-woman-3: '#C4B5FD'
  card-woman-3-text: '#312E81'
  # Tarjetas de frase — hombre
  card-man-1: '#61B2E4'
  card-man-1-text: '#17537A'
  card-man-2: '#5A9ABE'
  card-man-2-text: '#154C6B'
  card-man-3: '#95C5DE'
  card-man-3-text: '#0D4461'
  # Cabeceras y barras
  header-navy: '#0F172A'
  settings-header-woman: '#19104C'
  settings-header-man: '#0D3A5C'
  author-bar-woman: '#1E1B4B'
  author-bar-man: '#1C2742'
  # Tema oscuro
  background-dark: '#0F1220'
  background-dark-man: '#0C1520'
  on-surface-dark: '#ECEAF4'
  on-surface-muted-dark: '#A9A7BD'
  woman-accent-dark: '#A58BFF'
  man-accent-dark: '#8FC4E8'
  nav-dark: '#0B0F1C'
  # Estados
  destructive: '#FF709D'
typography:
  display-greeting: {fontFamily: Montserrat, fontSize: 36px, fontWeight: '700'}
  header-panel: {fontFamily: Montserrat, fontSize: 30px, fontWeight: '700'}
  headline-onboarding: {fontFamily: Montserrat, fontSize: 24px, fontWeight: '500', lineHeight: 1.35}
  headline-script: {fontFamily: Playwrite DE SAS, fontWeight: '700'}
  card-phrase: {fontFamily: Montserrat, fontSize: 18px, fontWeight: '500', lineHeight: 1.55}
  button-primary: {fontFamily: Montserrat, fontSize: 18px, fontWeight: '600'}
  row-title: {fontFamily: Montserrat, fontSize: 15px, fontWeight: '600'}
  topic-chip: {fontFamily: Montserrat, fontSize: 16px, fontWeight: '500'}
  caption: {fontFamily: Montserrat, fontSize: 12px, fontWeight: '400'}
rounded:
  input: 10px
  row: 16px
  option: 20px
  card: 24px
  sheet: 32px
  header-bottom: 44px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  safe-bottom-nav: 84px
---

# Gr8ful — Serene Glass Stationery

App móvil vertical de frases motivacionales y aprendizaje de idiomas (EN · ES · FR). Ionic 8 + React + Tailwind sobre Capacitor (iOS y Android). Todos los valores salen de `src/theme/variables.css` y del kit compartido (`src/components/common/OnboardingKit.css`, `src/components/home/HomeKit.css`); si algo cambia ahí, este documento debe actualizarse.

## Brand & Style

Tono **sereno, íntimo y de papelería de lujo**: mucho aire, lienzos casi planos con manchas de color difuminadas, tarjetas de vidrio esmerilado y tipografía geométrica limpia con un acento manuscrito en una sola palabra de cada título.

- **Doble identidad por género.** Dos paletas completas, elegidas en el onboarding: **mujer** (violetas, lilas y ciruelas) y **hombre** (azules glaciares y cian). Condiciona fondos, acentos, tarjetas, barra del autor, saludo y botones de acción.
- **Dos temas.** Claro (por defecto) y oscuro (clase `ion-palette-dark` en `<html>`, activable en Ajustes). Todo color vive como token CSS.
- **Vidrio y capas.** Las superficies flotan (píldoras, tarjetas, menús) con fondo translúcido, desenfoque y sombras suaves; la profundidad viene del apilado más que de sombras duras.
- **Movimiento orgánico.** Resortes en vez de duraciones fijas; los botones se encogen al pulsar; háptico en toda interacción con botones (desactivable en Ajustes).

## Colors

### Base (claro → oscuro)

| Rol | Token | Claro | Oscuro |
|---|---|---|---|
| Fondo de pantalla | `--background-color` | `#F8F6F6` | `#0F1220` (hombre: `#0C1520` en Home) |
| Superficie / hoja | `--surface` | `#FFFFFF` | `#0F1220` |
| Texto principal | `--text-color` | `#000000` | `#ECEAF4` |
| Texto secundario | `--text-muted` | `#506A7B` | `#A9A7BD` |
| Texto de acento | `--accent-text` | `#19104C` | `#C9BDF5` |
| Cabecera / barra | `--header-bg`, `--nav-bg` | `#0F172A` | `#0B0F1C` |
| Vidrio (píldoras, menús) | `--glass-bg` | `rgba(255,255,255,.8)` | `rgba(26,29,46,.7)` |
| Hoja flotante (Ajustes) | `--sheet-bg` | `rgba(255,255,255,.9)` | `rgba(26,29,46,.88)` |
| Fila de lista | `--row-bg` | `rgba(245,243,243,.7)` | `rgba(255,255,255,.06)` |

### Acento por género (indicador de pasos, selección, interruptores, etiquetas)

| | Claro | Oscuro |
|---|---|---|
| Mujer | `--step-active` `#5602D3` | `#A58BFF` |
| Hombre | `#006493` | `#8FC4E8` |

Los acentos de hombre se aplican con la clase `.man` sobre el contenedor de la pantalla.

### Manchas de fondo del onboarding

Cinco manchas circulares difuminadas sobre el lienzo: lila arriba a la izquierda, azul claro a la derecha, violeta pálido abajo, y dos centrales (una con pulso suave). Claro: `rgba(217,172,253,.35)`, `rgba(141,205,255,.45)`, `rgba(232,221,255,.35)`. Oscuro: `rgba(74,39,168,.40)`, `rgba(30,95,138,.45)`, `rgba(91,63,168,.30)`.

### Tarjetas de frase

| Tarjeta | Mujer (fondo / texto) | Hombre (fondo / texto) |
|---|---|---|
| 1 · EN | `#0EA5E9` / `#0C4A6E` | `#61B2E4` / `#17537A` |
| 2 · ES | `#A78BFA` / `#581C87` | `#5A9ABE` / `#154C6B` |
| 3 · FR | `#C4B5FD` / `#312E81` | `#95C5DE` / `#0D4461` |
| Oscuro 1 · 2 · 3 | `#1E5F8A` · `#4C2A85` · `#5B3FA8` (texto `#F0F9FF`–`#F5F3FF`) | `#1E5F8A` · `#1B5073` · `#2A6F96` (texto `#E6F3FA`) |

Cada tarjeta lleva además un brillo suave arriba (`--card-sheen`) y un filo claro en el borde superior (`--card-edge`).

### Burbujas de icono (Ajustes, menú de compartir)

Cada ajuste tiene su tinte: lila `#E8DDFF`/`#5602D3` (idioma), azul `#CAE6FF`/`#006493` (hora), ciruela `rgba(207,189,255,.6)`/`#19104C` (temas), gris `#E4E2E2`/`#494455` (interruptores). En hombre, idioma y temas pasan a azules. Todos con versión oscura.

### Botón principal

Negro `#000`/blanco en claro; `#ECEAF4`/`#0F1220` en oscuro. En el onboarding, el botón CTA es una píldora con degradado y flecha: `#19104C` (bienvenida), violeta `#6F36EB` (mujer) o azul `#3C91C7` (hombre).

## Typography

- **Montserrat** (400–700) para toda la interfaz.
- **Playwrite DE SAS** (700), manuscrita, **solo** para una palabra de énfasis por título (clase `text-highlight`) y el logotipo. Nunca en párrafos.

| Uso | Tamaño | Peso |
|---|---|---|
| Saludo de Home | 36 px | 700 |
| Título de Ajustes / Favoritos | 30 px | 700 |
| Título de onboarding | 24 px | 500 |
| Frase en tarjeta | 18 px, interlineado 1.55 | 500 |
| Botón principal / CTA | 18 px | 600 |
| Tema (chip) | 16 px | 500 |
| Título de fila | 15 px | 600 |
| Subtítulo, etiquetas, notas | 12–14 px | 400–600 |
| Etiqueta de paso («PASO 3 DE 5») | 12 px, mayúsculas, tracking .05em | 600 |

## Layout & Spacing

- **Mobile-first, solo vertical** (bloqueado en iOS y Android). Zonas seguras con `env(safe-area-inset-*)`.
- **Onboarding:** 5 pasos (Idioma, Género, Hora, Temas, Nombre). Estructura fija: botón atrás de vidrio arriba a la izquierda, píldora indicadora de pasos centrada arriba, etiqueta de paso, título, subtítulo opcional, opciones y nota. Contenido centrado en vertical salvo Temas (alineado arriba). Las pantallas de edición abiertas desde Ajustes van pegadas arriba.
- **Home:** saludo arriba; tres tarjetas apiladas desde el borde inferior (posiciones 30 / 45 / 60 vh, expandidas 10 / 28 / 46 vh); pie con barra del autor y fila «Renovar inspiración»; barra de pestañas flotante.
- **Ajustes:** cabecera índigo decorativa con esquinas inferiores de 44 px y una **tarjeta flotante** de 32 px que se monta ~56 px sobre ella.
- **Favoritos:** cabecera con título y contador sobre una hoja redondeada con tarjetas de frase.
- **Espaciado:** 4 · 8 · 12 · 16 · 24 px; márgenes laterales de 24 px; reserva inferior de 84 px + zona segura para la barra flotante.

## Elevation & Depth

Vidrio esmerilado con `backdrop-filter: blur(12–24px)`, sombras suaves (`0 4px 6px -1px rgba(0,0,0,.1)` en claro; más intensas en oscuro), un único filo claro en el borde superior de las tarjetas y sombra hacia arriba (`-2px -2px 10px -2px rgba(0,0,0,.45)`) en las tarjetas de Home y la barra del autor. En oscuro la jerarquía se marca por saltos tonales: `#0B0F1C` → `#0F1220` → `#1A1D2E`.

## Shapes

Esquinas muy redondeadas: píldoras (`9999px`) para botones, chips, indicadores y barra flotante; 32 px en hojas flotantes; 24 px en tarjetas, tarjetas de opción y campos; 20 px en tarjetas de frase guardada y botones de opción; 16 px en filas de lista; 12 px en burbujas de icono; 44 px en la cabecera de Ajustes (solo abajo). Las tarjetas de frase de Home redondean **solo las esquinas superiores**.

## Components

- **Botón atrás de vidrio:** círculo de 44 px, flecha, a `safe-top + 0.5rem` del borde.
- **Indicador de pasos:** píldora de vidrio con cinco puntos; el activo es más grande, del color de acento, con brillo y pulso suave.
- **Etiqueta de paso:** píldora de vidrio con punto que emite un anillo y texto en mayúsculas.
- **Tarjeta de opción (idioma, género, hora):** píldora de vidrio de ancho completo (64 px; 80 px con icono), nombre a la izquierda y círculo de selección a la derecha. Al elegir: se tiñe, se enmarca, el check rebota, las demás se atenúan, el contenido sale deslizándose y se navega.
- **Tema (chip):** píldora de vidrio de 56 px en rejilla de 2 columnas; elegido: tinte del género y check.
- **Campo de nombre:** tarjeta de vidrio de 24 px con etiqueta en mayúsculas, texto grande de 22 px sin borde y chip de confirmación.
- **Botón CTA:** píldora de 52 px con degradado sutil, flecha y sombra; deshabilitado al 40 %.
- **Tarjeta de frase (Home):** etiqueta de idioma en mayúsculas, frase con comillas tipográficas (“ ” en inglés, « » en español y francés), chip de tipo con destello, tres botones circulares de vidrio (favorito, compartir, copiar) y un espacio reservado de 60 px para el banner publicitario.
- **Pie de Home:** barra del autor (— Autor —) y fila «Renovar inspiración».
- **Barra de pestañas flotante:** píldora de vidrio de 60 px con icono y texto; un resaltado se desliza con un resorte entre las tres pestañas. Se oculta al editar desde Ajustes.
- **Fila de Ajustes:** burbuja de icono de 44 px, título, subtítulo con el valor actual, flecha o interruptor.
- **Interruptor:** píldora de 52 × 28 px con bolita blanca que se desliza.
- **Menú de compartir:** hoja inferior con «Como imagen / Como texto»; la vista previa a pantalla completa permite elegir **Historia 9:16** o **Cuadrado 1:1**.
- **Imagen para compartir:** lienzo con las manchas de la paleta, tarjeta de vidrio con etiqueta de idioma, frase, autor y el logo como marca de agua.
- **Pantalla de carga:** un cometa de luz recorre el ∞ del logo; ES · EN · FR se encienden por turnos; barra de progreso de 3 s.
- **Toast:** cápsula con fondo `--toast-bg`, mensaje en cursiva.

## Do's and Don'ts

- **Sí:** usar tokens (`var(--…)`) para todo color; mantener la paleta de un solo género por pantalla; contraste ≥ 4.5:1 sobre cada tarjeta; una sola palabra manuscrita por título; respetar «reducir movimiento».
- **No:** hex fijos en componentes; mezclar morados y azules en una pantalla; sombras duras o bordes gruesos; Playwrite en párrafos; tapar los botones de la tarjeta con anuncios.
- **Textos:** todo texto visible existe en ES, EN y FR; los contenedores deben crecer sin desbordar.
- **Anuncios:** el banner nativo flota sobre la web; se oculta mientras hay menús abiertos y vive dentro del espacio reservado de la tarjeta.

## Guía rápida para generar pantallas nuevas

> Pantalla móvil vertical de Gr8ful, estilo vidrio esmerilado sereno. Fondo `#F8F6F6` con cinco manchas de color difuminadas (lila `rgba(217,172,253,.35)` arriba a la izquierda, azul claro `rgba(141,205,255,.45)` a la derecha, violeta pálido abajo). Botón atrás circular de vidrio de 44 px y una píldora de vidrio con cinco puntos como indicador de pasos. Etiqueta de paso en mayúsculas, título de 24 px / 500 con una palabra en Playwrite DE SAS 700, subtítulo de 14 px atenuado. Opciones en píldoras de vidrio de ancho completo con círculo de selección a la derecha; botón CTA en píldora de 52 px con degradado y flecha. Esquinas muy redondeadas (24–32 px), sombras suaves. Modo oscuro: fondo `#0F1220`, texto `#ECEAF4`, acento `#A58BFF`. Versión masculina: sustituir violetas por azules (acento `#006493`, tarjetas `#61B2E4`, `#5A9ABE`, `#95C5DE`).
