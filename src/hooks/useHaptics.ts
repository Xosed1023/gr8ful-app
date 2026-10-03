import { Haptics, ImpactStyle } from "@capacitor/haptics";

/**
 * Dispara el feedback háptico estándar de la app (ImpactStyle.Medium),
 * con fallback a navigator.vibrate cuando el plugin nativo no está disponible
 * (p. ej. en navegador). Antes solo CardPhrase.tsx tenía este fallback.
 */
export async function hapticTap(): Promise<void> {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    if (navigator.vibrate) navigator.vibrate(50);
  }
}
