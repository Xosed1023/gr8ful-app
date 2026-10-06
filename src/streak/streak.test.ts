import { describe, expect, it } from "vitest";
import {
  acceptRescue,
  daysBetween,
  declineRescue,
  EMPTY_STREAK,
  parseStreak,
  registerOpen,
  StreakState,
} from "./streak";

const state = (current: number, lastDay: string, best = current): StreakState => ({
  current,
  best,
  lastDay,
});

describe("daysBetween", () => {
  it("cuenta días de calendario, también entre meses y años", () => {
    expect(daysBetween("2026-10-05", "2026-10-06")).toBe(1);
    expect(daysBetween("2026-10-31", "2026-11-01")).toBe(1);
    expect(daysBetween("2026-12-31", "2027-01-01")).toBe(1);
    expect(daysBetween("2026-10-06", "2026-10-06")).toBe(0);
    expect(daysBetween("2026-10-06", "2026-10-05")).toBe(-1);
  });

  it("no se desfasa con el cambio de hora", () => {
    expect(daysBetween("2026-03-28", "2026-03-30")).toBe(2);
    expect(daysBetween("2026-10-24", "2026-10-26")).toBe(2);
  });
});

describe("parseStreak", () => {
  it("devuelve «sin racha» si no hay datos o están corruptos", () => {
    expect(parseStreak(null)).toEqual(EMPTY_STREAK);
    expect(parseStreak("no es json")).toEqual(EMPTY_STREAK);
    expect(parseStreak("null")).toEqual(EMPTY_STREAK);
    expect(parseStreak(JSON.stringify({ current: "3", best: 3, lastDay: "2026-10-06" }))).toEqual(
      EMPTY_STREAK
    );
    expect(parseStreak(JSON.stringify({ current: 3, best: 3, lastDay: "ayer" }))).toEqual(
      EMPTY_STREAK
    );
    expect(parseStreak(JSON.stringify({ current: 5, best: 2, lastDay: "2026-10-06" }))).toEqual(
      EMPTY_STREAK
    );
  });

  it("lee un estado válido", () => {
    const valid = state(4, "2026-10-06", 9);
    expect(parseStreak(JSON.stringify(valid))).toEqual(valid);
  });
});

describe("registerOpen", () => {
  it("la primera apertura empieza la racha en 1", () => {
    const { state: next, rescue } = registerOpen(EMPTY_STREAK, "2026-10-06");
    expect(next).toEqual(state(1, "2026-10-06"));
    expect(rescue).toBeNull();
  });

  it("abrir al día siguiente suma 1", () => {
    const { state: next } = registerOpen(state(4, "2026-10-05"), "2026-10-06");
    expect(next).toEqual(state(5, "2026-10-06"));
  });

  it("abrir otra vez el mismo día no cambia nada", () => {
    const before = state(4, "2026-10-06");
    const result = registerOpen(before, "2026-10-06");
    expect(result.state).toBe(before);
    expect(result.rescue).toBeNull();
  });

  it("con el reloj atrasado no cambia nada", () => {
    const before = state(4, "2026-10-06");
    expect(registerOpen(before, "2026-10-01").state).toBe(before);
  });

  it("tras un día sin abrir ofrece rescate sin tocar el estado", () => {
    const before = state(5, "2026-10-04");
    const result = registerOpen(before, "2026-10-06");
    expect(result.rescue).toEqual({ streak: 5 });
    expect(result.state).toBe(before);
  });

  it("el aviso reaparece si se vuelve a abrir sin decidir", () => {
    const before = state(5, "2026-10-04");
    const first = registerOpen(before, "2026-10-06");
    expect(registerOpen(first.state, "2026-10-06").rescue).toEqual({ streak: 5 });
  });

  it("con racha de 1 no hay nada que rescatar", () => {
    const { state: next, rescue } = registerOpen(state(1, "2026-10-04"), "2026-10-06");
    expect(rescue).toBeNull();
    expect(next).toEqual(state(1, "2026-10-06"));
  });

  it("tras dos días o más sin abrir, la racha vuelve a 1 sin rescate y conserva la mejor", () => {
    const { state: next, rescue } = registerOpen(state(8, "2026-10-03"), "2026-10-06");
    expect(rescue).toBeNull();
    expect(next).toEqual(state(1, "2026-10-06", 8));
  });

  it("actualiza la mejor racha al superarla", () => {
    const { state: next } = registerOpen(state(3, "2026-10-05", 3), "2026-10-06");
    expect(next.best).toBe(4);
  });
});

describe("rescate", () => {
  it("aceptar cubre el día perdido y suma hoy", () => {
    expect(acceptRescue(state(5, "2026-10-04"), "2026-10-06")).toEqual(state(6, "2026-10-06"));
  });

  it("rechazar vuelve a 1 y conserva la mejor", () => {
    expect(declineRescue(state(5, "2026-10-04"), "2026-10-06")).toEqual(
      state(1, "2026-10-06", 5)
    );
  });
});
