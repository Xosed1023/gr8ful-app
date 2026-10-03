# Data Model: Completar Scheduling de Frase Diaria

Sin entidades persistentes nuevas.

## Claves de `localStorage` (existentes)

| Clave | Valores | Uso |
|---|---|---|
| `pushNotifications` | `"true"` / `"false"` / ausente (= desactivadas) | Estado de las notificaciones diarias; escrito solo por `enableDailyQuotes`/`disableDailyQuotes` |
| `time` | `"6"` / `"12"` / `"18"` | Hora local de la notificación; ausente = no se programa |
| `language` | `"es"` / `"en"` / `"fr"` | Idioma del texto |
| `topics` | JSON de `Topic[]` (`{key, value}`) | Filtro por temas; vacío = todos |

## `ScheduledQuote` (en memoria)

| Campo | Tipo | Restricción |
|---|---|---|
| `id` | `number` | `7000 + i`, `i ∈ [0, 29]` |
| `at` | `Date` | `hour:00:00` local; `i`-ésimo día desde la primera fecha válida; estrictamente posterior a `now` |
| `title` | `string` | `"Gr8ful"` |
| `body` | `string` | `phrase.content[language]` + `"\n— " + phrase.author` |
| `phraseId` | `number \| undefined` | Para `extra` de la notificación |

## Resultado de `enableDailyQuotes()`

`"scheduled"` · `"denied"` (permiso rechazado) · `"no-time"` (sin hora guardada) · `"unavailable"` (web).

## Reglas de validación

- **VR-001**: Máximo 30 pendientes con IDs `7000..7029`; antes de programar se cancelan los 30.
- **VR-002**: Dos notificaciones consecutivas no comparten `phraseId` mientras haya ≥ 30 frases candidatas.
- **VR-003**: Con `pushNotifications ≠ "true"`, `refreshDailyQuotes()` no programa nada.
- **VR-004**: Con permiso no concedido, `refreshDailyQuotes()` no pide el permiso (solo `enable` lo pide).
