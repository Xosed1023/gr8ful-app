import { useState } from "react";
import { LanguageKeys } from "../persistence/languages";

const DEFAULT_LANGUAGE: LanguageKeys = "en";
const VALID_LANGUAGES: LanguageKeys[] = ["es", "en", "fr"];

function isLanguageKey(value: string | null): value is LanguageKeys {
  return value !== null && (VALID_LANGUAGES as string[]).includes(value);
}

/**
 * Centraliza la lectura de `language` desde localStorage, ya tipada como
 * LanguageKeys, evitando repetir `as keyof typeof` en cada pantalla.
 */
export function useAppLanguage() {
  const [userLanguage] = useState<LanguageKeys>(() => {
    const stored = localStorage.getItem("language");
    return isLanguageKey(stored) ? stored : DEFAULT_LANGUAGE;
  });

  return { userLanguage };
}
