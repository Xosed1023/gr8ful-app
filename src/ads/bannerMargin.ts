import { isPlatform } from "@ionic/react";

/**
 * Ajuste fino por plataforma (px CSS) para alinear el banner nativo con el slot
 * de la tarjeta. Empieza en 0; se calibra en dispositivo si el plugin sitúa su
 * contenedor distinto de `window.innerHeight` (p. ej. Android con borde a borde).
 */
const PLATFORM_OFFSET = { ios: 0, android: 0 };

/** Alto de la zona segura inferior en px CSS (0 si no hay). */
function readSafeAreaBottom(): number {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;left:0;bottom:0;width:0;height:0;visibility:hidden;" +
    "padding-bottom:env(safe-area-inset-bottom)";
  document.body.appendChild(probe);
  const value = parseFloat(getComputedStyle(probe).paddingBottom) || 0;
  probe.remove();
  return value;
}

/**
 * Margen inferior del banner para que su borde inferior coincida con el del
 * slot. Android mide desde el borde inferior del contenido; iOS, desde la zona
 * segura inferior.
 */
export function computeBannerMargin(rect: { bottom: number }): number {
  const ios = isPlatform("ios");
  const fromBottom = window.innerHeight - rect.bottom;
  const safeArea = ios ? readSafeAreaBottom() : 0;
  const offset = ios ? PLATFORM_OFFSET.ios : PLATFORM_OFFSET.android;
  return Math.max(0, Math.round(fromBottom - safeArea + offset));
}
