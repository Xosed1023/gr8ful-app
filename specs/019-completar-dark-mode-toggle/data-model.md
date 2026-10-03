# Data Model: Completar Toggle de Dark Mode (modo oscuro completo)

No hay entidades de persistencia nuevas. Se documentan los datos que ya existen y el **inventario de tokens de tema**, que es el contrato entre el diseño (Figma) y el código.

## Datos persistidos (sin cambios)

| Clave `localStorage` | Valores | Uso |
|---|---|---|
| `darkMode` | `"true"` / `"false"` / ausente (= claro) | Decide si `<html>` lleva la clase `ion-palette-dark` |
| `gender` | `"W"` / `"M"` / ausente (= `"W"`) | Decide la paleta de género (vía `useUserGender`) |

## Estado derivado

`ion-palette-dark` en `document.documentElement`:

- Se calcula al arrancar (`main.tsx`, antes del primer render) y al cambiar el toggle de Ajustes.
- Misma función en ambos sitios (`applyStoredTheme()`), para que haya una sola fuente de verdad.

## Inventario de tokens

Los tokens se definen en `:root` con el **valor claro actual** (FR-010) y se redefinen en `.ion-palette-dark` con el valor del diseño. Los nombres son una propuesta; lo contractual es el mapeo de valores.

### Comunes

| Token | Claro (actual) | Oscuro | Se usa en |
|---|---|---|---|
| `--background-color` | `#F8F6F6` | `#0F1220` (mujer) / `#0C1520` (hombre) | fondo de pantallas, `.background*` |
| `--text-color` | `#000000` | `#ECEAF4` | títulos, textos, bordes de chips |
| `--text-muted` | `#506A7B` / `#706589` | `#A9A7BD` | subtítulos, iconos secundarios |
| `--accent-text` | `#6F4BF2` | `#A58BFF` | palabras destacadas |
| `--btn-bg` | `#000000` | `#ECEAF4` | `.ionic-button`, botones de onboarding |
| `--btn-text` | `#FFFFFF` | = fondo de pantalla | texto de esos botones |
| `--btn-accent-bg` | `#6F4BF2` | sin cambio | «Next», «Finish» |
| `--nav-bg` | `#010326` | `#0B0F1C` | barra de navegación inferior |
| `--toast-bg` / `--toast-text` | `#F4F4FA` / `#4B4A50` | `#2A2D40` / `#ECEAF4` | `ion-toast.custom-toast` |
| `--chip-off-bg` | `#BCB7CD` / `#B7C1CD` | `#3A3F55` | chips/toggles apagados |

### Fondos y degradados

| Token | Claro (actual) | Oscuro |
|---|---|---|
| `--gradient-woman` | `rgba(111,54,235,0.1)` | `#4A27A8` atenuado (~0.25) |
| `--gradient-man` | `rgba(0,217,255,0.2)` | `#1E5F8A` atenuado (~0.25) |
| Welcome (ambos) | morado 0.1 + cian 0.2 | ambos atenuados sobre `--background-color` |

### Tarjetas de Home (una entrada por `CardColors`)

| `CardColors` | Fondo claro → oscuro | Texto claro → oscuro |
|---|---|---|
| `WOMAN_BLUE` | `sky-500` → `#1E5F8A` | `sky-900` → `#F0F9FF` |
| `WOMAN_PURPLE` | `violet-400` → `#4C2A85` | `purple-900` → `#F1E9FA` |
| `WOMAN_VIOLETTE` | `violet-300` → `#5B3FA8` | `indigo-900` → `#F5F3FF` |
| `MAN_SKY_BLUE` | `#61B2E4` → `#1E5F8A` | `#17537A` → `#E6F3FA` |
| `MAN_LIGHT_SKY_BLUE` | `#5A9ABE` → `#1B5073` | `#154C6B` → `#E6F3FA` |
| `MAN_DEEP_SKY_BLUE` | `#95C5DE` → `#2A6F96` | `#0D4461` → `#E6F3FA` |

### Por género (piezas con ternario hoy)

| Pieza | Mujer claro → oscuro | Hombre claro → oscuro |
|---|---|---|
| Barra del autor | `indigo-950` → `#141830` | `#1C2742` → `#101A2E` |
| Saludo (`Greetings`) | `violet-950` → `#ECEAF4` | `#1C2742` → `#ECEAF4` |

## Reglas de validación

- **VR-001**: Cada color fijo de `src/**/*.{css,tsx}` listado en research.md (H3) debe sustituirse por un token; no quedan hex sueltos salvo los que no cambian por diseño (p. ej. rosa de «Logout» `#FF709D`, botón morado de acento).
- **VR-002**: El valor claro de cada token es exactamente el color que reemplaza (FR-010).
- **VR-003**: Texto sobre cada tarjeta ≥ 4.5:1 en ambas paletas (SC-004); si un valor de Figma no lo cumple, se ajusta aquí y en spec.md.
