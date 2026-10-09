import type { Transition, Variants } from "framer-motion";

/**
 * Movimiento calmo para framer-motion (spec 031). Espeja los tokens `--motion-*` de
 * variables.css: curvas suaves de salida, nada de rebotes y duraciones de 0,3 a 0,7 s.
 */

/** Curva de salida suave: arranca ágil y se posa despacio (igual que `--motion-ease`). */
export const CALM_EASE = [0.22, 1, 0.36, 1] as const;
/** Curva simétrica para fundidos cruzados y cambios de estado (`--motion-ease-inout`). */
export const CALM_EASE_INOUT = [0.45, 0, 0.2, 1] as const;

/** Duraciones en segundos (`--motion-quick`, `--motion-base`, `--motion-slow`). */
export const CALM_DURATION = { quick: 0.3, base: 0.5, slow: 0.7 } as const;

/** Ascenso leve de las entradas y desplazamiento al salir, en px. */
export const CALM_RISE = 14;
export const CALM_SHIFT = 10;
/** Retardo entre hermanos, en segundos (`--motion-stagger`). */
export const CALM_STAGGER = 0.08;

/**
 * Resorte muy amortiguado: el cociente de amortiguamiento es mayor que 1, así que nunca se
 * pasa de su destino ni rebota. Solo para movimientos que necesiten inercia (hojas, tarjetas).
 */
export const CALM_SPRING = { type: "spring", stiffness: 90, damping: 24, mass: 1.2 } as const;

/** Cociente de amortiguamiento de un resorte; < 1 rebota, ≥ 1 no. */
export const dampingRatio = ({ stiffness, damping, mass }: { stiffness: number; damping: number; mass: number }) =>
  damping / (2 * Math.sqrt(stiffness * mass));

/** Transición estándar de entrada; sin movimiento si el usuario lo ha reducido. */
export const calmTransition = (
  reduce: boolean | null | undefined,
  duration: number = CALM_DURATION.base,
  delay = 0
): Transition => (reduce ? { duration: 0 } : { duration, ease: CALM_EASE, delay });

/** Entrada con ascenso leve y salida con fundido. Uso: `variants={calmFadeUp(reduce)}`. */
export const calmFadeUp = (reduce: boolean | null | undefined): Variants => ({
  hidden: { opacity: 0, y: reduce ? 0 : CALM_RISE },
  visible: { opacity: 1, y: 0, transition: calmTransition(reduce) },
  exit: { opacity: 0, y: reduce ? 0 : -CALM_SHIFT / 2, transition: calmTransition(reduce, CALM_DURATION.quick) },
});

/** Solo fundido, sin desplazamiento. */
export const calmFade = (reduce: boolean | null | undefined): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: calmTransition(reduce, CALM_DURATION.slow) },
  exit: { opacity: 0, transition: calmTransition(reduce, CALM_DURATION.quick) },
});

/** Contenedor que escalona la entrada de sus hijos (que usan `calmFadeUp`). */
export const calmStagger = (reduce: boolean | null | undefined, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: reduce ? 0 : CALM_STAGGER, delayChildren: reduce ? 0 : delayChildren } },
});
