import { IonIcon } from "@ionic/react";
import { motion, useReducedMotion } from "framer-motion";
import { flame } from "ionicons/icons";
import { useUserGender } from "../../hooks/useUserGender";
import { AppStreakLanguage, LanguageKeys } from "../../persistence/languages";
import "./HomeKit.css";

interface StreakPillProps {
  days: number;
  language: LanguageKeys;
}

/** Píldora de vidrio con la llama y los días seguidos; rebota al subir el número. */
const StreakPill = ({ days, language }: StreakPillProps) => {
  const { isMale } = useUserGender();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={days}
      className={`streak-pill ${isMale ? "man" : "woman"}`}
      role="status"
      aria-label={`${AppStreakLanguage.label[language]}: ${days}`}
      initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 16 }}
    >
      <IonIcon icon={flame} aria-hidden="true" />
      <span>{days}</span>
    </motion.div>
  );
};

export default StreakPill;
