import { describe, expect, it } from "vitest";
import {
  AD_POLICY,
  AdState,
  EMPTY_AD_STATE,
  markRewarded,
  markShown,
  MOMENT_POINTS,
  parseAdState,
  recordMoment,
} from "./interstitialPolicy";

const MIN = 60_000;
const DAY = 24 * 60 * MIN;
const T0 = new Date(2026, 9, 8, 12, 0).getTime(); // 8 oct 2026, 12:00

/** Estado de un usuario que ya pasó la gracia. */
const seasoned = (over: Partial<AdState> = {}): AdState => ({
  ...EMPTY_AD_STATE,
  firstSeenAt: T0 - 3 * DAY,
  ...over,
});

describe("recordMoment: gracia inicial", () => {
  it("el primer momento fija el primer uso y nunca toca anuncio", () => {
    const { state, due } = recordMoment(EMPTY_AD_STATE, 10, T0);
    expect(state.firstSeenAt).toBe(T0);
    expect(due).toBe(false);
  });

  it("no toca antes de 24 h aunque sobren puntos", () => {
    const state = { ...EMPTY_AD_STATE, firstSeenAt: T0 - 23 * 60 * MIN };
    expect(recordMoment(state, 5, T0).due).toBe(false);
  });

  it("toca pasadas 24 h con los puntos necesarios", () => {
    const state = { ...EMPTY_AD_STATE, firstSeenAt: T0 - AD_POLICY.graceMs };
    expect(recordMoment(state, AD_POLICY.pointsPerAd, T0).due).toBe(true);
  });
});

describe("recordMoment: puntos", () => {
  it("acumula hasta alcanzar los puntos por anuncio", () => {
    let state = seasoned();
    let r = recordMoment(state, MOMENT_POINTS.card_close, T0);
    expect(r.due).toBe(false);
    r = recordMoment(r.state, MOMENT_POINTS.copy, T0);
    expect(r.due).toBe(false);
    r = recordMoment(r.state, MOMENT_POINTS.card_close, T0);
    expect(r.due).toBe(true);
    expect(r.state.points).toBe(3);
  });

  it("compartir pesa el doble que cerrar una tarjeta", () => {
    expect(MOMENT_POINTS.share).toBe(2 * MOMENT_POINTS.card_close);
    const r = recordMoment(seasoned({ points: 1 }), MOMENT_POINTS.share, T0);
    expect(r.due).toBe(true);
  });
});

describe("recordMoment: separación y tope diario", () => {
  it("no toca si el último anuncio fue hace menos de 4 minutos", () => {
    const state = seasoned({ lastShownAt: T0 - 3 * MIN, points: 5 });
    expect(recordMoment(state, 1, T0).due).toBe(false);
  });

  it("toca pasados los 4 minutos, conservando los puntos acumulados", () => {
    const state = seasoned({ lastShownAt: T0 - 4 * MIN, points: 5 });
    expect(recordMoment(state, 1, T0).due).toBe(true);
  });

  it("no toca con el tope diario alcanzado, pero sí al día siguiente", () => {
    const base = seasoned({ lastShownAt: T0 - 30 * MIN, points: 5, day: "2026-10-08", shownToday: AD_POLICY.dailyCap });
    expect(recordMoment(base, 1, T0).due).toBe(false);
    expect(recordMoment(base, 1, T0 + DAY).due).toBe(true);
  });

  it("con el reloj atrasado respecto al último anuncio no toca", () => {
    const state = seasoned({ lastShownAt: T0 + 10 * MIN, points: 5 });
    expect(recordMoment(state, 1, T0).due).toBe(false);
  });
});

describe("markShown", () => {
  it("reinicia los puntos, anota la hora y cuenta el anuncio del día", () => {
    const state = markShown(seasoned({ points: 4 }), T0);
    expect(state.points).toBe(0);
    expect(state.lastShownAt).toBe(T0);
    expect(state.day).toBe("2026-10-08");
    expect(state.shownToday).toBe(1);
  });

  it("reinicia el contador al cambiar de día", () => {
    const yesterday = seasoned({ day: "2026-10-07", shownToday: 3 });
    expect(markShown(yesterday, T0).shownToday).toBe(1);
  });

  it("llegar al tope impide el siguiente", () => {
    let state = seasoned();
    for (let i = 0; i < AD_POLICY.dailyCap; i++) {
      state = markShown(state, T0 + i * 10 * MIN);
    }
    const later = T0 + AD_POLICY.dailyCap * 10 * MIN;
    expect(recordMoment({ ...state, points: 9 }, 1, later).due).toBe(false);
  });
});

describe("markRewarded", () => {
  it("da un respiro de 10 minutos sin intersticiales", () => {
    const state = markRewarded(seasoned({ points: 2 }), T0);
    expect(state.points).toBe(0);
    expect(recordMoment({ ...state, points: 9 }, 1, T0 + 9 * MIN).due).toBe(false);
    expect(recordMoment({ ...state, points: 9 }, 1, T0 + 10 * MIN).due).toBe(true);
  });

  it("también fija el primer uso si aún no existía", () => {
    expect(markRewarded(EMPTY_AD_STATE, T0).firstSeenAt).toBe(T0);
  });
});

describe("parseAdState", () => {
  it("lo ausente o corrupto equivale a un estado inicial", () => {
    expect(parseAdState(null)).toEqual(EMPTY_AD_STATE);
    expect(parseAdState("no es json")).toEqual(EMPTY_AD_STATE);
    expect(parseAdState("null")).toEqual(EMPTY_AD_STATE);
    expect(parseAdState(JSON.stringify({ firstSeenAt: "ayer" }))).toEqual(EMPTY_AD_STATE);
  });

  it("recupera un estado válido", () => {
    const valid = seasoned({ lastShownAt: 5, quietUntil: 6, day: "2026-10-08", shownToday: 2, points: 1 });
    expect(parseAdState(JSON.stringify(valid))).toEqual(valid);
    expect(parseAdState(JSON.stringify(EMPTY_AD_STATE))).toEqual(EMPTY_AD_STATE);
  });
});
