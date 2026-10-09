# Plan: Compartir y copiar en Favoritos

- `src/share/quoteActions.ts`: `copyQuote(text)` y `shareQuoteText(text, author)` (devuelven si se completó); `CardPhrase.tsx` los usa.
- `src/pages/favoritesCopy.ts`: textos EN/ES/FR de las acciones.
- `ShareSheet.tsx`: prop opcional `pauseHomeBanner` (por defecto `true`); Favoritos pasa `false` y gestiona su propio banner.
- `Favorites.tsx/.css`: fila de acciones en cada tarjeta, `ShareSheet` único, ocultar/reponer el banner de Favoritos, `registerAdMoment`.
