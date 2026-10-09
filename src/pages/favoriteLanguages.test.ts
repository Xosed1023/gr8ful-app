import { describe, expect, it } from "vitest";
import { LANGUAGE_NAME, otherLanguages } from "./favoriteLanguages";

describe("otherLanguages", () => {
  it("devuelve las dos versiones restantes en orden fijo", () => {
    expect(otherLanguages("es")).toEqual(["en", "fr"]);
    expect(otherLanguages("en")).toEqual(["es", "fr"]);
    expect(otherLanguages("fr")).toEqual(["es", "en"]);
  });

  it("tiene un nombre nativo por idioma", () => {
    expect(LANGUAGE_NAME).toEqual({ es: "Español", en: "English", fr: "Français" });
  });
});
