import { LanguageKeys } from "../persistence/languages";

/** Textos de las acciones de las tarjetas de Favoritos (spec 034). */
export const FavoritesActionsText = {
  copy: { es: "Copiar frase", en: "Copy quote", fr: "Copier la citation" },
  share: { es: "Compartir frase", en: "Share quote", fr: "Partager la citation" },
  copied: { es: "Frase copiada", en: "Quote copied", fr: "Citation copiée" },
  copyError: { es: "No se pudo copiar", en: "Couldn't copy", fr: "Copie impossible" },
} satisfies Record<string, Record<LanguageKeys, string>>;
