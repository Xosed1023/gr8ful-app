import { Capacitor } from "@capacitor/core";
import { hasOpenCardBanner } from "./cardBanner";
import { showInterstitialIfReady } from "./interstitial";
import {
  AdMoment,
  loadAdState,
  markShown,
  MOMENT_POINTS,
  recordMoment,
  saveAdState,
} from "./interstitialPolicy";

/** Margen para que termine la animación (p. ej. el cierre de la tarjeta) antes del anuncio. */
const SHOW_DELAY_MS = 600;

/**
 * La UI avisa aquí de un «momento de valor» (cerrar una tarjeta, copiar, compartir). Se suman
 * puntos y, si la política lo permite (spec 027), se muestra un intersticial poco después.
 * Un fallo o un anuncio no listo nunca afectan a la acción del usuario.
 */
export function registerAdMoment(moment: AdMoment) {
  if (!Capacitor.isNativePlatform()) return;
  const { state, due } = recordMoment(loadAdState(), MOMENT_POINTS[moment], Date.now());
  saveAdState(state);
  if (!due) return;

  setTimeout(() => {
    // No interrumpir con otra tarjeta abierta
    if (hasOpenCardBanner()) return;
    void showInterstitialIfReady().then((shown) => {
      if (shown) saveAdState(markShown(loadAdState(), Date.now()));
    });
  }, SHOW_DELAY_MS);
}
