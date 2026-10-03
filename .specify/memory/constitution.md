# gr8ful Constitution

## Core Principles

### I. Local-First / Sin Backend
Toda funcionalidad DEBE operar 100% en el dispositivo. No se introduce backend propio, API remota de datos, ni dependencia de conectividad para las funciones core (mostrar frases, favoritos, preferencias). La persistencia usa IndexedDB (contenido, vía `idb`) y `localStorage` (preferencias de usuario) — cualquier necesidad nueva de almacenamiento DEBE extender estos mecanismos antes de introducir uno nuevo (ej. SQLite nativo o `@capacitor/preferences`) y justificar por qué no basta lo existente.

### II. Trilingüe Obligatorio (ES/EN/FR)
La app existe para ayudar al aprendizaje de idiomas mostrando frases en inglés, español y francés. Todo contenido nuevo (frases) y todo texto de interfaz nuevo DEBE incluir las 3 traducciones antes de considerarse completo. No se aceptan features que dejen un idioma a medias.

### III. Mobile-First vía Capacitor
La app se diseña para publicación en App Store y Play Store. Toda feature nueva DEBE funcionar correctamente empaquetada con Capacitor en Android e iOS (no solo en el navegador de desarrollo), y DEBE considerar patrones táctiles/nativos ya establecidos (haptics, safe areas, tabs de Ionic).

### IV. Monetización AdMob como Restricción de Diseño
Los intersticiales (cada 45s) y rewarded ads son parte del modelo de negocio actual. Cambios de UX que afecten frecuencia, ubicación o disparo de anuncios requieren decisión explícita del usuario/producto — no se remueven ni alteran ads silenciosamente como efecto secundario de otra feature.

### V. Reutilizar Antes de Duplicar
Antes de crear un nuevo patrón (modelo, hook, servicio de persistencia, pantalla), se DEBE revisar si `src/persistence`, `src/models`, `src/hooks` o `src/components` ya resuelven algo equivalente. Priorizar completar features a medio implementar (ver `specs/`) sobre construir alternativas nuevas.

## Alcance del Producto

gr8ful es una app móvil de frases motivacionales que ayuda al aprendizaje de idiomas (EN/ES/FR). No tiene backend propio; toda la lógica, datos y preferencias viven en el dispositivo del usuario. El objetivo de distribución es App Store (iOS) y Play Store (Android) vía Capacitor.

## Flujo de Desarrollo (SDD)

Este proyecto usa Spec-Driven Development vía spec-kit. Cada feature nueva o cambio significativo sigue:

1. `/speckit-specify` — crear/actualizar la spec en `specs/<NNN>-<slug>/spec.md`
2. `/speckit-clarify` (opcional) — resolver ambigüedades antes de planear
3. `/speckit-plan` — generar el plan técnico en `specs/<NNN>-<slug>/plan.md`
4. `/speckit-tasks` — desglosar tareas ejecutables en `specs/<NNN>-<slug>/tasks.md`
5. `/speckit-implement` — ejecutar

Las specs existentes en `specs/` bajo el prefijo `001`-`006` documentan el estado actual de la app como línea base (retroactivas). Las specs `completar-*` documentan deuda técnica (features a medio implementar). `specs/BACKLOG.md` lista candidatas a futuro sin spec formal todavía.

## Governance

Esta constitución tiene precedencia sobre preferencias individuales de implementación. Cambios a los principios requieren actualizar este archivo y documentar el motivo en el commit correspondiente. `CLAUDE.md` en la raíz del repo resume el proyecto para sesiones de IA y enlaza aquí para el detalle de metodología.

**Version**: 1.0.0 | **Ratified**: 2026-09-18 | **Last Amended**: 2026-09-18
