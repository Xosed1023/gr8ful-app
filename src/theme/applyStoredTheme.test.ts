import { beforeEach, describe, expect, it } from "vitest";
import { applyStoredTheme } from "./applyStoredTheme";

const DARK_CLASS = "ion-palette-dark";

describe("applyStoredTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove(DARK_CLASS);
  });

  it("añade la clase cuando darkMode es 'true'", () => {
    localStorage.setItem("darkMode", "true");
    applyStoredTheme();
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);
  });

  it("es insensible a mayúsculas", () => {
    localStorage.setItem("darkMode", "TRUE");
    applyStoredTheme();
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);
  });

  it("quita la clase cuando darkMode es 'false'", () => {
    document.documentElement.classList.add(DARK_CLASS);
    localStorage.setItem("darkMode", "false");
    applyStoredTheme();
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(false);
  });

  it("deja el tema claro cuando darkMode no existe", () => {
    applyStoredTheme();
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(false);
  });
});
