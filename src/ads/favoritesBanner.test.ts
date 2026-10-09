import { describe, expect, it } from "vitest";
import { favoritesBannerAdId } from "./favoritesBanner";

const env = {
  VITE_IOS_FAVORITES_BANNER: "ios/fav",
  VITE_ANDROID_FAVORITES_BANNER: "and/fav",
  VITE_IOS_EN_CARD: "ios/en",
  VITE_ANDROID_EN_CARD: "and/en",
};

describe("favoritesBannerAdId", () => {
  it("usa la unidad propia de Favoritos según la plataforma", () => {
    expect(favoritesBannerAdId(env, "ios")).toBe("ios/fav");
    expect(favoritesBannerAdId(env, "android")).toBe("and/fav");
  });

  it("mientras no exista, reutiliza la unidad de la tarjeta EN", () => {
    const sinPropia = { VITE_IOS_EN_CARD: "ios/en", VITE_ANDROID_EN_CARD: "and/en" };
    expect(favoritesBannerAdId(sinPropia, "ios")).toBe("ios/en");
    expect(favoritesBannerAdId(sinPropia, "android")).toBe("and/en");
  });

  it("una variable vacía cuenta como ausente", () => {
    expect(favoritesBannerAdId({ ...env, VITE_ANDROID_FAVORITES_BANNER: "" }, "android")).toBe("and/en");
  });

  it("sin ningún ID devuelve cadena vacía (el coordinador no hace nada)", () => {
    expect(favoritesBannerAdId({}, "ios")).toBe("");
  });
});
