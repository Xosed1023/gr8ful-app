import { IonIcon } from "@ionic/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { flame } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { setHomeVisible } from "../../ads/cardBanner";
import { useUserGender } from "../../hooks/useUserGender";
import { AppStreakLanguage, LanguageKeys } from "../../persistence/languages";
import StreakRestored, { RESTORED_MS } from "./StreakRestored";
import "./StreakRescue.css";

interface StreakRescueProps {
  /** Días de la racha en juego; `null` = no hay nada que rescatar. */
  streak: number | null;
  language: LanguageKeys;
  /** Muestra el anuncio; `false` si no hubo recompensa. */
  onAccept: () => Promise<boolean>;
  onDecline: () => void;
  /** Cuánto dura el mensaje de racha restaurada (ms); solo cambia en tests. */
  restoredDuration?: number;
}

/**
 * Aviso al abrir tras fallar un día: ver un anuncio mantiene la racha. Nunca
 * bloquea: si el anuncio falla se puede reintentar o empezar de nuevo. Si el anuncio se
 * completa, el mismo fondo pasa sin saltos al mensaje «Racha restaurada» (spec 028), que se
 * desvanece solo o al tocar.
 */
const StreakRescue = ({
  streak,
  language,
  onAccept,
  onDecline,
  restoredDuration = RESTORED_MS,
}: StreakRescueProps) => {
  const { isMale } = useUserGender();
  const reduceMotion = useReducedMotion();
  const open = streak !== null;
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  // Racha que se tenía antes de restaurarla; `null` = no hay mensaje de restauración
  const [restored, setRestored] = useState<{ from: number } | null>(null);
  const visible = open || restored !== null;
  const t = (key: keyof typeof AppStreakLanguage) => AppStreakLanguage[key][language];

  // El banner nativo flota sobre la web: se esconde mientras el aviso está abierto
  useEffect(() => {
    if (!visible) return;
    setHomeVisible(false);
    return () => setHomeVisible(true);
  }, [visible]);

  useEffect(() => {
    if (open) setFailed(false);
  }, [open]);

  const accept = async () => {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    const from = streak ?? 0;
    const ok = await onAccept();
    setBusy(false);
    if (ok) setRestored({ from });
    else setFailed(true);
  };

  const closeRestored = useCallback(() => setRestored(null), []);

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key="streak-overlay"
          className={`streak-overlay ${isMale ? "man" : "woman"}`}
          role={restored ? undefined : "alertdialog"}
          aria-modal={restored ? undefined : true}
          aria-label={restored ? undefined : t("rescueTitle")}
          onClick={restored ? closeRestored : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            {restored ? (
              <StreakRestored
                key="restored"
                from={restored.from}
                language={language}
                reduceMotion={!!reduceMotion}
                onDone={closeRestored}
                duration={restoredDuration}
              />
            ) : (
              open && (
                <motion.div
                  key="rescue"
                  className="streak-card"
                  initial={reduceMotion ? false : { y: 40, scale: 0.94 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.25 } }}
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
              )
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default StreakRescue;
