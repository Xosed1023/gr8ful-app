---
description: "Task list template for feature implementation"
---

# Tasks: Completar Compartir Frase

**Input**: Design documents from `/specs/018-completar-compartir/`

**Tests**: Sin suite de componentes; validación vía `lint`/`build`/`test.unit` + quickstart.md manual.

---

## Phase 1: Setup

- [X] T001 Verificar `git status` limpio
- [X] T002 [P] Baseline: `npm run lint`, `npm run build`, `npm run test.unit` — confirmado 0 errores

---

## Phase 2: Foundational

- [X] T003 Instalar `@capacitor/share@^7.0.4` — research.md Decisión 5
- [X] T004 Ejecutar `npx cap sync` para registrar el plugin nativo en `android/`/`ios/` — confirmado: 8 plugins detectados en ambas plataformas, sin conflictos de Pods (a diferencia del hallazgo de AdMob en Spec 015)

**Checkpoint**: Dependencia lista para usarse

---

## Phase 3: User Story 1 - Cada tarjeta muestra su propio idioma (Priority: P1) 🎯 MVP

- [X] T005 [US1] En `src/components/home/CardPhrase.tsx`: prop `language`; `phrase.content.es` → `phrase.content[language]` en el texto mostrado y en el botón de copiar; en `src/components/home/CardsContainer.tsx` pasar `language="en"|"es"|"fr"` a cada tarjeta (corregido 2026-10-02: la versión inicial con `useAppLanguage()` mostraba el mismo idioma en las 3) — research.md Decisión 1, spec.md FR-001, FR-002

**Checkpoint**: quickstart.md sección 2

---

## Phase 4: User Story 2 - Compartir una frase (Priority: P2)

- [X] T006 [US2] `CardPhraseProps.phrase` ampliado a `Pick<Phrase, "content" | "type" | "author">` — data-model.md, research.md Decisión 2
- [X] T007 [US2] Botón de compartir descomentado y cableado a `Share.share({ text })` con `e.stopPropagation()` y `try/catch` silencioso (sin toast) — research.md Decisión 3 y 4, spec.md FR-003 a FR-007

**Checkpoint**: quickstart.md sección 3

---

## Phase 5: Polish

- [X] T008 `npm run lint`/`build`/`test.unit` final — confirmado 0 errores (test.unit: mismo error preexistente no relacionado de sesiones anteriores)
- [X] T009 Verificación manual completa (quickstart.md 2-3) — verificado por el usuario en emulador (2026-10-02)
- [X] T010 Documentar Hallazgos de Calidad si aparecen, mismo formato que specs anteriores — hallazgo: las 3 tarjetas mostraban el mismo idioma con la primera implementación; corregido con la prop `language` (ver spec.md, nota de corrección)

---

## Dependencies

Setup → Foundational (T003→T004) → US1 (T005) → US2 (T006→T007, depende de T004 y T005) → Polish
