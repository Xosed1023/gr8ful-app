# Quickstart: Validar la Auditoría de Buenas Prácticas

Guía de validación tras aplicar los refactors de esta spec (hooks `useAppLanguage`/`useUserGender`/`hapticTap`, componente `BackButton`, y los fixes de tipado B1-B3/B6). No sustituye a `tasks.md` — aquí solo se documenta cómo comprobar que nada se rompió.

## 1. Controles automáticos (obligatorios, deben estar en verde antes de dar por cerrada cada tarea)

```bash
npm run lint          # 0 errores — SC-001
npm run build          # tsc + vite build, 0 errores — SC-002
npm run test.unit       # 100% de las pruebas en verde — SC-003
```

Grep de verificación rápida para SC-004 (0 usos de `any` sin justificar):

```bash
grep -rn ": any\|<any>\|any\[\]\|(.*: any)" src/ --include="*.tsx" --include="*.ts"
# Antes de esta spec: 2 resultados (QuoteTopics.tsx:10 y :36). Debe dar 0 tras B1/B2.
```

## 2. Verificación manual — idioma (User Story 1, A1/B4)

Con `npm run dev` corriendo, para **cada** pantalla migrada a `useAppLanguage()` (`Gender`, `Languages`, `QuoteTime`, `QuoteTopics`, `UserName`, `Home`, `Settings`, `LoadingScreen`):

1. Cambiar el idioma a **EN** desde Ajustes → confirmar que los textos de esa pantalla se ven en inglés.
2. Cambiar a **ES** → confirmar español.
3. Cambiar a **FR** → confirmar francés.
4. Confirmar que no aparece ningún texto vacío/`undefined` (síntoma de que el casteo `as keyof typeof` se resolvió mal en la migración).

Esto cubre FR-004 (sin cambio de comportamiento observable) para el hallazgo de mayor riesgo de la spec (Principio II).

## 3. Verificación manual — género (User Story 1, A2/B5)

Para las pantallas/componentes migrados a `useUserGender()` (`QuoteTime`, `QuoteTopics`, `UserName`, `LoadingScreen`, `CardsContainer`, `Greetings`):

1. Con un perfil configurado como género masculino, confirmar que los estilos/colores/textos condicionados por género se ven igual que antes del refactor.
2. Repetir con un perfil de género femenino.

## 4. Verificación manual — haptics (User Story 1, A3)

**Solo verificable en dispositivo físico** (iOS o Android), no en `npm run dev`:

1. Tocar cada acción que dispara `hapticTap()` (CardPhrase al marcar favorito/compartir, QuoteTopics al seleccionar tema, Languages/Gender/UserName/Welcome/QuoteTime en sus botones respectivos).
2. Confirmar que se sigue sintiendo la vibración/feedback háptico igual que antes (mismo `ImpactStyle.Medium`).

## 5. Verificación manual — botón atrás (User Story 1, A4)

Para cada pantalla migrada a `BackButton` (`Gender`, `QuoteTime`, `UserName`, `QuoteTopics`):

1. Confirmar que el botón sigue en la misma posición visual.
2. Confirmar que tocarlo navega al mismo destino que antes del refactor (sin asumir que ahora deba navegar distinto — eso es alcance de `specs/010`, no de esta spec).

## 6. Verificación de tipado (User Story 2, B1-B3/B6)

- `QuoteTopics.tsx`: confirmar en el editor (o `tsc --noEmit`) que `selectedTopics` y `toggleTopic` ya no aceptan `any` — intentar pasar un valor que no calce con `Topic` debe marcar error de tipos.
- `src/models/Topic.ts`: confirmar que ahora tiene `export` y que `QuoteTopics.tsx`, `persistence/languages.ts`, `persistence/IndexedDBService.ts` lo importan explícitamente (no dependen de resolución global implícita).
- `Languages.tsx`, `QuoteTime.tsx`, `QuoteTopics.tsx`: confirmar que `backTo` es `backTo?: string` (opcional), igual que ya lo tiene `UserName.tsx`.

## 7. Cierre de la spec

Si todos los puntos 1-6 pasan: marcar `tasks.md` completo, actualizar `spec.md`/`checklists/requirements.md` si aplica, y dejar documentados en `tasks.md` (como Hallazgo de Calidad, siguiendo el precedente de Spec 015) cualquier caso donde A5/A6/B7 (opcionales) sí se hayan aplicado o se hayan descartado explícitamente.
