import { LanguageKeys } from "../../persistence/languages";

/** Comillas tipográficas de cada idioma (en francés llevan espacio fino por dentro). */
export const QUOTE_MARKS: Record<LanguageKeys, [string, string]> = {
  en: ["\u201C", "\u201D"],
  es: ["\u00AB", "\u00BB"],
  fr: ["\u00AB\u00A0", "\u00A0\u00BB"],
};
