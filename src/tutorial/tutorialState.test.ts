import { beforeEach, describe, expect, it } from "vitest";
import {
  consumeReplay,
  isTutorialActive,
  isTutorialDone,
  markTutorialDone,
  peekReplay,
  requestTutorialReplay,
  resetTutorial,
  setTutorialActive,
  shouldStartTutorial,
} from "./tutorialState";

describe("shouldStartTutorial", () => {
  it("lanza el tutorial tras el onboarding si aún no se vio", () => {
    expect(shouldStartTutorial({ done: false, onboardingComplete: true, replay: false })).toBe(true);
  });

  it("no lo lanza si ya se vio", () => {
    expect(shouldStartTutorial({ done: true, onboardingComplete: true, replay: false })).toBe(false);
  });

  it("no lo lanza antes de terminar el onboarding", () => {
    expect(shouldStartTutorial({ done: false, onboardingComplete: false, replay: false })).toBe(false);
  });

  it("una repetición pedida desde Ajustes lo lanza aunque ya se viera", () => {
    expect(shouldStartTutorial({ done: true, onboardingComplete: true, replay: true })).toBe(true);
  });
});

describe("estado persistido", () => {
  beforeEach(() => {
    localStorage.clear();
    setTutorialActive(false);
    consumeReplay();
  });

  it("empieza sin ver, se marca como visto y se puede reiniciar", () => {
    expect(isTutorialDone()).toBe(false);
    markTutorialDone();
    expect(isTutorialDone()).toBe(true);
    resetTutorial();
    expect(isTutorialDone()).toBe(false);
  });

  it("la bandera de activo se enciende y se apaga", () => {
    expect(isTutorialActive()).toBe(false);
    setTutorialActive(true);
    expect(isTutorialActive()).toBe(true);
    setTutorialActive(false);
    expect(isTutorialActive()).toBe(false);
  });

  it("la petición de repetición se consume una sola vez", () => {
    expect(peekReplay()).toBe(false);
    requestTutorialReplay();
    expect(peekReplay()).toBe(true);
    consumeReplay();
    expect(peekReplay()).toBe(false);
  });
});
