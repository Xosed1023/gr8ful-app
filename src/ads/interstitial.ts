import { AdMob, InterstitialAdPluginEvents } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";
import { adUnitId, isAdTesting } from "./adUnits";

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
    await AdMob.prepareInterstitial({ adId: adUnitId("interstitial"), isTesting: isAdTesting() });
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
