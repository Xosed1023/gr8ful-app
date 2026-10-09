import { AD_POLICY, loadAdState, saveAdState } from "../ads/interstitialPolicy";
import { dateKey } from "../daily/dailyPlan";
import { saveStreak } from "../streak/streak";
import { resetTutorial } from "../tutorial/tutorialState";

/**
 * Herramientas de prueba (spec 032): permiten simular situaciones que dependen del paso del
 * tiempo (racha, rescate, anuncios, tutorial) sin cambiar la fecha del teléfono —en iOS un
 * cambio de reloj puede invalidar la firma de la app—. Solo se muestran con
 * `VITE_IS_TESTING=true`; nunca deben verse en la versión publicada.
 */
export const devToolsEnabled = () => import.meta.env.VITE_IS_TESTING === "true";

/** Clave `YYYY-MM-DD` del día de hace `days` días (hora local). */
export function daysAgoKey(days: number, now: Date = new Date()): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - days);
  return dateKey(d);
}

export type StreakScenario = "yesterday" | "rescue" | "lost" | "reset";

/**
 * Deja la racha como estaría en cada situación. Al volver a «Diario» la app la evalúa con la
 * fecha de hoy: sube, ofrece el rescate, se pierde o empieza de cero.
 */
export function simulateStreak(scenario: StreakScenario, now: Date = new Date()) {
  switch (scenario) {
    case "yesterday":
      saveStreak({ current: 5, best: 5, lastDay: daysAgoKey(1, now) });
      break;
    case "rescue":
      saveStreak({ current: 5, best: 5, lastDay: daysAgoKey(2, now) });
      break;
    case "lost":
      saveStreak({ current: 8, best: 8, lastDay: daysAgoKey(3, now) });
      break;
    case "reset":
      try {
        localStorage.removeItem("streak");
      } catch {
        // nada que borrar
      }
      break;
  }
}

/** Salta la gracia de 24 h de los intersticiales (finge que la app lleva 2 días de uso). */
export function skipAdGrace(now: number = Date.now()) {
  saveAdState({ ...loadAdState(), firstSeenAt: now - 2 * AD_POLICY.graceMs });
}

/** Deja los puntos justos para que la siguiente acción de valor dispare un intersticial. */
export function armInterstitial(now: number = Date.now()) {
  saveAdState({
    ...loadAdState(),
    firstSeenAt: now - 2 * AD_POLICY.graceMs,
    lastShownAt: 0,
    quietUntil: 0,
    points: AD_POLICY.pointsPerAd,
  });
}

/** Borra los contadores de anuncios: vuelve a una instalación nueva (con su gracia). */
export function resetAdPolicy() {
  try {
    localStorage.removeItem("adPolicy");
  } catch {
    // nada que borrar
  }
}

export { resetTutorial };
