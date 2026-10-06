import { App } from "@capacitor/app";
import { useIonViewWillEnter } from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import { showRewarded } from "../ads/rewarded";
import { isOnboardingComplete } from "../persistence/onboardingState";
import {
  acceptRescue,
  declineRescue,
  loadStreak,
  registerOpen,
  saveStreak,
  StreakState,
  todayKey,
} from "./streak";

/**
 * Cuenta la apertura de hoy al entrar en Home y al volver del segundo plano, y
 * expone el rescate cuando falló exactamente un día.
 */
export function useStreak() {
  const [state, setState] = useState<StreakState>(loadStreak);
  const [rescue, setRescue] = useState<{ streak: number } | null>(null);

  const commit = useCallback((next: StreakState) => {
    saveStreak(next);
    setState(next);
  }, []);

  const evaluate = useCallback(() => {
    if (!isOnboardingComplete()) return;
    const result = registerOpen(loadStreak(), todayKey());
    commit(result.state);
    setRescue((prev) => (prev?.streak === result.rescue?.streak ? prev : result.rescue));
  }, [commit]);

  useIonViewWillEnter(evaluate);

  useEffect(() => {
    const listener = App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) evaluate();
    });
    return () => {
      void listener.then((handle) => handle.remove());
    };
  }, [evaluate]);

  /** Pide el anuncio; devuelve `false` si no hubo recompensa (la racha queda intacta). */
  const accept = useCallback(async () => {
    if (!(await showRewarded())) return false;
    commit(acceptRescue(loadStreak(), todayKey()));
    setRescue(null);
    return true;
  }, [commit]);

  const decline = useCallback(() => {
    commit(declineRescue(loadStreak(), todayKey()));
    setRescue(null);
  }, [commit]);

  return { current: state.current, rescue, accept, decline };
}
