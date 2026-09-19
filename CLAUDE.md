# gr8ful

## Qué es
App móvil de frases motivacionales que además ayuda al aprendizaje de idiomas.
Idiomas soportados: inglés (EN), español (ES), francés (FR).

## Objetivo del proyecto
Publicar la app en App Store (iOS) y Play Store (Android).

## Arquitectura clave
- **Sin backend**: toda la app funciona 100% local (sin llamadas a servidores propios ni API externa de datos). La persistencia de datos vive en el dispositivo (ver `src/persistence`).
- Stack: Ionic + React + TypeScript + Vite, empaquetado con Capacitor para Android/iOS.
- Monetización vía AdMob (`@capacitor-community/admob`): intersticiales y rewarded ads.

## Estructura de `src/`
- `pages/` — pantallas de la app
- `components/` — componentes reutilizables de UI
- `hooks/` — lógica reutilizable con React hooks
- `persistence/` — capa de almacenamiento local
- `models/` — tipos/modelos de datos
- `mapper/` — mapeo entre modelos/datos
- `theme/` — estilos/tema de Ionic

## Metodología de desarrollo: Spec-Driven Development (SDD)

El proyecto usa [spec-kit](https://github.com/github/spec-kit) para gestionar el desarrollo de forma que cualquier sesión de IA futura tenga contexto completo.

- **Constitución del proyecto**: `.specify/memory/constitution.md` — principios rectores (local-first, trilingüe obligatorio, mobile-first, AdMob como restricción, reutilizar antes de duplicar).
- **Specs**: `specs/<NNN>-<slug>/spec.md`
  - `001`-`006` — línea base retroactiva de lo ya construido (onboarding, frases multi-idioma, tarjetas, AdMob, push, ajustes).
  - `007`-`014` — deuda técnica: features a medio implementar (favoritos, compartir, dark mode, banners por tarjeta, bug de favoritos en IndexedDB, botón atrás, scheduling de frase diaria, código muerto).
  - `specs/BACKLOG.md` — candidatas a futuro sin spec formal todavía.
- **Flujo para features nuevas o cambios significativos**:
  1. `/speckit-specify` — crear/actualizar la spec
  2. `/speckit-clarify` (opcional) — resolver ambigüedades antes de planear
  3. `/speckit-plan` — plan técnico
  4. `/speckit-tasks` — desglose de tareas
  5. `/speckit-implement` — ejecutar
- Antes de proponer una feature nueva, revisar si ya existe una spec de deuda técnica (`specs/007`-`014`) que la cubra parcialmente — completar lo existente tiene prioridad sobre construir algo nuevo en paralelo.

## Notas para sesiones futuras
- No asumir que existe backend propio: cualquier feature debe diseñarse para funcionar offline/local-first.
- Al tocar textos/frases, tener en cuenta que deben soportarse en EN/ES/FR.
- Antes de tocar código, revisar si hay una spec relevante en `specs/` — da contexto de qué está completo, qué es deuda técnica conocida y por qué.
