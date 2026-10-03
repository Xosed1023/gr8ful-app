# Implementation Plan: Completar Compartir Frase

**Branch**: `develop` | **Date**: 2026-09-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/018-completar-compartir/spec.md`

## Summary

Corrige el idioma hardcodeado en `CardPhrase.tsx` (mostraba/copiaba siempre `phrase.content.es`, ignorando el idioma seleccionado) pasando a cada tarjeta su idioma por prop (`language`: en/es/fr) desde `CardsContainer`, y agrega la capacidad de compartir vía `@capacitor/share` (única dependencia nueva, justificada — no hay mecanismo de compartir existente que reutilizar).

## Technical Context

**Language/Version**: TypeScript ~5.1, sin cambios

**Primary Dependencies**: `@capacitor/share` **NUEVA** (`^7.0.4`, misma línea mayor que el resto de `@capacitor/*` ya en `^7.0.0`)

**Storage**: N/A — no persiste nada nuevo

**Testing**: `vitest` para regresión; verificación manual (idioma en tarjeta + share sheet nativo, solo probable en dispositivo real)

**Target Platform**: Requiere dispositivo físico o simulador para el share sheet nativo (no funciona de forma representativa en `npm run dev`)

**Project Type**: Mobile-app (Ionic + Capacitor + React)

**Constraints**: No debe cambiar la posición ni el comportamiento del botón de favoritos ya cableado (Spec 017); el share no debe disparar el toggle de expandir/colapsar (FR-006, mismo `e.stopPropagation()` ya usado en favoritos/copiar)

**Scale/Scope**: 1 dependencia nueva, 2 archivos modificados (`CardPhrase.tsx` y `CardsContainer.tsx`) para ambos fixes (idioma + share); requiere `npx cap sync` tras instalar la dependencia (agrega el plugin nativo)

## Constitution Check

| Principio | Evaluación | Estado |
|---|---|---|
| I. Local-First / Sin Backend | `@capacitor/share` invoca el share sheet nativo del SO, no un servicio propio; no se agrega backend. | PASS |
| II. Trilingüe Obligatorio | Esta spec **corrige** una violación existente del principio (idioma hardcodeado) — la refuerza en vez de arriesgarla. | PASS |
| III. Mobile-First vía Capacitor | `@capacitor/share` es un plugin oficial de Capacitor, mismo patrón que el resto del proyecto; requiere verificación en dispositivo real (no solo navegador). | PASS |
| IV. Monetización AdMob | No se toca AdMob. | PASS |
| V. Reutilizar Antes de Duplicar | El idioma de cada tarjeta se pasa por prop, sin lógica nueva; `@capacitor/share` es la única dependencia nueva, explícitamente justificada en Assumptions de spec.md por no existir mecanismo de compartir previo. | PASS |

No hay violaciones. No se requiere `Complexity Tracking`.

## Project Structure

### Documentation (this feature)
```text
specs/018-completar-compartir/
├── plan.md / research.md / data-model.md / quickstart.md / tasks.md
```

No se genera `contracts/` — no hay interfaz externa.

### Source Code
```text
gr8ful-app/
├── package.json                          # + @capacitor/share ^7.0.4
└── src/components/home/CardPhrase.tsx     # prop `language` para el texto mostrado/copiado; botón share descomentado y cableado a Share.share()
```

**Structure Decision**: Sin cambios estructurales — un solo componente ya existente concentra ambos fixes.

## Complexity Tracking

No aplica.
