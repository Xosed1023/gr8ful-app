# Data Model: Completar Compartir Frase

Sin entidades nuevas. Cambios de contrato:

## `CardPhraseProps` (`src/components/home/CardPhrase.tsx`)

```ts
interface CardPhraseProps {
  phrase: Pick<Phrase, "content" | "type" | "author">; // + "author" (research.md Decisión 2)
  color: CardColors;
  adBannerId: string;
  language: LanguageKeys; // idioma propio de la tarjeta (en | es | fr)
  isFavorite: boolean;
  onToggleFavorite: () => void;
}
```

## Dentro de `CardPhrase`

```ts
// `language` llega por prop desde CardsContainer — research.md Decisión 1

// Texto mostrado:
<h1>{phrase.content[language]}</h1> // antes: phrase.content.es

// Botón copiar:
await Clipboard.write({ string: phrase.content[language] }); // antes: phrase.content.es

// Botón compartir (nuevo):
const handleShare = async (e) => {
  e.stopPropagation(); // FR-006
  try {
    await Share.share({
      text: `${phrase.content[language]}\n\n— ${phrase.author}`, // research.md Decisión 3
    });
  } catch (error) {
    console.error("Error al compartir", error); // research.md Decisión 4 — sin toast
  }
};
```

## Dependencia nueva

`package.json`: `"@capacitor/share": "^7.0.4"` (research.md Decisión 5). Tras instalarla, requiere `npx cap sync` para registrar el plugin nativo en `android/`/`ios/`.
