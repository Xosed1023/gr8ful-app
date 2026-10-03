const COMPLETED_KEY = "onboardingCompleted";

/**
 * ¿El usuario terminó la configuración inicial? Es independiente de
 * `gr8fulFirstTime`, que solo indica que las frases iniciales ya se cargaron
 * (y se marca en el primer arranque, antes del onboarding).
 *
 * Migración: quien ya tenía un nombre guardado terminó el onboarding en una
 * versión anterior (el nombre es el último paso), así que se le marca completo.
 */
export function isOnboardingComplete(): boolean {
  if (localStorage.getItem(COMPLETED_KEY) === "true") return true;
  const hasName = (localStorage.getItem("name") ?? "").trim() !== "";
  if (hasName) localStorage.setItem(COMPLETED_KEY, "true");
  return hasName;
}

/** Se llama al pulsar «Finalizar» con un nombre válido (último paso). */
export function markOnboardingComplete() {
  localStorage.setItem(COMPLETED_KEY, "true");
}
