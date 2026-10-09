import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router";
import { AppStepLanguage, LanguageKeys } from "../../persistence/languages";
import { CALM_DURATION, CALM_SHIFT, calmTransition } from "../../theme/motion";
import StepBadge from "./StepBadge";
import StepIndicator from "./StepIndicator";
import "./OnboardingKit.css";

/** Pantallas del onboarding y su número de paso. */
const STEP_BY_ROUTE: Record<string, number> = {
  "/languages": 1,
  "/gender": 2,
  "/quoteTime": 3,
  "/quoteTopics": 4,
  "/userName": 5,
};
const TOTAL_STEPS = Object.keys(STEP_BY_ROUTE).length;

const readLanguage = (): LanguageKeys => {
  const stored = localStorage.getItem("language");
  return stored === "es" || stored === "fr" ? stored : "en";
};

/**
 * Indicador de pasos y etiqueta «Paso x de y» del onboarding. Se monta una sola vez, fuera
 * del router de Ionic, y se queda fijo en la misma posición mientras las pantallas entran
 * y salen por debajo: solo se anima el punto activo y el texto de la etiqueta.
 * Solo sigue al router principal, así que no aparece al editar desde Ajustes.
 */
const OnboardingProgress = () => {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const step = STEP_BY_ROUTE[pathname];
  const language = readLanguage();
  const accent = localStorage.getItem("gender") === "M" ? "man" : "woman";
  const label = AppStepLanguage.badge[language]
    .replace("{n}", String(step))
    .replace("{total}", String(TOTAL_STEPS));

  return (
    <AnimatePresence>
      {step !== undefined && (
        <motion.div
          key="onboarding-progress"
          className={`onboarding-progress ${accent}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={calmTransition(reduceMotion, CALM_DURATION.base)}
        >
          <StepIndicator step={step} total={TOTAL_STEPS} />
          <div className="onboarding-progress-badge">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={label}
                initial={reduceMotion ? false : { opacity: 0, y: CALM_SHIFT / 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -CALM_SHIFT / 2 }}
                transition={calmTransition(reduceMotion, CALM_DURATION.quick)}
              >
                <StepBadge label={label} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingProgress;
