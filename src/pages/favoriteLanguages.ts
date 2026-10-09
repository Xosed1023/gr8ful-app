import { LanguageKeys } from "../persistence/languages";

/** Orden fijo de los idiomas de la app. */
export const ALL_LANGUAGES: LanguageKeys[] = ["es", "en", "fr"];

/** Nombre de cada idioma en su propio idioma (así se reconoce sea cual sea el de la app). */
export const LANGUAGE_NAME: Record<LanguageKeys, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
};

/** Las versiones de una frase distintas a la del idioma de la app, en orden fijo. */
export const otherLanguages = (current: LanguageKeys): LanguageKeys[] =>
  ALL_LANGUAGES.filter((language) => language !== current);
