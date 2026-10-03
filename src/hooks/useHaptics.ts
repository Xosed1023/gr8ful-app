import { Haptics, ImpactStyle } from "@capacitor/haptics";

const STORAGE_KEY = "haptics";
/** Dos disparos más juntos que esto se tratan como uno (evita el doble toque cuando un botón ya vibra por su cuenta). */
const MIN_GAP_MS = 60;

/** Los hápticos están activados salvo que el usuario los apague en Ajustes. */
export function isHapticsEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

export function setHapticsEnabled(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // sin almacenamiento: se queda activado por defecto
  }
}

let lastFiredAt = 0;

/**
 * Dispara el feedback háptico estándar de la app (ImpactStyle.Medium),
 * con fallback a navigator.vibrate cuando el plugin nativo no está disponible
 * (p. ej. en navegador). No hace nada si el usuario lo desactivó en Ajustes.
 */
export async function hapticTap(): Promise<void> {
  if (!isHapticsEnabled()) return;
  const now = Date.now();
  if (now - lastFiredAt < MIN_GAP_MS) return;
  lastFiredAt = now;
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    if (navigator.vibrate) navigator.vibrate(50);
  }
}

const INTERACTIVE =
  'button, [role="button"], [role="switch"], ion-tab-button, ion-button, a[href]';

/**
 * Háptico en TODA interacción con botones, sin tener que añadirlo uno a uno.
 * Va en la fase de captura para no perder los botones que detienen la propagación
 * del clic; si el botón ya vibra por su cuenta, `hapticTap` descarta el duplicado.
 */
export function installGlobalHaptics() {
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element | null;
      const control = target?.closest?.(INTERACTIVE);
      if (!control || control.matches(':disabled, [aria-disabled="true"]')) return;
      void hapticTap();
    },
    true
  );
}
