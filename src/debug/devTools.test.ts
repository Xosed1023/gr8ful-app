import { beforeEach, describe, expect, it } from "vitest";
import { AD_POLICY, loadAdState } from "../ads/interstitialPolicy";
import { loadStreak } from "../streak/streak";
import {
  armInterstitial,
  daysAgoKey,
  resetAdPolicy,
  simulateStreak,
  skipAdGrace,
} from "./devTools";

const NOW = new Date(2026, 9, 12, 10, 0); // 12 oct 2026

beforeEach(() => localStorage.clear());

describe("daysAgoKey", () => {
  it("resta días de calendario, también entre meses", () => {
    expect(daysAgoKey(0, NOW)).toBe("2026-10-12");
    expect(daysAgoKey(1, NOW)).toBe("2026-10-11");
    expect(daysAgoKey(3, new Date(2026, 10, 2))).toBe("2026-10-30");
  });
});

describe("simulateStreak", () => {
  it("«ayer» deja una racha que sube al abrir hoy", () => {
    simulateStreak("yesterday", NOW);
    expect(loadStreak()).toEqual({ current: 5, best: 5, lastDay: "2026-10-11" });
  });

  it("«rescate» deja la última apertura hace dos días", () => {
    simulateStreak("rescue", NOW);
    expect(loadStreak()).toEqual({ current: 5, best: 5, lastDay: "2026-10-10" });
  });

  it("«perdida» deja la última apertura hace tres días", () => {
    simulateStreak("lost", NOW);
    expect(loadStreak().lastDay).toBe("2026-10-09");
  });

  it("«reiniciar» borra la racha", () => {
    simulateStreak("yesterday", NOW);
    simulateStreak("reset", NOW);
    expect(loadStreak().current).toBe(0);
  });
});

describe("anuncios", () => {
  it("skipAdGrace deja el primer uso fuera de la gracia", () => {
    skipAdGrace(NOW.getTime());
    expect(NOW.getTime() - (loadAdState().firstSeenAt ?? 0)).toBeGreaterThanOrEqual(AD_POLICY.graceMs);
  });

  it("armInterstitial deja los puntos justos y sin respiros", () => {
    armInterstitial(NOW.getTime());
    const s = loadAdState();
    expect(s.points).toBe(AD_POLICY.pointsPerAd);
    expect(s.quietUntil).toBe(0);
    expect(s.lastShownAt).toBe(0);
  });

  it("resetAdPolicy vuelve al estado inicial", () => {
    armInterstitial();
    resetAdPolicy();
    expect(loadAdState().firstSeenAt).toBeNull();
  });
});
