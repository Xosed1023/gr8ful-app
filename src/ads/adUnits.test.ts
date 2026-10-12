import { describe, expect, it } from "vitest";
import { adUnitId, isAdTesting } from "./adUnits";

const env = {
  VITE_ANDROID_REWARDED: "ca-app-pub-1/rw-and",
  VITE_ANDROID_INTERSTITIAL: "ca-app-pub-1/in-and",
  VITE_IOS_REWARDED: "ca-app-pub-1/rw-ios",
};

describe("adUnitId", () => {
  it("en pruebas usa siempre el anuncio de prueba de Google", () => {
    const testing = { ...env, VITE_IS_TESTING: "true" };
    expect(adUnitId("rewarded", "android", testing)).toBe("ca-app-pub-3940256099942544/5224354917");
    expect(adUnitId("interstitial", "ios", testing)).toBe("ca-app-pub-3940256099942544/4411468910");
  });

  it("en producción usa el ID del .env de cada plataforma y formato", () => {
    const prod = { ...env, VITE_IS_TESTING: "false" };
    expect(adUnitId("rewarded", "android", prod)).toBe("ca-app-pub-1/rw-and");
    expect(adUnitId("interstitial", "android", prod)).toBe("ca-app-pub-1/in-and");
    expect(adUnitId("rewarded", "ios", prod)).toBe("ca-app-pub-1/rw-ios");
  });

  it("si falta el ID en producción cae al de prueba (nunca queda vacío)", () => {
    expect(adUnitId("interstitial", "ios", { VITE_IS_TESTING: "false" })).toBe("ca-app-pub-3940256099942544/4411468910");
  });

  it("«false» no cuenta como modo pruebas", () => {
    expect(isAdTesting({ VITE_IS_TESTING: "false" })).toBe(false);
    expect(isAdTesting({})).toBe(false);
  });
});
