# Research: Completar Compartir Frase

## Decisión 1 — Cómo resolver el idioma hardcodeado

**Archivo**: `src/components/home/CardPhrase.tsx:159` (texto mostrado) y `:199` (texto copiado) — ambos usan `phrase.content.es` fijo.

**Decision** (corregida 2026-10-02): `CardPhrase` recibe una prop `language: LanguageKeys` y reemplaza `phrase.content.es` por `phrase.content[language]` en ambos puntos, más en el nuevo texto de compartir. `CardsContainer` pasa `"en"`, `"es"` y `"fr"` a cada una de las 3 tarjetas.

**Rationale**: Home son 3 tarjetas, una por idioma (coherente con sus banners `EN_CARD`/`ES_CARD`/`FR_CARD`), independientes del idioma de la app. El idioma es una propiedad de cada tarjeta, no un estado global.

**Alternatives considered**: Leer `useAppLanguage()` dentro de `CardPhrase` (decisión original) — descartada tras la verificación manual: hacía que las 3 tarjetas mostraran el mismo idioma (el de la app).

## Decisión 2 — Prop `phrase` necesita `author`

**Archivo**: `src/components/home/CardPhrase.tsx:21-25` — `CardPhraseProps.phrase` es `Pick<Phrase, "content" | "type">`, no incluye `author`. El autor hoy se muestra en `CardsContainer.tsx` (fuera de `CardPhrase`), no dentro de la tarjeta.

**Decision**: Ampliar el `Pick` a `Pick<Phrase, "content" | "type" | "author">` para poder incluirlo en el texto compartido (FR-005), sin cambiar dónde se muestra visualmente el autor (eso sigue en `CardsContainer`, fuera de alcance).

**Rationale**: `CardsContainer` ya pasa el objeto `Phrase` completo como prop (`phrase={phrase}`), así que en runtime `author` ya está disponible — solo hace falta ampliar el tipo para poder leerlo con seguridad de tipos.

## Decisión 3 — Formato del texto compartido

**Decision**: `${phrase.content[language]}\n\n— ${phrase.author}`.

**Rationale**: Formato simple y estándar para citas compartidas (frase, salto de línea, guion + autor) — cumple FR-005 sin necesitar diseño adicional.

## Decisión 4 — Manejo de error/cancelación del share sheet

**Decision**: Envolver `Share.share()` en `try/catch`, solo `console.error` en el catch (sin toast de error) — a diferencia del botón de copiar, que sí muestra un toast de error.

**Rationale**: En iOS, cancelar el share sheet nativo hace que `Share.share()` rechace la promesa igual que un error real — no hay forma confiable de distinguir "el usuario canceló" de "falló de verdad" en todas las plataformas. Mostrar un toast de error cada vez que el usuario simplemente cierra el share sheet sería una mala experiencia. El requisito real (FR-007) es solo "no debe quedar en un estado roto", que un `catch` silencioso ya satisface — no exige notificar todos los fallos.

**Alternatives considered**: Mostrar el mismo toast de error que usa el botón de copiar — descartado por el motivo anterior (falsos positivos en cancelación).

## Decisión 5 — Versión de `@capacitor/share`

**Decision**: `^7.0.4` (última versión estable de la línea 7.x, misma que el resto de `@capacitor/*` ya en el proyecto).

**Rationale**: Consistencia de versión mayor con el resto de plugins de Capacitor ya instalados (`^7.0.0`), evitando el tipo de desfase de versión nativa que causó el Hallazgo de la Spec 015 (T015) con AdMob.
