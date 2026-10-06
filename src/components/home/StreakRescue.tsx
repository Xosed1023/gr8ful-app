import { IonIcon } from "@ionic/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { flame } from "ionicons/icons";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { setHomeVisible } from "../../ads/cardBanner";
import { useUserGender } from "../../hooks/useUserGender";
import { AppStreakLanguage, LanguageKeys } from "../../persistence/languages";
import "./StreakRescue.css";

interface StreakRescueProps {
  /** Días de la racha en juego; `null` = no hay nada que rescatar. */
  streak: number | null;
  language: LanguageKeys;
  /** Muestra el anuncio; `false` si no hubo recompensa. */
  onAccept: () => Promise<boolean>;
  onDecline: () => void;
}

/**
 * Aviso al abrir tras fallar un día: ver un anuncio mantiene la racha. Nunca
 * bloquea: si el anuncio falla se puede reintentar o empezar de nuevo.
 */
const StreakRescue = ({ streak, language, onAccept, onDecline }: StreakRescueProps) => {
  const { isMale } = useUserGender();
  const reduceMotion = useReducedMotion();
  const open = streak !== null;
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const t = (key: keyof typeof AppStreakLanguage) => AppStreakLanguage[key][language];

  // El banner nativo flota sobre la web: se esconde mientras el aviso está abierto
  useEffect(() => {
    if (!open) return;
    setHomeVisible(false);
    return () => setHomeVisible(true);
  }, [open]);

  useEffect(() => {
    if (open) setFailed(false);
  }, [open]);

  const accept = async () => {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    const ok = await onAccept();
    setBusy(false);
    if (!ok) setFailed(true);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="streak-overlay"
          className={`streak-overlay ${isMale ? "man" : "woman"}`}
          role="alertdialog"
          aria-modal="true"
          aria-label={t("rescueTitle")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <motion.div
            className="streak-card"
            initial={reduceMotion ? false : { y: 40, scale: 0.94 }}
            animate={{ y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { y: 40, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            <span className="streak-flame" aria-hidden="true">
              <IonIcon icon={flame} />
            </span>
            <h2>{t("rescueTitle")}</h2>
            <p>{t("rescueBody").replace("{n}", String(streak))}</p>
            {failed && <p className="streak-error">{t("rescueError")}</p>}
            <button type="button" className="streak-primary" onClick={accept} disabled={busy}>
              {t("rescueWatch")}
            </button>
            <button type="button" className="streak-secondary" onClick={onDecline} disabled={busy}>
              {t("rescueRestart")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default StreakRescue;
