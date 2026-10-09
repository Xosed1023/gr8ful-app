import { createAnimation, iosTransitionAnimation, mdTransitionAnimation } from "@ionic/react";
import type { AnimationBuilder } from "@ionic/react";

/** Duración del fundido de pantallas, en ms (`--motion-slow`). */
const PAGE_MS = 650;
/** La pantalla que sale se apaga antes de que la nueva termine de entrar. */
const LEAVE_MS = 320;
/** La pantalla que entra espera un poco para que casi no se superpongan los contenidos. */
const ENTER_DELAY_MS = 200;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_INOUT = "cubic-bezier(0.45, 0, 0.2, 1)";
/** Ascenso mínimo de la pantalla que entra hacia delante, en px. */
const RISE_PX = 10;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Transición calmada entre pantallas: la saliente se funde y la entrante aparece con un
 * fundido y un ascenso mínimo. Sustituye al deslizamiento por defecto del router principal.
 *
 * Se deja el comportamiento por defecto de Ionic en dos casos para no romper nada:
 * - el outlet de las pestañas (dentro de `ion-tabs`), que no debe animarse como pantallas;
 * - el gesto de deslizar para volver en iOS (`progressAnimation`), que necesita seguir al dedo.
 */
export const calmPageTransition: AnimationBuilder = (baseEl, opts) => {
  const defaultBuilder = opts.mode === "ios" ? iosTransitionAnimation : mdTransitionAnimation;
  if (opts.progressAnimation || baseEl.closest("ion-tabs")) return defaultBuilder(baseEl, opts);

  const reduce = prefersReducedMotion();
  const root = createAnimation().duration(reduce ? 1 : PAGE_MS);

  const entering = createAnimation()
    .addElement(opts.enteringEl)
    .beforeRemoveClass("ion-page-invisible")
    .easing(EASE)
    .delay(reduce ? 0 : ENTER_DELAY_MS)
    .duration(reduce ? 1 : PAGE_MS - ENTER_DELAY_MS)
    .fromTo("opacity", "0", "1");
  if (opts.direction === "forward" && !reduce) {
    entering.fromTo("transform", `translateY(${RISE_PX}px)`, "translateY(0)");
  }
  root.addAnimation(entering);

  if (opts.leavingEl) {
    root.addAnimation(
      createAnimation()
        .addElement(opts.leavingEl)
        .easing(EASE_INOUT)
        .duration(reduce ? 1 : LEAVE_MS)
        .fromTo("opacity", "1", "0")
    );
  }
  return root;
};
