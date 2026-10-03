# Research: Completar Favoritos

## Decisión 1 — Causa raíz exacta del bug (010)

**Archivo**: `src/persistence/IndexedDBService.ts:38`

```ts
export async function getFavoritePhrases(): Promise<Phrase[]> {
  if (!db) throw new Error('Database not initialized');
  // TODO Revisar el true en getAllFromIndex
  return await db.getAllFromIndex(STORE_NAME, 'isFavorite', "true");
}
```

`initDB()` crea el índice `isFavorite` directamente sobre el campo `Phrase.isFavorite`, que es `boolean` en el modelo y se guarda como tal (`toggleFavorite` asigna `phrase.isFavorite = isFavorite` donde `isFavorite: boolean`). IndexedDB indexa por el tipo de dato real almacenado — una consulta con la clave `"true"` (string) nunca matchea una clave almacenada como `true` (boolean). Confirma la hipótesis de la spec original: esta consulta no devuelve resultados reales hoy.

**Decision original (incorrecta, corregida durante la implementación — ver `tasks.md` T010, Hallazgo 1)**: ~~Cambiar `"true"` por `true` (booleano) en la llamada a `getAllFromIndex`~~. Al implementar, TypeScript rechazó ese cambio: `IDBValidKey` (el tipo de clave que acepta un índice de IndexedDB) es `number | string | Date | BufferSource | IDBValidKey[]` — **`boolean` no es un tipo de clave válido** según el spec de IndexedDB. Un índice creado sobre un campo `boolean` (`store.createIndex('isFavorite', 'isFavorite')`) nunca indexa ningún registro, sin importar qué valor se le pase a la consulta — el bug era más profundo de lo que el TODO original sugería.

**Decision final**: `getFavoritePhrases()` no usa el índice `isFavorite`. Se reemplaza por `db.getAll(STORE_NAME)` + `.filter(phrase => phrase.isFavorite === true)` en memoria.

**Rationale**: Es exactamente el mismo patrón que el propio código ya usa para `hasShown` (también `boolean`, también con un índice creado que nunca se usa) dentro de `getRandomPhrase()` — el autor original ya había resuelto este mismo problema para otro campo booleano, filtrando en memoria en vez de consultar por índice. El catálogo de frases es pequeño (decenas/cientos), así que un `getAll()` + filtro no tiene costo de performance relevante.

**Alternatives considered**: Cambiar el tipo de `isFavorite` a `number` (0/1) para poder indexarlo — descartado por ser un cambio de modelo de datos innecesario y más invasivo que simplemente filtrar en memoria, además de requerir migrar los datos ya persistidos.

## Decisión 2 — Cómo cablear el botón de bookmark sin acoplar `CardPhrase` a IndexedDB

**Archivo**: `src/components/home/CardPhrase.tsx`

`CardPhrase` hoy es mayormente presentacional (recibe `phrase`, `color`, `adBannerId` como props; su única llamada a persistencia es indirecta vía `Clipboard.write`, que no es lectura/escritura de la app). Se renderiza 3 veces por `CardsContainer` con el mismo objeto `phrase` (efecto visual de stack de tarjetas), cada instancia con su propio `color`.

**Decision**: `CardsContainer` (el padre) es dueño del estado `isFavorite` y de la llamada a `toggleFavorite`; `CardPhrase` recibe `isFavorite: boolean` y `onToggleFavorite: () => void` como props nuevas, sin acceder directamente a `IndexedDBService`.

**Rationale**: Evita que las 3 instancias de `CardPhrase` dupliquen lógica de persistencia o queden desincronizadas entre sí (las 3 comparten la misma frase, así que deben compartir el mismo estado `isFavorite`). Consistente con cómo `CardsContainer` ya centraliza `useUserGender()` para las 3 instancias (Spec 016).

**Alternatives considered**: Que cada `CardPhrase` maneje su propio estado local de `isFavorite` — descartado porque las 3 instancias mostrarían potencialmente estados distintos entre sí tras un toggle (condición de carrera visual), ya que solo una es visualmente interactiva pero las 3 están montadas.

## Decisión 3 — Consistencia de estado entre Home y Favoritos (FR-009)

El objeto `phrase` que `MainHome` mantiene en estado y pasa a `Home` → `CardsContainer` se fija en el momento de `loadRandomPhrase()` y no se vuelve a leer de IndexedDB automáticamente. Si el usuario desmarca esa misma frase desde el tab de Favoritos, el objeto en memoria en Home queda desactualizado (`isFavorite: true` obsoleto) — y como los tabs de Ionic mantienen los componentes montados al cambiar de pestaña (no hacen remount), un simple `useState` inicializado una sola vez no se refresca solo.

**Decision**: Usar `useIonViewWillEnter` (hook nativo de `@ionic/react`) en `CardsContainer` para releer `isFavorite` desde IndexedDB (`getPhraseById(phrase.id)`) cada vez que el tab Home vuelve a activarse, y el mismo hook en `Favorites.tsx` para releer la lista completa (`getFavoritePhrases()`) cada vez que el tab Favoritos vuelve a activarse.

**Rationale**: Es el mecanismo idiomático de Ionic para exactamente este escenario (pestañas que permanecen montadas y necesitan refrescar datos al volver a ser visibles) — ya evaluado y usado con el mismo propósito (refrescar datos al revisitar una pestaña) para el idioma en Home/Settings durante `specs/016-auditoria-buenas-practicas`. No introduce un mecanismo nuevo de sincronización entre pantallas (pub-sub, contexto global, etc.), que violaría el principio de no complejizar más de lo necesario.

**Alternatives considered**:
- **Context de React global para favoritos**: descartado, mismo motivo que se descartó para idioma en Spec 016 — cambia el modelo de datos actual y excede el alcance de esta spec.
- **Recargar toda la lista de frases en Home al volver**: descartado — innecesario, alcanza con releer el campo `isFavorite` de la frase puntual que se está mostrando.

## Decisión 4 — Diseño de la pantalla `Favorites.tsx`

No existe ningún patrón de lista en el proyecto que se pueda reusar 1:1 (`CardPhrase` está diseñado para el stack expandible de Home, no para una lista plana). `Settings.tsx` sí usa `IonList`/`IonItem` para su lista de opciones — mismo patrón de componentes de Ionic, aunque con propósito distinto (navegación, no contenido).

**Decision**: `Favorites.tsx` usa `IonList`/`IonItem` (consistente con `Settings.tsx`), un ícono de bookmark relleno por ítem (tocar para desmarcar, FR-007), contenido en el idioma actual vía `useAppLanguage()` (FR-008), y un estado vacío centrado con texto cuando `getFavoritePhrases()` devuelve `[]` (FR-006).

**Rationale**: Reusa componentes de Ionic ya usados en el proyecto (Principio V) en vez de construir un layout de tarjetas nuevo solo para esta lista; es más simple y más legible como lista plana de frases guardadas.

**Alternatives considered**: Reusar `CardPhrase` en modo lista — descartado, ese componente está fuertemente acoplado a la animación de expansión/stack de Home (posición absoluta, alturas en vh), no encaja en un layout de lista scrolleable.

## Decisión 5 — Ícono del tab nuevo

**Decision**: `bookmark` (relleno) de `ionicons`, ya usado en el botón comentado de `CardPhrase.tsx` (`bookmarkOutline` para el estado no-favorito). Se reusa la misma pareja de íconos (`bookmark`/`bookmarkOutline`) tanto en el botón de la tarjeta como en los ítems de la lista de Favoritos, para consistencia visual.

**Rationale**: Ya están disponibles en `ionicons` (dependencia ya instalada), sin necesidad de agregar íconos nuevos.

## Nota sobre el TODO ya documentado en `MainHome.tsx`

El `IonTabButton` de Home dispara `loadRandomPhraseWithAd()` en cada `onClick`, incluso al navegar desde otro tab (hay un TODO explícito: "Verificar que esté en el home para cargar nueva frase"). Esto significa que, en el comportamiento actual de la app, volver al tab Home desde Favoritos puede disparar un rewarded ad y cargar una frase nueva (aleatoria) antes de que el usuario llegue a ver si el ícono de bookmark quedó actualizado. **Esto es un comportamiento preexistente fuera de alcance de esta spec** (no se toca `loadRandomPhraseWithAd` ni ese TODO) — la corrección de FR-009 vía `useIonViewWillEnter` sigue siendo correcta independientemente de esto: si la frase mostrada cambia por ese flujo, el nuevo `useIonViewWillEnter` la vuelve a leer igual, y si no cambia (el usuario no completa el ad), también queda correctamente actualizada.
