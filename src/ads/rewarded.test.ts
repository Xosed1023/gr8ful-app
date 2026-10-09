import { beforeEach, describe, expect, it, vi } from "vitest";

const admob = vi.hoisted(() => ({
  addListener: vi.fn(),
  prepareRewardVideoAd: vi.fn(),
  showRewardVideoAd: vi.fn(),
}));
const toast = vi.hoisted(() => ({ present: vi.fn().mockResolvedValue(undefined), create: vi.fn() }));
const handlers = vi.hoisted(() => ({ map: {} as Record<string, () => void> }));

vi.mock("@capacitor-community/admob", () => ({
  AdMob: admob,
  RewardAdPluginEvents: { Loaded: "loaded", FailedToLoad: "failed", Showed: "showed" },
}));
vi.mock("@capacitor/core", () => ({ Capacitor: { getPlatform: () => "android" } }));
vi.mock("@ionic/core", () => ({ toastController: { create: toast.create } }));

import { isRewardedLoading, setRewardedLoading } from "./rewardedLoading";
import { REWARDED_LOAD_TIMEOUT_MS, showRewarded } from "./rewarded";

beforeEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  localStorage.clear();
  setRewardedLoading(false);
  handlers.map = {};
  admob.addListener.mockImplementation(async (event: string, cb: () => void) => {
    handlers.map[event] = cb;
    return { remove: vi.fn() };
  });
  admob.prepareRewardVideoAd.mockResolvedValue(undefined);
  admob.showRewardVideoAd.mockResolvedValue({ amount: 1 });
  toast.create.mockResolvedValue({ present: toast.present });
});

describe("showRewarded", () => {
  it("enciende el loader mientras prepara y lo apaga al terminar", async () => {
    let release: () => void = () => undefined;
    admob.prepareRewardVideoAd.mockReturnValue(new Promise<void>((r) => (release = r)));
    const pending = showRewarded();
    await vi.waitFor(() => expect(isRewardedLoading()).toBe(true));
    release();
    expect(await pending).toBe(true);
    expect(isRewardedLoading()).toBe(false);
  });

  it("apaga el loader en cuanto el anuncio se muestra, sin esperar a que termine", async () => {
    let finish: (v: { amount: number }) => void = () => undefined;
    admob.showRewardVideoAd.mockReturnValue(new Promise((r) => (finish = r)));
    const pending = showRewarded();
    await vi.waitFor(() => expect(admob.showRewardVideoAd).toHaveBeenCalled());
    expect(isRewardedLoading()).toBe(true);
    handlers.map.showed();
    expect(isRewardedLoading()).toBe(false);
    finish({ amount: 1 });
    expect(await pending).toBe(true);
  });

  it("ignora una segunda petición mientras hay una en curso", async () => {
    let release: () => void = () => undefined;
    admob.prepareRewardVideoAd.mockReturnValue(new Promise<void>((r) => (release = r)));
    const first = showRewarded();
    await vi.waitFor(() => expect(admob.prepareRewardVideoAd).toHaveBeenCalledTimes(1));
    try {
      expect(await showRewarded()).toBe(false);
      expect(admob.prepareRewardVideoAd).toHaveBeenCalledTimes(1);
    } finally {
      release();
      await first;
    }
  });

  it("sin recompensa devuelve false y apaga el loader", async () => {
    admob.showRewardVideoAd.mockResolvedValue({ amount: 0 });
    expect(await showRewarded()).toBe(false);
    expect(isRewardedLoading()).toBe(false);
  });

  it("si falla la carga, apaga el loader y avisa solo si se pidió", async () => {
    admob.prepareRewardVideoAd.mockRejectedValue(new Error("sin red"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(await showRewarded()).toBe(false);
    expect(toast.create).not.toHaveBeenCalled();
    expect(await showRewarded({ notifyFailure: true })).toBe(false);
    expect(toast.create).toHaveBeenCalledTimes(1);
    expect(isRewardedLoading()).toBe(false);
    spy.mockRestore();
  });

  it("tras un fallo se puede volver a pedir", async () => {
    admob.prepareRewardVideoAd.mockRejectedValueOnce(new Error("sin red"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(await showRewarded()).toBe(false);
    expect(await showRewarded()).toBe(true);
    spy.mockRestore();
  });

  it("cancela la espera pasado el límite de tiempo", async () => {
    vi.useFakeTimers();
    admob.prepareRewardVideoAd.mockReturnValue(new Promise(() => undefined));
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const pending = showRewarded();
    await vi.advanceTimersByTimeAsync(REWARDED_LOAD_TIMEOUT_MS + 10);
    expect(await pending).toBe(false);
    expect(isRewardedLoading()).toBe(false);
    spy.mockRestore();
  });

  it("al ganar la recompensa abre el respiro sin intersticiales", async () => {
    expect(await showRewarded()).toBe(true);
    const state = JSON.parse(localStorage.getItem("adPolicy") ?? "{}");
    expect(state.quietUntil).toBeGreaterThan(Date.now());
  });
});
