import { IonIcon } from "@ionic/react";
import { AnimatePresence, motion } from "framer-motion";
import { flame } from "ionicons/icons";
import { useEffect, useState } from "react";
import { LanguageKeys } from "../../persistence/languages";
import { AppStreakRestoredLanguage } from "../../streak/streakCopy";
import { hapticSoftSuccess } from "../../streak/streakHaptics";

/** Tiempo que el mensaje se queda en pantalla antes de desvanecerse solo. */
export const RESTORED_MS = 3500;
/** Pausa antes de que el número pase de N a N+1: se lee el N y luego sube. */
const COUNT_DELAY_MS = 900;
/** Curva suave de salida lenta; sin rebotes ni overshoot. */
const CALM_EASE = [0.22, 0.61, 0.36, 1] as const;

interface StreakRestoredProps {
  /** Racha en juego antes de restaurarla; pasa a `from + 1`. */
  from: number;
  language: LanguageKeys;
  reduceMotion: boolean;
  /** Se llama al terminar el tiempo; también la dispara el toque del overlay. */
  onDone: () => void;
  duration?: number;
}

/**
 * Confirmación de racha restaurada: la llama respira, el número sube suavemente de N a N+1 y,
 * sin pedir ninguna decisión, todo se desvanece solo (o al tocar en cualquier punto).
 */
const StreakRestored = ({
  from,
  language,
  reduceMotion,
  onDone,
  duration = RESTORED_MS,
}: StreakRestoredProps) => {
  const t = (key: keyof typeof AppStreakRestoredLanguage) =>
    AppStreakRestoredLanguage[key][language];
  const [value, setValue] = useState(reduceMotion ? from + 1 : from);

  // El número sube y el háptico acompaña ese instante
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setValue(from + 1);
        void hapticSoftSuccess();
      },
      reduceMotion ? 0 : COUNT_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, [from, reduceMotion]);

  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);

  return (
    <motion.div
      className="streak-card streak-restored"
      role="status"
      aria-live="polite"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, ease: CALM_EASE }}
    >
      <span className="streak-halo" aria-hidden="true">
        <span className="streak-flame">
          <IonIcon icon={flame} />
        </span>
      </span>
      <h2>{t("title")}</h2>
      <div className="streak-counter">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={value}
            className="streak-count"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: CALM_EASE }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="streak-unit">{t("unit")}</span>
      </div>
      <p>{t("body")}</p>
    </motion.div>
  );
};

export default StreakRestored;
