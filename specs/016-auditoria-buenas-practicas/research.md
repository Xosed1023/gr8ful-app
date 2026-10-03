# Research: Auditoría de Buenas Prácticas — Reuso y Tipado

Investigación previa sobre `src/` (agente de exploración, 2026-09-20) que fundamenta este plan. Todos los hallazgos citan archivo/línea real del codebase.

## Hallazgos de reutilización (User Story 1)

### A1. Patrón de idioma duplicado en 8 pantallas

**Archivos**: `src/pages/Gender.tsx:9-38`, `Languages.tsx:11-35`, `QuoteTime.tsx:10-26`, `QuoteTopics.tsx:31-69`, `UserName.tsx:15-46`, `Home.tsx:16-36`, `Settings.tsx:29-91`, `LoadingScreen.tsx:9-18`.

**Qué está duplicado**: cada pantalla repite `useState(localStorage.getItem("language"))` + un `useEffect` que indexa un diccionario `AppXScreenLanguage.campo[userLanguage as keyof typeof ...]` por cada texto, con el mismo casteo `as keyof typeof` repetido línea a línea. `Settings.tsx` además vuelve a leer `userLanguage` en un segundo `useEffect` (línea 41-43) mientras el resto nunca lo refresca tras montar (inconsistencia adicional entre pantallas).

**Decision**: Extraer `useAppLanguage()` en `src/hooks/useAppLanguage.ts`. Devuelve `userLanguage: LanguageKeys` (con fallback a `"en"` si `localStorage` está vacío o tiene un valor inválido) y no requiere que cada pantalla repita el casteo `as keyof typeof`.

**Rationale**: Es el patrón con más superficie (8 archivos) y el que más impacto tiene en Principio II (trilingüe) — centralizarlo reduce el riesgo de que una pantalla nueva olvide alguno de los 3 idiomas.

**Alternatives considered**: (a) Dejar la lectura de `localStorage` en cada pantalla pero solo compartir el tipo `LanguageKeys` — insuficiente, no resuelve la repetición del `useEffect`/casteo, que es la parte más propensa a errores. (b) Context de React para el idioma global — evaluado y descartado: cambiaría el modelo actual (lectura síncrona de `localStorage` al montar) a uno con Provider, lo cual excede el alcance de "refactor interno sin cambiar comportamiento" (FR-004) y no fue pedido.

### A2. Patrón de género duplicado en 6 archivos

**Archivos**: `QuoteTime.tsx:35-36`, `QuoteTopics.tsx:78-79,134-137,148-149`, `UserName.tsx:48-49,95`, `LoadingScreen.tsx:20-21`, `CardsContainer.tsx:8`, `Greetings.tsx:11-13`.

**Qué está duplicado**: `localStorage.getItem("gender") === "M" ? A : B` repetido con distintos nombres de clase/valor por pantalla, siempre la misma lógica condicional binaria.

**Decision**: Extraer `useUserGender()` en `src/hooks/useUserGender.ts`, devuelve `{ gender: Gender; isMale: boolean; isWoman: boolean }` con `Gender = "M" | "W"` tipado explícito.

**Rationale**: Mismo dato leído 6 veces de forma dispersa; centralizarlo resuelve a la vez A2 y B5 (tipado implícito).

**Alternatives considered**: Mantener el `=== "M"` inline pero solo tipar la constante — insuficiente, no reduce la duplicación real del patrón condicional.

### A3. `Haptics.impact({ style: ImpactStyle.Medium })` repetido 10 veces en 7 archivos

**Archivos**: `CardPhrase.tsx:99,113`, `QuoteTopics.tsx:42,75`, `Languages.tsx:17`, `Gender.tsx:74,83`, `UserName.tsx:20`, `Welcome.tsx:62`, `QuoteTime.tsx:32`.

**Qué está duplicado**: siempre el mismo `ImpactStyle.Medium`, sin fallback en la mayoría de los call-sites. Solo `CardPhrase.tsx:111-117` (`triggerHapticFeedback`) tiene un `try/catch` con fallback a `navigator.vibrate` — el resto no.

**Decision**: Extraer `hapticTap()` en `src/hooks/useHaptics.ts`, reusando el `try/catch` + fallback que hoy solo tiene `CardPhrase.tsx`.

**Rationale**: Además de reducir duplicación, hace más robustos los 9 call-sites que hoy no tienen fallback (mejora real, no solo estética) sin cambiar el comportamiento esperado (Principio III: patrones táctiles/nativos ya establecidos se mantienen, solo se comparten).

**Alternatives considered**: Ninguna — es un caso claro de utilidad compartida sin trade-offs relevantes.

### A4. Botón atrás duplicado en 4-5 archivos

**Archivos**: `Gender.tsx:47-52`, `Languages.tsx:43-48` (comentado), `QuoteTime.tsx:43-48`, `UserName.tsx:56-61`, `QuoteTopics.tsx:91-107` (con lógica condicional extra).

**Decision**: Extraer `BackButton` en `src/components/common/BackButton.tsx` (carpeta nueva `common/`), recibiendo `onClick`/`to` como prop.

**Rationale**: Reduce duplicación de markup; `common/` se elige en vez de `home/` porque estas pantallas no son parte del flujo de tarjetas de inicio.

**Constraint importante**: `specs/010-completar-back-button-languages` ya es una spec de deuda técnica dedicada a la navegación de "atrás" en selección de idioma. Esta auditoría **solo extrae el componente compartido** (refactor de forma, mismo comportamiento); no resuelve ninguna lógica de navegación pendiente de esa spec — si al extraer el componente se detecta que el comportamiento de alguna pantalla ya es distinto al de las demás (posible causa/síntoma de lo que documenta la spec 010), se deja esa diferencia intacta y se anota, no se "corrige" unilateralmente aquí (Edge Case de spec.md).

### A5 (baja prioridad, intra-archivo) y A6 (baja prioridad)

`CardPhrase.tsx:27-82` (`bottomAdSpace` con 3 condicionales de plataforma) y `CardsContainer.tsx:13-33` (selección de color por género con 3 condicionales) son patrones repetidos pero dentro de un solo archivo cada uno, no cross-file. **Decision**: quedan documentados como candidatos pero fuera del MVP de esta spec (ver tasks.md, se marcan opcionales) — no bloquean el cierre de la spec si no se llega a ellos, a diferencia de A1-A4.

## Hallazgos de tipado (User Story 2)

### B1/B2. `any` explícito en `QuoteTopics.tsx`

**Archivos**: `QuoteTopics.tsx:10` (`useState<any[]>([])`), `QuoteTopics.tsx:36` (`toggleTopic = async (topic: any) =>`).

**Decision**: Reemplazar por `Topic[]` y `Topic` respectivamente — el tipo ya existe en `src/models/Topic.ts`, solo falta exportarlo (ver B3) e importarlo.

**Rationale**: Es el único `any` real del código; tiene un tipo disponible, no hay justificación para mantenerlo (confirma FR-007: no hay ningún caso de `any` justificado en esta spec).

### B3. `Topic` sin exportar, usado como global implícito

**Archivo**: `src/models/Topic.ts:1` — `type Topic = { key: string; value: string };` sin `export`. Al ser el único statement de nivel superior del archivo sin import/export, TypeScript lo trata como script global, por lo que `Topic` se usa implícitamente sin import en `QuoteTopics.tsx:19`, `persistence/languages.ts:6`, `persistence/IndexedDBService.ts:49`.

**Decision**: Agregar `export` en `Topic.ts` e importarlo explícitamente en los 3 archivos que lo consumen.

**Rationale**: Es un riesgo real, no solo estilístico — cualquier cambio futuro a `Topic.ts` (agregar cualquier otro `import`/`export`) rompería silenciosamente la resolución global implícita en los 3 archivos consumidores. Bajo riesgo de aplicar, alto valor de prevención.

### B4/B5. Tipado implícito de idioma y género

Resueltos naturalmente al implementar A1 (`useAppLanguage` devuelve `LanguageKeys` tipado) y A2 (`useUserGender` devuelve `Gender` tipado) — no requieren trabajo de tipado separado más allá de exportar `LanguageKeys` desde donde corresponda.

**Decision**: Exportar `LanguageKeys` (hoy `type LanguageKeys = "es" | "en" | "fr"` sin exportar, definido solo dentro de `src/persistence/languages.ts:1`) desde ese mismo archivo — no se crea `src/models/Language.ts` nuevo salvo que durante la implementación se detecte que genera una dependencia circular entre `hooks/` y `persistence/`, en cuyo caso se mueve a `models/` (decisión operativa, no bloquea el plan).

**Alternatives considered**: Crear `src/models/Language.ts` de entrada — se descarta por ahora para minimizar el diff (Principio de "no duplicar/mover más de lo necesario"); se deja como fallback documentado.

### B6. Inconsistencia de prop `backTo` (obligatoria vs. opcional)

**Archivos**: `Languages.tsx:8`, `QuoteTime.tsx:8`, `QuoteTopics.tsx:8` tipan `{ backTo: string }` (obligatorio), pero `App.tsx:125,127,128,129` monta estas pantallas vía `component={Languages}` sin pasar `backTo` — queda `undefined` en runtime pese al tipo. Solo `UserName.tsx:8` lo tipa correctamente como `backTo?: string`.

**Decision**: Unificar como `backTo?: string` opcional en los 3 archivos que lo tienen mal tipado, igualando a `UserName.tsx`.

**Rationale**: Es una inconsistencia de tipado real que el compilador no detecta hoy porque Ionic/React Router tipa `component` de forma laxa — pero el bug de runtime (posible `undefined.something` si algún código asume que `backTo` siempre existe) es real. Bajo riesgo, alto valor.

### B7. Props inline sin `interface` nombrada (consistencia, prioridad baja)

`Greetings.tsx:4-10`, `CardsContainer.tsx:7`, `Home.tsx:10`, `Languages.tsx:8`, `QuoteTime.tsx:8`, `QuoteTopics.tsx:8` usan props inline en vez de una `interface` nombrada como sí hace `CardPhrase.tsx:21-25`. **Decision**: aplicar solo en los componentes que ya se tocan por A1-A4/B1-B6 (costo marginal ~0 al estar editando esas líneas de todos modos); no se abre una tarea separada solo para esto.

## Resumen de priorización para tasks.md

1. **MVP (bloquea cierre de US1)**: A1, A2, A3, A4.
2. **MVP (bloquea cierre de US2)**: B1, B2, B3, B6 (y B4/B5 como consecuencia directa de A1/A2).
3. **Opcional / no bloquea cierre de la spec**: A5, A6, B7 (se aplican solo si quedan dentro del mismo diff que ya se está tocando, no como tareas propias).

## Ningún `any` justificado

Confirmado (ver reporte de investigación): no hay ninguna dependencia de terceros sin tipos en `src/` que requiera `any` como única opción razonable. El único código sin tipos de terceros es `src/mapper/` (script offline en JS plano), ya cubierto por `specs/014-completar-limpieza-codigo-muerto` y fuera de alcance de esta spec.
