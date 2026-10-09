import type { LanguageKeys } from "../persistence/languages";

/** Textos del mensaje «Racha restaurada» (tras ver el anuncio del rescate). */
export const AppStreakRestoredLanguage: Record<
  "title" | "body" | "unit",
  Record<LanguageKeys, string>
> = {
  title: {
    es: "¡Racha restaurada!",
    en: "Streak restored!",
    fr: "Série restaurée !",
  },
  body: {
    es: "Tu constancia sigue en pie.",
    en: "Your consistency lives on.",
    fr: "Votre constance continue.",
  },
  // Siempre plural: solo se rescata una racha de 2 o más y, al restaurarla, sube a 3 o más
  unit: {
    es: "días seguidos",
    en: "day streak",
    fr: "jours de suite",
  },
};
