import { LanguageKeys } from "../persistence/languages";

/** Textos del loader del anuncio recompensado y del aviso de fallo (spec 033). */
export const RewardedText = {
  loading: {
    es: "Preparando tu anuncio…",
    en: "Preparing your ad…",
    fr: "Préparation de votre annonce…",
  },
  error: {
    es: "No pudimos cargar el anuncio. Inténtalo de nuevo en un momento.",
    en: "We couldn't load the ad. Please try again in a moment.",
    fr: "Impossible de charger l'annonce. Réessayez dans un instant.",
  },
} satisfies Record<string, Record<LanguageKeys, string>>;

/** Idioma de la app leído al momento (el loader y el aviso viven fuera de las pantallas). */
export function currentLanguage(): LanguageKeys {
  try {
    const stored = localStorage.getItem("language");
    return stored === "es" || stored === "fr" ? stored : "en";
  } catch {
    return "en";
  }
}
