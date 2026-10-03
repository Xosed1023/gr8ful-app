# Data Model: Auditoría de Buenas Prácticas — Reuso y Tipado

No hay entidades de dominio/negocio nuevas (esta spec no toca `Phrase`, `Topic` como modelo de contenido, etc. salvo exportarlo). Las "entidades" relevantes aquí son los hallazgos definidos en `spec.md` y los artefactos de código nuevos que introduce el plan.

## Hallazgo de reuso

| Campo | Descripción |
|---|---|
| `id` | A1–A6 (ver research.md) |
| `archivos` | Lista de paths + líneas involucradas |
| `patron_duplicado` | Qué lógica/markup se repite |
| `extraccion_propuesta` | Nombre y ubicación del hook/componente/servicio destino |
| `prioridad` | MVP (A1-A4) u opcional (A5-A6) |
| `resolucion` | `aplicado` / `referenciado_a_otra_spec` / `descartado_con_razon` |

## Hallazgo de tipado

| Campo | Descripción |
|---|---|
| `id` | B1–B7 (ver research.md) |
| `archivo` | Path + línea |
| `problema` | `any` explícito / tipado implícito / prop sin `interface` |
| `tipo_correcto_propuesto` | Tipo concreto a aplicar |
| `prioridad` | MVP (B1,B2,B3,B6) o resuelto-por-consecuencia (B4,B5) u opcional (B7) |
| `resolucion` | `aplicado` / `justificado_con_razon` |

## Artefactos de código nuevos (introducidos por el plan)

| Artefacto | Ubicación | Reemplaza el patrón duplicado de |
|---|---|---|
| Hook `useAppLanguage()` | `src/hooks/useAppLanguage.ts` | A1, resuelve B4 |
| Hook `useUserGender()` | `src/hooks/useUserGender.ts` | A2, resuelve B5 |
| Helper `hapticTap()` | `src/hooks/useHaptics.ts` | A3 |
| Componente `BackButton` | `src/components/common/BackButton.tsx` | A4 |
| Tipo `LanguageKeys` (exportado) | `src/persistence/languages.ts` (existente, solo se exporta) | B4 |
| Tipo `Gender = "M" \| "W"` | `src/hooks/useUserGender.ts` (co-ubicado con el hook que lo devuelve) | B5 |
| Tipo `Topic` (exportado) | `src/models/Topic.ts` (existente, solo se agrega `export`) | B3 |

### Contrato de `useAppLanguage()`

```ts
function useAppLanguage(): {
  userLanguage: LanguageKeys; // "es" | "en" | "fr", fallback "en" si localStorage es inválido/vacío
};
```

No reemplaza los diccionarios `AppXScreenLanguage` existentes (esos son datos de contenido, fuera de alcance) — solo centraliza la lectura y tipado de `userLanguage`, eliminando el `as keyof typeof` repetido en cada pantalla.

### Contrato de `useUserGender()`

```ts
type Gender = "M" | "W";

function useUserGender(): {
  gender: Gender; // fallback documentado en la implementación si localStorage.gender es inválido/vacío
  isMale: boolean;
  isWoman: boolean;
};
```

### Contrato de `hapticTap()`

```ts
async function hapticTap(): Promise<void>;
// Encapsula Haptics.impact({ style: ImpactStyle.Medium }) con el mismo
// try/catch + fallback a navigator.vibrate que hoy solo tiene CardPhrase.tsx
```

### Contrato de `BackButton`

```ts
interface BackButtonProps {
  onClick: () => void; // los 4 call-sites reales siempre lo pasan
  className?: string; // override de posición; default "absolute top-4 left-4"
}
```

**Ajustado durante la implementación** (ver `tasks.md` T030, Hallazgo 2) respecto al diseño original de este documento: se cambió `to?: string` por `className?: string`, porque ninguna pantalla real navega con una URL plana (todas usan `useIonRouter().push(...)`/`goBack()`), y porque `QuoteTopics.tsx` posiciona su botón en un lugar distinto al resto (`top-6 left-6 z-10` vs. `top-4 left-4`) — sin el override se habría alterado su layout visible.

No resuelve la lógica de navegación pendiente de `specs/010-completar-back-button-languages` — solo extrae el markup/estilo compartido que hoy está duplicado.
