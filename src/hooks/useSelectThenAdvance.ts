import { useIonViewWillEnter } from "@ionic/react";
import { useCallback, useRef, useState } from "react";
import { hapticTap } from "./useHaptics";

/** La elección se ve (tarjeta tintada y check) antes de que la pantalla salga. */
const SELECT_MS = 320;
/** Duración de la salida del contenido antes de navegar. */
const LEAVE_MS = 300;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const pause = (ms: number) =>
  new Promise<void>((resolve) =>
    setTimeout(resolve, prefersReducedMotion() ? 0 : ms)
  );

/**
 * Pantallas de una sola opción del onboarding (idioma, género, hora): al elegir,
 * 1) la tarjeta responde de inmediato (`chosen`), mientras se hace el trabajo
 * pendiente (`work`: guardar, permisos…); 2) el contenido sale (`leaving`);
 * 3) se navega (`go`). Ignora toques repetidos y se reinicia al volver a la pantalla.
 */
export function useSelectThenAdvance() {
  const [chosen, setChosen] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const busy = useRef(false);

  const reset = useCallback(() => {
    busy.current = false;
    setChosen(null);
    setLeaving(false);
  }, []);
  // Ionic mantiene la pantalla anterior montada: al volver con «atrás» debe verse normal.
  useIonViewWillEnter(reset);

  const select = useCallback(
    async (key: string, work: () => Promise<void> | void, go: () => void) => {
      if (busy.current) return;
      busy.current = true;
      setChosen(key);
      void hapticTap();
      await Promise.all([
        pause(SELECT_MS),
        Promise.resolve()
          .then(work)
          .catch((error) => console.error("Error al guardar la elección", error)),
      ]);
      setLeaving(true);
      await pause(LEAVE_MS);
      go();
    },
    []
  );

  return { chosen, leaving, select };
}
