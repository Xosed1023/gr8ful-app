const DARK_CLASS = "ion-palette-dark";

/**
 * Aplica (o quita) la clase de modo oscuro en <html> según lo persistido en
 * `localStorage.darkMode`. Se llama antes del primer render (main.tsx) y al
 * cambiar el toggle de Ajustes, para tener una sola fuente de verdad.
 */
export function applyStoredTheme() {
  let isDark = false;
  try {
    isDark = localStorage.getItem("darkMode")?.toLowerCase() === "true";
  } catch {
    // localStorage no disponible: se queda en tema claro
  }
  document.documentElement.classList.toggle(DARK_CLASS, isDark);
}
