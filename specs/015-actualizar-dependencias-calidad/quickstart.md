# Quickstart: Validar la actualización de dependencias

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md)

Esta guía reproduce los criterios de aceptación de la User Story 1 y 2 de la spec. Ejecutar en orden; si un paso falla, no continuar con los siguientes hasta resolverlo (ver Decisión 3 en `research.md`).

## Prerrequisitos

- Node.js y npm instalados (versión ya usada por el proyecto).
- Repositorio limpio (`git status` sin cambios pendientes) antes de empezar, para poder revertir fácilmente si algo falla.
- Dependencias nativas de Capacitor instaladas (Android Studio/Xcode no son necesarios para `npx cap sync`, pero sí deben existir las carpetas `android/`/`ios/` ya presentes en el repo).

## 1. Baseline (antes de tocar nada)

```bash
npm outdated
npm run lint
npm run build
npm run test.unit
```

Anotar el resultado de cada comando (qué pasa/falla hoy) para poder comparar después.

## 2. Aplicar la actualización menor/parche

```bash
npm update
npm install
```

Esto actualiza cada dependencia hasta su versión "Wanted" dentro del mismo rango de versión mayor (ver Decisión 1 en `research.md`).

## 3. Confirmar que ningún paquete cruzó de versión mayor (SC-001)

```bash
npm outdated
```

**Esperado**: para cada fila restante, "Current" == "Wanted"; ninguna dependencia cambió su número de versión mayor respecto al baseline del paso 1.

## 4. Lint (SC-002 / FR-003)

```bash
npm run lint
```

**Esperado**: 0 errores.

## 5. Build / type-check (SC-003 / FR-004)

```bash
npm run build
```

**Esperado**: `tsc` y el bundler terminan sin errores.

## 6. Pruebas unitarias (SC-004 / FR-005)

```bash
npm run test.unit
```

**Esperado**: 100% de las pruebas en verde.

## 7. Arranque y funciones core (SC-005 / FR-006 / FR-007)

```bash
npm run dev
```

**Esperado**: la app arranca sin errores en el navegador. Verificar manualmente:

- Se muestra una frase al abrir la app.
- Se puede marcar/ver una frase como favorita.
- Se puede cambiar el idioma entre EN, ES y FR y el contenido se actualiza acorde.

## 8. Verificación nativa liviana (SC-006 / FR-010)

```bash
npx cap sync
```

**Esperado**: el comando termina sin errores (sincroniza correctamente los proyectos `android/` e `ios/` con los plugins nativos actualizados).

## 9. Verificación manual de AdMob (FR-009, Edge Cases)

Con la app corriendo (paso 7), confirmar que el comportamiento de los anuncios (intersticiales cada ~45s, rewarded ads) no cambió de frecuencia, ubicación o forma de disparo respecto al comportamiento anterior a la actualización.

## Si algo falla

- Si el fallo es atribuible a una dependencia concreta (lint/build/test.unit/cap-sync), revertir solo esa dependencia a su versión anterior (`npm install <paquete>@<versión-anterior>`), documentarla como hallazgo (ver `data-model.md` → Hallazgo de Calidad) y continuar con el resto.
- No se debe forzar una dependencia problemática ni "arreglar" el código para compatibilizar con un cambio de comportamiento inesperado — eso excede el alcance de esta spec (ver `research.md`, Decisión 3).
