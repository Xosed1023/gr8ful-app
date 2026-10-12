import {
  AdMob,
  RewardAdOptions,
  RewardAdPluginEvents,
} from "@capacitor-community/admob";
import { toastController } from "@ionic/core";
import { adUnitId, isAdTesting } from "./adUnits";
import { loadAdState, markRewarded, saveAdState } from "./interstitialPolicy";
import { RewardedText, currentLanguage } from "./rewardedCopy";
import { setRewardedLoading } from "./rewardedLoading";

/** Espera máxima a que el anuncio esté listo; pasado ese tiempo se avisa y se puede reintentar. */
export const REWARDED_LOAD_TIMEOUT_MS = 15_000;

let inFlight = false;

interface ShowRewardedOptions {
  /** Avisar con un toast si el anuncio no pudo cargarse (el rescate de racha ya tiene su propio aviso). */
  notifyFailure?: boolean;
}

const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Tiempo de espera agotado")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });

async function notifyLoadFailure() {
  try {
    const toast = await toastController.create({
      message: RewardedText.error[currentLanguage()],
      duration: 4000,
      position: "bottom",
    });
    await toast.present();
  } catch {
    // Un fallo del aviso nunca debe afectar a la app
  }
}

/**
 * Muestra un anuncio recompensado. Devuelve `true` solo si el usuario ganó la
 * recompensa; cualquier fallo (sin red, sin anuncio, cierre anticipado) es `false`.
 * Mientras el anuncio se prepara está activo el loader global (spec 033) y no se admite
 * una segunda petición.
 */
export async function showRewarded({ notifyFailure = false }: ShowRewardedOptions = {}): Promise<boolean> {
  if (inFlight) return false;
  inFlight = true;
  setRewardedLoading(true);

  const listeners: { remove: () => void }[] = [];
  try {
    listeners.push(
      await AdMob.addListener(RewardAdPluginEvents.Loaded, (info) => {
        console.log("Rewarded: anuncio de prueba cargado", info);
      }),
      await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
        console.error("Rewarded: fallo al cargar", error);
      }),
      // El anuncio ya está en pantalla: el loader ha cumplido
      await AdMob.addListener(RewardAdPluginEvents.Showed, () => setRewardedLoading(false))
    );
    const options: RewardAdOptions = { adId: adUnitId("rewarded"), isTesting: isAdTesting() };
    await withTimeout(AdMob.prepareRewardVideoAd(options), REWARDED_LOAD_TIMEOUT_MS);
    const reward = await AdMob.showRewardVideoAd();
    const rewarded = reward.amount > 0;
    // Quien eligió ver un anuncio recibe un respiro sin intersticiales
    if (rewarded) saveAdState(markRewarded(loadAdState(), Date.now()));
    return rewarded;
  } catch (error) {
    console.error("Error mostrando rewarded", error);
    setRewardedLoading(false);
    if (notifyFailure) await notifyLoadFailure();
    return false;
  } finally {
    setRewardedLoading(false);
    inFlight = false;
    listeners.forEach((listener) => listener.remove());
  }
}
