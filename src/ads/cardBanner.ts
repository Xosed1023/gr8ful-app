import {
  AdMob,
  BannerAdOptions,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

export interface CardBannerRequest {
  /** Tarjeta que lo pide: "en" | "es" | "fr". */
  ownerId: string;
  adId: string;
  /** Distancia (px CSS) del borde inferior al borde inferior del banner. */
  margin: number;
}

/**
 * El plugin de AdMob mantiene un único banner nativo, así que las tres tarjetas
 * de Home lo comparten: este coordinador lleva la pila de tarjetas abiertas (la
 * última es la activa), si Home está visible, y serializa las llamadas al
 * plugin para que abrir/cerrar rápido no deje banners fantasma.
 */
let open: CardBannerRequest[] = [];
let homeVisible = true;
let nativeKey: string | null = null;
let isShown = false;
let queue: Promise<void> = Promise.resolve();
let failedListenerAdded = false;

const keyOf = (r: CardBannerRequest) => `${r.adId}|${r.margin}`;

function ensureFailedListener() {
  if (failedListenerAdded) return;
  failedListenerAdded = true;
  // Solo registro: un anuncio que no carga no debe mostrar nada al usuario.
  AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
    console.warn("Banner de tarjeta: fallo al cargar", error);
  });
}

async function apply() {
  const active = open[open.length - 1];

  if (!active || !homeVisible) {
    if (isShown) {
      await AdMob.hideBanner();
      isShown = false;
    }
    return;
  }

  const key = keyOf(active);
  if (nativeKey === key) {
    await AdMob.resumeBanner();
    isShown = true;
    return;
  }

  if (nativeKey !== null) {
    await AdMob.removeBanner().catch(() => undefined);
    nativeKey = null;
  }
  ensureFailedListener();
  const options: BannerAdOptions = {
    adId: active.adId,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: active.margin,
    // import.meta.env es una cadena: "false" sería verdadero si se pasara tal cual.
    isTesting: import.meta.env.VITE_IS_TESTING === "true",
  };
  await AdMob.showBanner(options);
  nativeKey = key;
  isShown = true;
}

function schedule() {
  if (!Capacitor.isNativePlatform()) return;
  queue = queue
    .then(apply)
    .catch((error) => console.error("Banner de tarjeta", error));
}

/** La tarjeta terminó de abrirse: pasa a ser la activa. */
export function showCardBanner(request: CardBannerRequest) {
  if (!request.adId) return;
  open = [...open.filter((r) => r.ownerId !== request.ownerId), request];
  schedule();
}

/** La tarjeta se cerró (o se desmontó). */
export function hideCardBanner(ownerId: string) {
  const before = open.length;
  open = open.filter((r) => r.ownerId !== ownerId);
  if (open.length !== before) schedule();
}

/** Home deja de verse (otra pestaña) o vuelve a verse. */
export function setHomeVisible(visible: boolean) {
  if (homeVisible === visible) return;
  homeVisible = visible;
  schedule();
}

/** Solo para tests: devuelve el estado interno a su valor inicial. */
export function __resetCardBannerForTests() {
  open = [];
  homeVisible = true;
  nativeKey = null;
  isShown = false;
  queue = Promise.resolve();
  failedListenerAdded = false;
}

/** Solo para tests: espera a que se vacíe la cola de llamadas al plugin. */
export function __flushCardBannerForTests() {
  return queue;
}
