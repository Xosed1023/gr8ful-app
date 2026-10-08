import { AdMob, InterstitialAdPluginEvents } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

// ID de prueba oficial de Google AdMob — https://developers.google.com/admob/ios/test-ads
// y https://developers.google.com/admob/android/test-ads. Se mantiene hasta resolver el
// bloqueante de AdMob (ver specs/BACKLOG.md).
const TEST_INTERSTITIAL_AD_ID =
  Capacitor.getPlatform() === "ios"
    ? "ca-app-pub-3940256099942544/4411468910"
    : "ca-app-pub-3940256099942544/1033173712";

/** Reintento tras un fallo de carga (sin red, sin anuncio disponible…). */
const RETRY_MS = 60_000;

let initialized = false;
let ready = false;
let preparing = false;
let showing = false;

/** Carga el siguiente intersticial para tenerlo listo; nunca bloquea nada. */
async function prefetch() {
  if (ready || preparing || showing) return;
  preparing = true;
  try {
    await AdMob.prepareInterstitial({ adId: TEST_INTERSTITIAL_AD_ID, isTesting: true });
    ready = true;
  } catch (error) {
    console.warn("Intersticial: no se pudo precargar", error);
    setTimeout(() => void prefetch(), RETRY_MS);
  } finally {
    preparing = false;
  }
}

/** Registra los eventos del intersticial y lo precarga. Llamar tras `AdMob.initialize`. */
export async function initInterstitial() {
  if (initialized || !Capacitor.isNativePlatform()) return;
  initialized = true;
  void AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
    showing = false;
    ready = false;
    void prefetch();
  });
  void AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, () => {
    ready = false;
  });
  await prefetch();
}

/**
 * Muestra el intersticial si ya está cargado. Si no lo está, no espera ni muestra nada:
 * la acción del usuario nunca se retrasa por un anuncio. Devuelve si se mostró.
 */
export async function showInterstitialIfReady(): Promise<boolean> {
  if (!ready || showing) return false;
  showing = true;
  ready = false;
  try {
    await AdMob.showInterstitial();
    return true;
  } catch (error) {
    console.error("Error mostrando intersticial", error);
    showing = false;
    void prefetch();
    return false;
  }
}
