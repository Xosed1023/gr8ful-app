import { Capacitor } from "@capacitor/core";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useUserGender } from "../hooks/useUserGender";
import { LanguageKeys } from "../persistence/languages";
import { requestWidgetPin } from "../widget/widgetData";
import { TutorialText } from "./tutorialLanguage";
import "./WidgetGuide.css";

/** El widget solo existe en iOS y Android; en la web no se ofrece la guía. */
export const canShowWidgetGuide = () => Capacitor.isNativePlatform();

type Status = "idle" | "added" | "already" | "manual";

/** Mini-ilustración de una pantalla de inicio con el widget de Gr8ful. */
const WidgetIllustration = () => (
  <svg className="wg-illustration" viewBox="0 0 160 96" role="img" aria-hidden="true">
    <rect x="1" y="1" width="158" height="94" rx="14" className="wg-ill-screen" />
    {/* Widget 2×2 con el ∞ y unas líneas de texto */}
    <g className="wg-ill-widget">
      <rect x="14" y="14" width="56" height="56" rx="12" />
      <path
        d="M28,32 C28,25 36,25 42,32 C48,39 56,39 56,32 C56,25 48,25 42,32 C36,39 28,39 28,32 Z"
        className="wg-ill-infinity"
      />
      <rect x="22" y="44" width="40" height="4" rx="2" className="wg-ill-line" />
      <rect x="22" y="53" width="28" height="4" rx="2" className="wg-ill-line" />
    </g>
    {/* Insignia «+» de editar pantalla de inicio */}
    <circle cx="14" cy="14" r="8" className="wg-ill-plus" />
    <path d="M14 10 v8 M10 14 h8" className="wg-ill-plus-sign" />
    {/* Iconos de apps */}
    <rect x="84" y="14" width="22" height="22" rx="6" className="wg-ill-app" />
    <rect x="114" y="14" width="22" height="22" rx="6" className="wg-ill-app" />
    <rect x="84" y="46" width="22" height="22" rx="6" className="wg-ill-app" />
    <rect x="114" y="46" width="22" height="22" rx="6" className="wg-ill-app" />
  </svg>
);

interface BodyProps {
  language: LanguageKeys;
  /** Muestra la cabecera «¡Ya lo tienes!» cuando llega justo tras el tutorial. */
  lead?: boolean;
  onDone: () => void;
  /** Texto del botón secundario («Ahora no» en el tutorial, «Cerrar» en Ajustes). */
  laterLabel: string;
  onLater: () => void;
}

/**
 * Contenido de la guía del widget: iOS, pasos con ilustración (no se puede añadir desde la
 * app); Android, botón que pide al launcher fijarlo y, si no puede, instrucciones manuales.
 */
export const WidgetGuideBody = ({ language, lead, onDone, laterLabel, onLater }: BodyProps) => {
  const t = TutorialText.widget;
  const isAndroid = Capacitor.getPlatform() === "android";
  const [status, setStatus] = useState<Status>("idle");
  const [busy, setBusy] = useState(false);

  const steps = isAndroid ? t.androidSteps[language] : t.iosSteps[language];
  // En Android los pasos manuales solo salen si el launcher no deja fijarlo desde la app
  const showSteps = !isAndroid || status === "manual";

  const handlePrimary = async () => {
    if (!isAndroid || status !== "idle") {
      onDone();
      return;
    }
    if (busy) return;
    setBusy(true);
    const result = await requestWidgetPin();
    setBusy(false);
    if (result.alreadyAdded) setStatus("already");
    else if (result.supported && result.requested) setStatus("added");
    else setStatus("manual");
  };

  const primaryLabel =
    isAndroid && status === "idle"
      ? t.add[language]
      : isAndroid
        ? TutorialText.done[language]
        : t.understood[language];

  return (
    <div className="wg-body">
      {lead && <p className="wg-lead">{t.lead[language]}</p>}
      <h2 className="wg-title">{t.title[language]}</h2>
      <p className="wg-text">{t.body[language]}</p>

      <WidgetIllustration />

      {status === "added" && <p className="wg-status">{t.added[language]}</p>}
      {status === "already" && <p className="wg-status">{t.already[language]}</p>}
      {status === "manual" && <p className="wg-text">{t.manualNote[language]}</p>}

      {showSteps && (
        <ol className="wg-steps">
          {steps.map((step, index) => (
            <li key={step}>
              <span className="wg-step-n">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}

      <button type="button" className="wg-primary" onClick={handlePrimary} disabled={busy}>
        {primaryLabel}
      </button>
      {!(isAndroid && status !== "idle") && (
        <button type="button" className="wg-secondary" onClick={onLater}>
          {laterLabel}
        </button>
      )}
    </div>
  );
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  language: LanguageKeys;
}

/** La guía del widget como ventana propia (se abre desde Ajustes). */
const WidgetGuide = ({ open, onClose, language }: ModalProps) => {
  const { isMale } = useUserGender();
  const reduceMotion = useReducedMotion();

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="widget-guide"
          className={`wg-overlay ${isMale ? "man" : "woman"}`}
          role="dialog"
          aria-modal="true"
          aria-label={TutorialText.widget.title[language]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            className="wg-card"
            initial={reduceMotion ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: 16, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <WidgetGuideBody
              language={language}
              onDone={onClose}
              laterLabel={TutorialText.widget.close[language]}
              onLater={onClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default WidgetGuide;
