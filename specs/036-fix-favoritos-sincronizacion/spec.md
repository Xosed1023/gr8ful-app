# Feature Specification: Corrección de la sincronización de favoritos

**Feature Branch**: `036-fix-favoritos-sincronizacion`

**Created**: 2026-10-09

**Status**: Completed

**Input**: «Guardo la frase del día en favoritos, la veo en Favoritos, la quito desde Favoritos, vuelvo a Home (el icono aparece como guardada), pulso el icono una vez (vuelve a normal), vuelvo a pulsar (guardada) y no aparece en el listado. Es aleatorio.»

## Síntoma

El corazón de Home y lo guardado en la base de datos se desincronizan. Tras quitar una frase desde Favoritos y volver a Diario, el icono puede mostrar «guardada» aunque la base diga que no (o al revés), y las pulsaciones siguientes parten de ese estado falso: guardan lo ya guardado o quitan lo que no estaba.

## Causa raíz (demostrada)

1. **Cierre obsoleto en el hook de Ionic.** `CardsContainer` relee el favorito de la base con `useIonViewWillEnter(() => getPhraseById(phrase.id)…)`. Con las dependencias por defecto (`[]`) Ionic registra la función de la **primera** renderización: `phrase.id` es siempre el de la frase con la que se montó la pantalla. En cuanto la frase cambia (anuncio de «Renovar inspiración», cambio de día al volver de segundo plano), al volver a Diario se releía **la frase anterior** y se pintaba su estado en la tarjeta de la frase nueva. Por eso es «aleatorio»: solo ocurre si la frase cambió durante la sesión y la anterior estaba (o no) guardada.
   - Evidencia (Playwright, IndexedDB real): con la frase A guardada, se cambia la frase del día a B, se guarda B y se quita B desde Favoritos; al volver a Home el icono salía **guardada** con la base sin B. 1.ª pulsación → «normal»; 2.ª → «guardada».
2. **Escrituras con datos obsoletos (riesgo asociado).** `toggleFavorite` leía y escribía en transacciones separadas, y `markShown` (MainHome) reescribía la frase **entera** desde un objeto cargado antes, con el riesgo de pisar un `isFavorite` cambiado en medio.
3. **La pulsación invertía el icono, no la base.** `next = !isFavorite` partía del estado local, que podía estar obsoleto.

## Solución

- `CardsContainer`: la relectura registra su función con `[phrase.id]`, así siempre usa la frase actual.
- La pulsación del corazón usa `flipFavorite(id)`: invierte **lo guardado** en una sola transacción `readwrite` y devuelve el valor nuevo; el icono se pinta con ese valor.
- `toggleFavorite` y el marcado de «mostrada» (`markPhraseShown`) pasan por `patchPhrase`: lectura del registro vigente + cambio de **un solo campo** + escritura en la misma transacción. Nunca se reescribe la frase completa desde un objeto antiguo.
- La lógica está en `src/persistence/phrasePatch.ts` (sin dependencia de `idb`) para poder probarla con un almacén en memoria.

## Requirements

- **FR-001**: El icono de favorito de Home MUST reflejar siempre el valor guardado tras cualquier cambio de pestaña o de frase.
- **FR-002**: Pulsar el corazón MUST invertir el valor guardado, no el icono.
- **FR-003**: Ninguna escritura MUST reescribir una frase completa desde un objeto cargado antes.

## Success Criteria

- **SC-001**: Con el escenario de `verify-favoritos.mjs` (cambio de frase + guardar/quitar entre pestañas) hay **0** desincronizaciones; antes del arreglo el escenario fallaba siempre que la frase anterior estaba guardada.
- **SC-002**: Tests unitarios de `phrasePatch` en verde.
