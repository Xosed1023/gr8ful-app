import { describe, expect, it } from "vitest";
import {
  CALM_DURATION,
  CALM_SPRING,
  calmFade,
  calmFadeUp,
  calmStagger,
  calmTransition,
  dampingRatio,
} from "./motion";

describe("motion", () => {
  it("el resorte calmo está sobreamortiguado: nunca rebota", () => {
    expect(dampingRatio(CALM_SPRING)).toBeGreaterThanOrEqual(1);
  });

  it("las duraciones están entre 0,3 y 0,7 s", () => {
    for (const d of Object.values(CALM_DURATION)) {
      expect(d).toBeGreaterThanOrEqual(0.3);
      expect(d).toBeLessThanOrEqual(0.7);
    }
  });

  it("con movimiento reducido no hay desplazamiento ni duración", () => {
    expect(calmTransition(true)).toEqual({ duration: 0 });
    const v = calmFadeUp(true);
    expect(v.hidden).toMatchObject({ opacity: 0, y: 0 });
    expect(v.visible).toMatchObject({ transition: { duration: 0 } });
    expect(calmStagger(true, 0.4).visible).toMatchObject({ transition: { staggerChildren: 0, delayChildren: 0 } });
  });

  it("sin reducir, entra con ascenso leve y se posa sin rebote", () => {
    const v = calmFadeUp(false);
    expect(v.hidden).toMatchObject({ opacity: 0, y: 14 });
    expect(v.visible).toMatchObject({ opacity: 1, y: 0 });
    expect(calmFade(false).hidden).toEqual({ opacity: 0 });
  });
});
