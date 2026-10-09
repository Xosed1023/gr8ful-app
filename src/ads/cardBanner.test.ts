import { beforeEach, describe, expect, it, vi } from "vitest";

const admob = vi.hoisted(() => ({
  showBanner: vi.fn().mockResolvedValue(undefined),
  hideBanner: vi.fn().mockResolvedValue(undefined),
  resumeBanner: vi.fn().mockResolvedValue(undefined),
  removeBanner: vi.fn().mockResolvedValue(undefined),
  addListener: vi.fn().mockResolvedValue({ remove: vi.fn() }),
}));
const native = vi.hoisted(() => ({ value: true }));

vi.mock("@capacitor-community/admob", () => ({
  AdMob: admob,
  BannerAdPluginEvents: { FailedToLoad: "bannerAdFailedToLoad" },
  BannerAdPosition: { BOTTOM_CENTER: "BOTTOM_CENTER" },
  BannerAdSize: { ADAPTIVE_BANNER: "ADAPTIVE_BANNER" },
}));
vi.mock("@capacitor/core", () => ({
  Capacitor: { isNativePlatform: () => native.value, getPlatform: () => "android" },
}));

import {
  __flushCardBannerForTests as flush,
  __resetCardBannerForTests as reset,
  hasOpenCardBanner,
  hideCardBanner,
  setHomeVisible,
  showCardBanner,
} from "./cardBanner";

const en = { ownerId: "en", adId: "ca-test/en", margin: 300 };
const es = { ownerId: "es", adId: "ca-test/es", margin: 200 };

describe("cardBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    native.value = true;
    vi.stubEnv("VITE_IS_TESTING", "false");
    reset();
  });

  it("en modo pruebas usa el banner de prueba de Google en lugar del adId de la tarjeta", async () => {
    vi.stubEnv("VITE_IS_TESTING", "true");
    showCardBanner(en);
    await flush();
    expect(admob.showBanner).toHaveBeenCalledWith(
      expect.objectContaining({
        adId: "ca-app-pub-3940256099942544/6300978111",
        isTesting: true,
        margin: 300,
      })
    );
  });

  it("al abrir una tarjeta crea el banner con su margen y adId", async () => {
    showCardBanner(en);
    await flush();
    expect(admob.showBanner).toHaveBeenCalledTimes(1);
    expect(admob.showBanner).toHaveBeenCalledWith(
      expect.objectContaining({
        adId: "ca-test/en",
        margin: 300,
        position: "BOTTOM_CENTER",
        adSize: "ADAPTIVE_BANNER",
      })
    );
  });

  it("al cerrar la tarjeta oculta el banner y al reabrirla lo reanuda", async () => {
    showCardBanner(en);
    await flush();
    hideCardBanner("en");
    await flush();
    expect(admob.hideBanner).toHaveBeenCalledTimes(1);
    showCardBanner(en);
    await flush();
    expect(admob.resumeBanner).toHaveBeenCalledTimes(1);
    expect(admob.showBanner).toHaveBeenCalledTimes(1);
  });

  it("dos aperturas seguidas se unifican: solo se crea el banner de la última", async () => {
    showCardBanner(en);
    showCardBanner(es);
    await flush();
    expect(admob.showBanner).toHaveBeenCalledTimes(1);
    expect(admob.showBanner).toHaveBeenCalledWith(
      expect.objectContaining({ adId: "ca-test/es" })
    );
  });

  it("abrir otra tarjeta con el banner ya creado lo reemplaza", async () => {
    showCardBanner(en);
    await flush();
    showCardBanner(es);
    await flush();
    expect(admob.removeBanner).toHaveBeenCalledTimes(1);
    expect(admob.showBanner).toHaveBeenLastCalledWith(
      expect.objectContaining({ adId: "ca-test/es" })
    );
  });

  it("al cerrar la última vuelve el banner de la anterior", async () => {
    showCardBanner(en);
    showCardBanner(es);
    await flush();
    hideCardBanner("es");
    await flush();
    expect(admob.showBanner).toHaveBeenLastCalledWith(
      expect.objectContaining({ adId: "ca-test/en" })
    );
  });

  it("cerrar una tarjeta que no estaba abierta no llama al plugin", async () => {
    hideCardBanner("fr");
    await flush();
    expect(admob.hideBanner).not.toHaveBeenCalled();
  });

  it("al salir de Home oculta el banner y al volver lo reanuda", async () => {
    showCardBanner(en);
    await flush();
    setHomeVisible(false);
    await flush();
    expect(admob.hideBanner).toHaveBeenCalledTimes(1);
    setHomeVisible(true);
    await flush();
    expect(admob.resumeBanner).toHaveBeenCalledTimes(1);
  });

  it("abrir y cerrar rápido deja el banner oculto y sin fantasmas", async () => {
    showCardBanner(en);
    hideCardBanner("en");
    showCardBanner(en);
    hideCardBanner("en");
    await flush();
    const shows = admob.showBanner.mock.calls.length;
    const hides = admob.hideBanner.mock.calls.length;
    expect(shows).toBeLessThanOrEqual(1);
    expect(shows - hides).toBeLessThanOrEqual(0);
  });

  it("sin adId no llama al plugin", async () => {
    showCardBanner({ ownerId: "fr", adId: "", margin: 100 });
    await flush();
    expect(admob.showBanner).not.toHaveBeenCalled();
  });

  it("fuera de plataforma nativa es un no-op", async () => {
    native.value = false;
    showCardBanner(en);
    await flush();
    expect(admob.showBanner).not.toHaveBeenCalled();
  });

  it("un error del plugin no se propaga", async () => {
    admob.showBanner.mockRejectedValueOnce(new Error("boom"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    showCardBanner(en);
    await expect(flush()).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  describe("banner de Favoritos (spec 029)", () => {
    const fav = { ownerId: "favorites", screen: "favorites" as const, adId: "ca-test/fav", margin: 90 };

    it("se muestra aunque Home no esté visible", async () => {
      setHomeVisible(false);
      showCardBanner(fav);
      await flush();
      expect(admob.showBanner).toHaveBeenCalledTimes(1);
      expect(admob.showBanner).toHaveBeenCalledWith(
        expect.objectContaining({ adId: "ca-test/fav", margin: 90, position: "BOTTOM_CENTER" })
      );
    });

    it("con una tarjeta abierta en Home, al entrar en Favoritos manda el de Favoritos", async () => {
      showCardBanner(en);
      await flush();
      setHomeVisible(false); // Home deja de verse al cambiar de pestaña
      showCardBanner(fav);
      await flush();
      expect(admob.showBanner).toHaveBeenLastCalledWith(expect.objectContaining({ adId: "ca-test/fav" }));
    });

    it("al salir de Favoritos hacia Home vuelve el banner de la tarjeta que seguía abierta", async () => {
      showCardBanner(en);
      await flush();
      setHomeVisible(false);
      showCardBanner(fav);
      await flush();
      hideCardBanner("favorites");
      setHomeVisible(true);
      await flush();
      expect(admob.showBanner).toHaveBeenLastCalledWith(
        expect.objectContaining({ adId: "ca-test/en", margin: 300 })
      );
    });

    it("al salir de Favoritos hacia Ajustes se oculta el banner", async () => {
      setHomeVisible(false);
      showCardBanner(fav);
      await flush();
      hideCardBanner("favorites");
      await flush();
      expect(admob.hideBanner).toHaveBeenCalledTimes(1);
    });

    it("volver a Favoritos reanuda el banner sin recrearlo", async () => {
      setHomeVisible(false);
      showCardBanner(fav);
      await flush();
      hideCardBanner("favorites");
      await flush();
      showCardBanner(fav);
      await flush();
      // Se crea una sola vez; las demás veces se oculta y se reanuda
      expect(admob.showBanner).toHaveBeenCalledTimes(1);
      expect(admob.hideBanner).toHaveBeenCalledTimes(1);
      expect(admob.resumeBanner).toHaveBeenCalled();
    });

    it("las tarjetas de Home no interrumpen al banner de Favoritos mientras se está en esa pestaña", async () => {
      setHomeVisible(false);
      showCardBanner(fav);
      showCardBanner(en); // p. ej. una tarjeta que termina de abrirse justo al cambiar de pestaña
      await flush();
      expect(admob.showBanner).toHaveBeenLastCalledWith(expect.objectContaining({ adId: "ca-test/fav" }));
    });

    it("el banner de Favoritos no cuenta como tarjeta abierta para los intersticiales", async () => {
      showCardBanner(fav);
      expect(hasOpenCardBanner()).toBe(false);
      showCardBanner(en);
      expect(hasOpenCardBanner()).toBe(true);
    });
  });
});
