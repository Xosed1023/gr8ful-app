import { useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isOnboardingComplete } from "../persistence/onboardingState";
import {
  consumeReplay,
  isTutorialDone,
  markTutorialDone,
  peekReplay,
  shouldStartTutorial,
} from "./tutorialState";

/** Margen tras entrar en Home para que las tarjetas terminen su animación de entrada. */
const START_DELAY_MS = 2000;

/**
 * Decide cuándo lanzar el tutorial de Home (spec 030): al entrar, si el onboarding está
 * terminado y aún no se vio, o si se pidió repetirlo desde Ajustes. `blocked` (rescate de
 * racha pendiente) lo retrasa hasta que se resuelva. Salir de Home lo detiene sin darlo por visto.
 */
export function useTutorialTrigger(blocked: boolean) {
  const [running, setRunning] = useState(false);
  const [entered, setEntered] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
  };

  const schedule = useCallback(() => {
    clear();
    const replay = peekReplay();
    if (!shouldStartTutorial({ done: isTutorialDone(), onboardingComplete: isOnboardingComplete(), replay })) {
      return;
    }
    timer.current = setTimeout(() => {
      if (blockedRef.current) return; // se reintenta cuando el bloqueo se resuelva
      // Sin tarjetas (aún no hay frase) no hay nada que señalar
      if (!document.querySelector('[data-tutorial="card-en"]')) return;
      consumeReplay();
      setRunning(true);
    }, START_DELAY_MS);
  }, []);

  useIonViewDidEnter(() => {
    setEntered(true);
    schedule();
  });

  useIonViewWillLeave(() => {
    setEntered(false);
    clear();
    setRunning(false);
  });

  // Al resolverse el rescate de racha, el tutorial pendiente arranca
  useEffect(() => {
    if (entered && !blocked && !running) schedule();
  }, [blocked, entered, running, schedule]);

  useEffect(() => clear, []);

  const finish = useCallback(() => {
    markTutorialDone();
    consumeReplay();
    setRunning(false);
  }, []);

  return { running, finish };
}
