import { LanguageKeys } from "../persistence/languages";

/** Textos de las acciones de las tarjetas de Favoritos (specs 034 y 035). */
export const FavoritesActionsText = {
  copy: { es: "Copiar frase", en: "Copy quote", fr: "Copier la citation" },
  share: { es: "Compartir frase", en: "Share quote", fr: "Partager la citation" },
  copied: { es: "Frase copiada", en: "Quote copied", fr: "Citation copiée" },
  copyError: { es: "No se pudo copiar", en: "Couldn't copy", fr: "Copie impossible" },
  showOthers: {
    es: "Ver en otros idiomas",
    en: "See in other languages",
    fr: "Voir dans d'autres langues",
  },
  hideOthers: { es: "Ocultar idiomas", en: "Hide languages", fr: "Masquer les langues" },
  // `{language}` se sustituye por el nombre del idioma
  copyVersion: {
    es: "Copiar en {language}",
    en: "Copy in {language}",
    fr: "Copier en {language}",
  },
} satisfies Record<string, Record<LanguageKeys, string>>;
