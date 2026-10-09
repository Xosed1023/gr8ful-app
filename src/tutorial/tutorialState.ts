const DONE_KEY = "tutorialDone";

/** ¿El usuario ya vio (o saltó) el tutorial? */
export function isTutorialDone(): boolean {
  try {
    return localStorage.getItem(DONE_KEY) === "true";
  } catch {
    return false;
  }
}

export function markTutorialDone() {
  try {
    localStorage.setItem(DONE_KEY, "true");
  } catch {
    // sin almacenamiento: el tutorial podría repetirse en el próximo arranque
  }
}

export function resetTutorial() {
  try {
    localStorage.removeItem(DONE_KEY);
  } catch {
    // nada que borrar
  }
}

/**
 * Mientras el tutorial está en marcha no deben contar los anuncios (puntos del sistema de la
 * spec 027) ni mostrarse banners: el usuario está aprendiendo, no usando la app.
 */
let active = false;
export const isTutorialActive = () => active;
export const setTutorialActive = (value: boolean) => {
  active = value;
};

/** «Ver el tutorial de nuevo» (Ajustes): Home lo recoge al entrar. */
let replayRequested = false;
export const requestTutorialReplay = () => {
  replayRequested = true;
};
export const peekReplay = () => replayRequested;
export const consumeReplay = () => {
  replayRequested = false;
};

interface StartInput {
  done: boolean;
  onboardingComplete: boolean;
  replay: boolean;
}

/** ¿Toca lanzar el tutorial al entrar en Home? (función pura). */
export function shouldStartTutorial({ done, onboardingComplete, replay }: StartInput): boolean {
  if (replay) return true;
  return onboardingComplete && !done;
}
