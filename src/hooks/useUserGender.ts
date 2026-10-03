import { useState } from "react";

export type Gender = "M" | "W";

/**
 * Centraliza la lectura de `gender` desde localStorage, ya tipada.
 * Preserva el comportamiento existente en todos los call-sites migrados:
 * cualquier valor distinto de "M" (incluido null/inválido) se trata como "W".
 */
export function useUserGender() {
  const [gender] = useState<Gender>(() =>
    localStorage.getItem("gender") === "M" ? "M" : "W"
  );

  return { gender, isMale: gender === "M", isWoman: gender === "W" };
}
