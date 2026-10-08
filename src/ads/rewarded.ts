import {
  AdMob,
  RewardAdOptions,
  RewardAdPluginEvents,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";
import { loadAdState, markRewarded, saveAdState } from "./interstitialPolicy";

// ID de prueba oficial de Google AdMob — https://developers.google.com/admob/ios/test-ads
// y https://developers.google.com/admob/android/test-ads. Devuelve anuncios de test
// para toda solicitud, sin depender de configuración de cuenta/consentimiento.
const TEST_REWARDED_AD_ID =
  Capacitor.getPlatform() === "ios"
    ? "ca-app-pub-3940256099942544/1712485313"
    : "ca-app-pub-3940256099942544/5224354917";

/**
 * Muestra un anuncio recompensado. Devuelve `true` solo si el usuario ganó la
 * recompensa; cualquier fallo (sin red, sin anuncio, cierre anticipado) es `false`.
 */
export async function showRewarded(): Promise<boolean> {
  const onLoaded = await AdMob.addListener(RewardAdPluginEvents.Loaded, (info) => {
    console.log("Rewarded: anuncio de prueba cargado", info);
  });
  const onFailed = await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
    console.error("Rewarded: fallo al cargar", error);
  });
  try {
    const options: RewardAdOptions = { adId: TEST_REWARDED_AD_ID, isTesting: true };
    await AdMob.prepareRewardVideoAd(options);
    const reward = await AdMob.showRewardVideoAd();
    const rewarded = reward.amount > 0;
    // Quien eligió ver un anuncio recibe un respiro sin intersticiales
    if (rewarded) saveAdState(markRewarded(loadAdState(), Date.now()));
    return rewarded;
  } catch (error) {
    console.error("Error mostrando rewarded", error);
    return false;
  } finally {
    onLoaded.remove();
    onFailed.remove();
  }
}
