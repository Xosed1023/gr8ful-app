# Implementation Plan: Onboarding Interrumpido

**Branch**: `develop` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

## Summary

Se separa en dos marcas locales lo que hoy es una sola: `gr8fulFirstTime` sigue significando «frases iniciales cargadas» (`App.tsx`), y una marca nueva `onboardingCompleted` se pone al pulsar «Finalizar» con un nombre válido. `Welcome` decide con un helper `isOnboardingComplete()` que además migra a los usuarios existentes que ya tienen nombre.

## Technical Context

**Language/Version**: TypeScript ~5.1 (sin cambios) · **Dependencies**: ninguna nueva · **Storage**: `localStorage` (clave nueva `onboardingCompleted`; existentes `gr8fulFirstTime`, `name`) · **Testing**: `vitest` para el helper; verificación manual en dispositivo (interrumpir y retomar) · **Platform**: iOS/Android (también navegador)

## Hallazgos

- **H1** — `App.tsx:61-63` pone `gr8fulFirstTime="true"` tras cargar las frases en el primer arranque, antes de que el usuario toque el onboarding.
- **H2** — `Welcome.tsx:18` lo lee como «onboarding terminado» y redirige a `/mainHome`.
- **H3** — El último paso (`UserName.handleFinish`) guarda `name` y navega a `/loadingScreen` → `/mainHome`; es el único punto que representa «terminó».
- **H4** — `Settings` navega a `/userName` para editar el nombre; no debe tocar la marca (FR-007). Como la marca solo se escribe en `handleFinish`, que también se usa al editar, escribirla de nuevo es idempotente y no cambia el estado.

## Decisiones

1. **Marca nueva `onboardingCompleted`** (en vez de reutilizar `gr8fulFirstTime`): evita mezclar semánticas y no obliga a tocar la carga de frases (FR-001, FR-006).
2. **Helper `src/persistence/onboardingState.ts`**: `isOnboardingComplete()` (true si `onboardingCompleted==="true"`; si no, migra: con `name` no vacío guarda la marca y devuelve true) y `markOnboardingComplete()`. Una sola fuente de verdad (Principio V), testable.
3. **Dónde se marca**: en `UserName.handleFinish`, justo tras guardar `name`, antes de navegar (FR-002, edge case de cierre al pulsar «Finalizar»).
4. **Reinicio desde la bienvenida**: no se añade lógica de reanudar por paso.

## Constitution Check

I Local-First: PASS (solo `localStorage`) · II Trilingüe: PASS (sin textos nuevos) · III Mobile-First: PASS · IV AdMob: PASS (sin cambios) · V Reutilizar: PASS (helper único).

## Archivos

`src/persistence/onboardingState.ts` (+ `.test.ts`) nuevo · `src/pages/Welcome.tsx` · `src/pages/UserName.tsx`
