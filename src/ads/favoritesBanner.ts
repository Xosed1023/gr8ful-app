import { hideCardBanner, showCardBanner } from "./cardBanner";

/** Identificador del banner de Favoritos en el coordinador. */
export const FAVORITES_BANNER_OWNER = "favorites";

/** Una variable de entorno es un texto; cualquier otra cosa equivale a «no definida». */
const text = (value: unknown): string => (typeof value === "string" ? value : "");

/**
 * ID de la unidad del banner de Favoritos. Mientras no exista una unidad propia en AdMob
 * (VITE_*_FAVORITES_BANNER) se reutiliza la de la tarjeta EN, para que nunca quede vacío.
 */
export function favoritesBannerAdId(env: Record<string, unknown>, platform: "ios" | "android"): string {
  return platform === "ios"
    ? text(env.VITE_IOS_FAVORITES_BANNER) || text(env.VITE_IOS_EN_CARD)
    : text(env.VITE_ANDROID_FAVORITES_BANNER) || text(env.VITE_ANDROID_EN_CARD);
}

/** Muestra el banner fijo de Favoritos con el margen que lo deja sobre la barra flotante. */
export function showFavoritesBanner(adId: string, margin: number) {
  showCardBanner({ ownerId: FAVORITES_BANNER_OWNER, screen: "favorites", adId, margin });
}

/** Quita el banner de Favoritos (al salir de la pestaña o desmontarla). */
export function hideFavoritesBanner() {
  hideCardBanner(FAVORITES_BANNER_OWNER);
}
