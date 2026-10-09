import { Haptics, NotificationType } from "@capacitor/haptics";
import { isHapticsEnabled } from "../hooks/useHaptics";

/**
 * Háptico suave de éxito para el mensaje «Racha restaurada»: la notificación de éxito del
 * sistema es más ligera que el toque estándar de `hapticTap`. Respeta el interruptor de Ajustes
 * y, sin plugin nativo (navegador), cae a una vibración muy breve.
 */
export async function hapticSoftSuccess(): Promise<void> {
  if (!isHapticsEnabled()) return;
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    if (navigator.vibrate) navigator.vibrate(30);
  }
}
