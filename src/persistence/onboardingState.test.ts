import { beforeEach, describe, expect, it } from "vitest";
import { isOnboardingComplete, markOnboardingComplete } from "./onboardingState";

describe("onboardingState", () => {
  beforeEach(() => localStorage.clear());

  it("sin marca ni nombre no está completo", () => {
    expect(isOnboardingComplete()).toBe(false);
  });

  it("la carga inicial de frases por sí sola no cuenta como completo", () => {
    localStorage.setItem("gr8fulFirstTime", "true");
    expect(isOnboardingComplete()).toBe(false);
  });

  it("con la marca está completo", () => {
    localStorage.setItem("onboardingCompleted", "true");
    expect(isOnboardingComplete()).toBe(true);
  });

  it("migra a quien ya tenía nombre guardado", () => {
    localStorage.setItem("gr8fulFirstTime", "true");
    localStorage.setItem("name", "Ana");
    expect(isOnboardingComplete()).toBe(true);
    expect(localStorage.getItem("onboardingCompleted")).toBe("true");
  });

  it("un nombre vacío o solo espacios no cuenta", () => {
    localStorage.setItem("name", "   ");
    expect(isOnboardingComplete()).toBe(false);
    expect(localStorage.getItem("onboardingCompleted")).toBeNull();
  });

  it("markOnboardingComplete deja la configuración completa", () => {
    markOnboardingComplete();
    expect(isOnboardingComplete()).toBe(true);
  });
});
