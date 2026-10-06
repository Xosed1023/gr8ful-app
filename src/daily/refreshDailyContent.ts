import { refreshDailyQuotes } from "../notifications/dailyQuote";
import { isOnboardingComplete } from "../persistence/onboardingState";
import { LanguageKeys } from "../persistence/languages";
import { buildWidgetPayload, writeWidgetData } from "../widget/widgetData";
import { loadDailyPlan } from "./dailyPlan";

const readLanguage = (): LanguageKeys => {
  const stored = localStorage.getItem("language");
  return stored === "es" || stored === "fr" ? stored : "en";
};

/**
 * Actualiza el widget con el plan diario. Antes de terminar el onboarding no escribe nada:
 * así el widget muestra su mensaje de bienvenida en lugar de datos a medias.
 */
export async function refreshWidget(): Promise<void> {
  if (!isOnboardingComplete()) return;
  try {
    const loaded = await loadDailyPlan();
    if (!loaded) return;
    await writeWidgetData(
      buildWidgetPayload({
        plan: loaded.plan,
        byId: loaded.byId,
        language: readLanguage(),
        gender: localStorage.getItem("gender") === "M" ? "M" : "W",
        now: new Date(),
      })
    );
  } catch (error) {
    console.error("Error al preparar el contenido del widget", error);
  }
}

/**
 * Punto único para «cambió algo que afecta a la frase del día»: arranque de la app,
 * idioma, temas, hora o fin del onboarding. Repone el widget y las notificaciones.
 */
export async function refreshDailyContent(): Promise<void> {
  await refreshWidget();
  await refreshDailyQuotes();
}
