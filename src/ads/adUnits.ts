import { Capacitor } from "@capacitor/core";

/**
 * IDs de las unidades de AdMob del intersticial y el rewarded. Con `VITE_IS_TESTING=true` se
 * usan los anuncios de prueba oficiales de Google (https://developers.google.com/admob/android/test-ads
 * y /ios/test-ads); si no, los de producción del `.env`.
 */
const TEST = {
  interstitial: { ios: "ca-app-pub-3940256099942544/4411468910", android: "ca-app-pub-3940256099942544/1033173712" },
  rewarded: { ios: "ca-app-pub-3940256099942544/1712485313", android: "ca-app-pub-3940256099942544/5224354917" },
} as const;

const text = (value: unknown): string => (typeof value === "string" ? value : "");

/** `import.meta.env` es una cadena: "false" sería verdadero si se evaluara tal cual. */
export const isAdTesting = (env: Record<string, unknown> = import.meta.env) => env.VITE_IS_TESTING === "true";

export type AdFormat = keyof typeof TEST;

/** ID de la unidad del formato indicado; en pruebas, o si falta el del `.env`, el de prueba. */
export function adUnitId(
  format: AdFormat,
  platform: "ios" | "android" = Capacitor.getPlatform() === "ios" ? "ios" : "android",
  env: Record<string, unknown> = import.meta.env
): string {
  if (isAdTesting(env)) return TEST[format][platform];
  const key = `VITE_${platform === "ios" ? "IOS" : "ANDROID"}_${format.toUpperCase()}`;
  return text(env[key]) || TEST[format][platform];
}
