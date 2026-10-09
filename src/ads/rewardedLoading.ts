import { useSyncExternalStore } from "react";

/**
 * Estado global «se está preparando un anuncio recompensado» (spec 033): lo enciende
 * `showRewarded` y lo lee el loader. Es un valor suelto, no un contexto: el anuncio lo pueden
 * pedir pantallas muy distintas (Home y el aviso de rescate de racha).
 */
let loading = false;
const listeners = new Set<() => void>();

export function setRewardedLoading(value: boolean) {
  if (loading === value) return;
  loading = value;
  listeners.forEach((listener) => listener());
}

export const isRewardedLoading = () => loading;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useRewardedLoading = () => useSyncExternalStore(subscribe, isRewardedLoading);
