import { IonIcon } from "@ionic/react";
import { motion, useReducedMotion } from "framer-motion";
import { flame } from "ionicons/icons";
import { useUserGender } from "../../hooks/useUserGender";
import { calmTransition } from "../../theme/motion";
import { AppStreakLanguage, LanguageKeys } from "../../persistence/languages";
import "./HomeKit.css";

interface StreakPillProps {
  days: number;
  language: LanguageKeys;
}

/** Píldora de vidrio con la llama y los días seguidos; aparece con calma al subir el número. */
const StreakPill = ({ days, language }: StreakPillProps) => {
  const { isMale } = useUserGender();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={days}
      className={`streak-pill ${isMale ? "man" : "woman"}`}
      role="status"
      aria-label={`${AppStreakLanguage.label[language]}: ${days}`}
      initial={reduceMotion ? false : { y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={calmTransition(reduceMotion)}
    >
      <IonIcon icon={flame} aria-hidden="true" />
      <span>{days}</span>
    </motion.div>
  );
};

export default StreakPill;
