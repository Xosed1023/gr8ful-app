# Data Model: Completar Favoritos

## Entidad existente (sin cambios de estructura)

**`Phrase`** (`src/models/Phrase.ts`) — ya tiene todos los campos necesarios:

```ts
export interface Phrase {
  id?: number;
  author: string;
  type: TypePhraseEnum;
  content: { es: string; en: string; fr: string };
  isFavorite: boolean;
  hasShown: boolean;
}
```

Esta spec no agrega ni modifica campos — corrige cómo se **consulta** por `isFavorite` y completa la UI que ya debería usarlo.

## Función corregida

### `getFavoritePhrases()`

```ts
// Antes (bug):
db.getAllFromIndex(STORE_NAME, 'isFavorite', "true")
// Después (ver research.md Decisión 1 — corregida durante la implementación,
// boolean no es un tipo de clave válido en IndexedDB, no se puede usar el índice):
const phrases = await db.getAll(STORE_NAME);
return phrases.filter((phrase) => phrase.isFavorite === true);
```

Sin cambios de firma (`Promise<Phrase[]>`).

## Props nuevas / modificadas

### `CardPhraseProps` (`src/components/home/CardPhrase.tsx`)

```ts
interface CardPhraseProps {
  phrase: Pick<Phrase, "content" | "type">; // sin cambios
  color: CardColors;
  adBannerId: string;
  isFavorite: boolean;         // NUEVO
  onToggleFavorite: () => void; // NUEVO — CardPhrase no llama a IndexedDBService directamente
}
```

`CardPhrase` sigue sin necesitar `phrase.id` ni `phrase.isFavorite` directamente — el padre (`CardsContainer`) resuelve el toggle y le pasa el estado ya resuelto, manteniendo `CardPhrase` presentacional (research.md, Decisión 2).

### `CardsContainer` (`src/components/home/CardsContainer.tsx`)

Recibe `phrase: Phrase` (ya lo recibe completo hoy, ver `Home.tsx`). Internamente:

```ts
const [isFavorite, setIsFavorite] = useState(phrase.isFavorite);

useIonViewWillEnter(() => {
  if (phrase.id != null) {
    getPhraseById(phrase.id).then((p) => {
      if (p) setIsFavorite(p.isFavorite);
    });
  }
});

const handleToggleFavorite = async () => {
  if (phrase.id == null) return;
  const next = !isFavorite;
  setIsFavorite(next); // optimista
  await toggleFavorite(phrase.id, next);
};
```

### `Favorites.tsx` (nueva pantalla)

```ts
const Favorites: React.FC = () => {
  const { userLanguage } = useAppLanguage();
  const [favorites, setFavorites] = useState<Phrase[]>([]);

  const loadFavorites = async () => {
    setFavorites(await getFavoritePhrases());
  };

  useEffect(() => { loadFavorites(); }, []);
  useIonViewWillEnter(() => { loadFavorites(); });

  const handleUnfavorite = async (phrase: Phrase) => {
    if (phrase.id == null) return;
    await toggleFavorite(phrase.id, false);
    setFavorites((prev) => prev.filter((p) => p.id !== phrase.id)); // FR-007: desaparece al instante
  };

  // ... IonList/IonItem por cada favorite, mostrando favorite.content[userLanguage]
  // ... estado vacío si favorites.length === 0 (FR-006)
};
```

## Ruta y navegación nuevas (`src/pages/MainHome.tsx`)

```ts
// Dentro de <IonRouterOutlet>:
<Route exact path="/tabs/favorites"><Favorites /></Route>

// Dentro de <IonTabBar>, entre "home" y "settings":
<IonTabButton tab="favorites" href="/tabs/favorites" className="bg-slate-900">
  <IonIcon aria-hidden="true" icon={bookmark} />
</IonTabButton>
```

No se toca la lógica del `IonTabButton` de Home (`loadRandomPhraseWithAd`) — fuera de alcance (research.md, nota final).
