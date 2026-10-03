# Data Model: Actualización de Dependencias y Calidad del Código

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Esta feature no introduce datos de dominio ni persistencia nueva (no hay cambios en `src/models`, `src/persistence` ni IndexedDB/`localStorage`). Las "entidades" aquí son conceptuales, usadas para llevar seguimiento del propio trabajo de actualización — no se materializan como código nuevo, sino como el resultado de correr `npm outdated`/lint/build y, si se desea, una tabla de seguimiento en el PR o en `tasks.md`.

## Dependencia

Representa un paquete de `package.json` (producción o desarrollo) sujeto a esta actualización.

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | string | Nombre del paquete npm (p. ej. `@ionic/react`) |
| `tipo` | enum: `dependency` \| `devDependency` | Sección de `package.json` en la que vive |
| `versionActual` | string (semver) | Versión antes de esta actualización |
| `versionWanted` | string (semver) | Versión objetivo dentro de la misma versión mayor (columna "Wanted" de `npm outdated`) |
| `impactaNativo` | boolean | `true` si el paquete afecta los proyectos `android/`/`ios/` (Capacitor core/plugins, AdMob) — determina si aplica la verificación `npx cap sync` |
| `estado` | enum: `sin_cambio` \| `actualizada` \| `revertida` | Resultado tras aplicar el update (ver Decisión 3 de `research.md`) |

**Reglas de validación** (derivadas de FR-001/FR-002):
- `versionWanted` DEBE compartir el mismo número de versión mayor que `versionActual`.
- Si `versionActual == versionWanted` desde el inicio, `estado` es `sin_cambio` (no se ejecuta ninguna acción sobre ese paquete).
- `estado = revertida` solo es válido si existe un `Hallazgo de Calidad` asociado que documente por qué se revirtió.

## Hallazgo de Calidad

Representa un error de lint o de compilación detectado durante la verificación, junto con su resolución.

| Campo | Tipo | Descripción |
|---|---|---|
| `origen` | enum: `lint` \| `build` \| `test.unit` \| `cap-sync` | Comando que detectó el hallazgo |
| `descripcion` | string | Mensaje o resumen del error |
| `dependenciaRelacionada` | string (opcional) | Nombre de la `Dependencia` que lo originó, si aplica |
| `resolucion` | enum: `corregido` \| `dependencia_revertida` | Cómo se resolvió (no se admite "silenciado sin explicación", por FR-008/Edge Cases) |

**Relación**: Un `Hallazgo de Calidad` con `resolucion = dependencia_revertida` DEBE referenciar una `Dependencia` cuyo `estado` sea `revertida`.

## Transiciones de estado (Dependencia.estado)

```text
sin_cambio ──(tiene bump wanted disponible)──> actualizada
actualizada ──(rompe lint/build/test.unit, ver Decisión 3)──> revertida
```

No hay más transiciones: una dependencia que empieza `sin_cambio` porque ya está en su versión "Wanted" no tiene ninguna acción pendiente.
