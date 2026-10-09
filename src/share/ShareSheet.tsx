import { IonIcon } from "@ionic/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { closeOutline, imageOutline, textOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoShareOutline } from "react-icons/io5";
import { registerAdMoment } from "../ads/adMoments";
import { setHomeVisible } from "../ads/cardBanner";
import "../components/common/OnboardingKit.css";
import { useUserGender } from "../hooks/useUserGender";
import { AppShareLanguage, LanguageKeys } from "../persistence/languages";
import { CALM_DURATION, CALM_RISE, CALM_SPRING, calmTransition } from "../theme/motion";
import { renderQuoteImage, ShareFormat } from "./renderQuoteImage";
import { shareImage } from "./shareImage";
import "./ShareSheet.css";

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  quote: string;
  author: string;
  /** Idioma de la tarjeta: es el de la frase y el de la imagen. */
  language: LanguageKeys;
  /** Compartir solo texto (la opción de siempre). */
  onShareText: () => void;
}

type Mode = "menu" | "preview";
type Status = "loading" | "ready" | "error";

/**
 * Menú para compartir una frase: «Como imagen» (con vista previa y selector de formato)
 * o «Como texto». Va en un portal sobre toda la app; mientras está abierto se oculta
 * el banner nativo, que de otro modo flotaría por encima.
 */
const ShareSheet = ({ open, onClose, quote, author, language, onShareText }: ShareSheetProps) => {
  const { isMale } = useUserGender();
  const reduceMotion = useReducedMotion();
  // El texto del menú sigue al idioma de la app, no al de la tarjeta
  const stored = localStorage.getItem("language");
  const uiLang: LanguageKeys = stored === "es" || stored === "fr" ? stored : "en";
  const t = (key: keyof typeof AppShareLanguage) => AppShareLanguage[key][uiLang];

  const [mode, setMode] = useState<Mode>("menu");
  const [format, setFormat] = useState<ShareFormat>("story");
  const [status, setStatus] = useState<Status>("loading");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // El banner nativo flota sobre la web: se esconde mientras el menú está abierto
  useEffect(() => {
    if (!open) return;
    setHomeVisible(false);
    return () => setHomeVisible(true);
  }, [open]);

  // Cada vez que se abre, vuelve al menú
  useEffect(() => {
    if (open) {
      setMode("menu");
      setImageUrl(null);
      setStatus("loading");
    }
  }, [open]);

  // Genera la imagen al entrar en la vista previa y al cambiar de formato
  useEffect(() => {
    if (!open || mode !== "preview") return;
    let cancelled = false;
    setStatus("loading");
    renderQuoteImage({
      quote,
      author,
      language,
      format,
      isMale,
      isDark: document.documentElement.classList.contains("ion-palette-dark"),
    })
      .then((url) => {
        if (cancelled) return;
        setImageUrl(url);
        setStatus("ready");
      })
      .catch((error) => {
        console.error("Error al crear la imagen", error);
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [open, mode, format, attempt, quote, author, language, isMale]);

  const handleShare = async () => {
    if (!imageUrl || sharing) return;
    setSharing(true);
    try {
      await shareImage(imageUrl, t("title"));
      registerAdMoment("share");
    } catch (error) {
      console.error("Error al compartir la imagen", error);
      setStatus("error");
    } finally {
      setSharing(false);
    }
  };

  // La hoja sube con un resorte sobreamortiguado (sin rebote); la vista previa, con un fundido calmo
  const spring = reduceMotion ? { duration: 0 } : CALM_SPRING;
  const fadeUp = calmTransition(reduceMotion, CALM_DURATION.slow);
  const accent = isMale ? "man" : "woman";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="share-overlay"
          className={`share-overlay ${accent}`}
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={calmTransition(reduceMotion, CALM_DURATION.base)}
          // Los eventos de un portal suben por el árbol de React: sin esto tocar el
          // menú abriría o cerraría la tarjeta que hay debajo.
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mode === "menu" ? (
              <motion.div
                key="menu"
                className="share-panel"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={spring}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="share-grabber" aria-hidden="true" />
                <h2 className="share-title">{t("title")}</h2>
                <button type="button" className="share-row" onClick={() => setMode("preview")}>
                  <span className="share-icon">
                    <IonIcon icon={imageOutline} aria-hidden="true" />
                  </span>
                  <span className="share-row-text">
                    <span className="share-row-title">{t("asImage")}</span>
                    <span className="share-row-hint">{t("asImageHint")}</span>
                  </span>
                </button>
                <button type="button" className="share-row" onClick={onShareText}>
                  <span className="share-icon">
                    <IonIcon icon={textOutline} aria-hidden="true" />
                  </span>
                  <span className="share-row-text">
                    <span className="share-row-title">{t("asText")}</span>
                    <span className="share-row-hint">{t("asTextHint")}</span>
                  </span>
                </button>
                <button type="button" className="share-cancel" onClick={onClose}>
                  {t("cancel")}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                className="share-preview"
                initial={{ opacity: 0, y: CALM_RISE * 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: CALM_RISE, transition: calmTransition(reduceMotion, CALM_DURATION.quick) }}
                transition={fadeUp}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="share-preview-header">
                  <h2 className="share-title">{t("previewTitle")}</h2>
                  <button
                    type="button"
                    className="share-close"
                    aria-label={t("close")}
                    onClick={onClose}
                  >
                    <IonIcon icon={closeOutline} />
                  </button>
                </div>

                <div className={`share-stage ${format}`}>
                  {status === "loading" && <p className="share-note">{t("creating")}</p>}
                  {status === "error" && (
                    <div className="share-note">
                      <p>{t("error")}</p>
                      <button
                        type="button"
                        className="share-retry"
                        onClick={() => setAttempt((n) => n + 1)}
                      >
                        {t("retry")}
                      </button>
                    </div>
                  )}
                  {status === "ready" && imageUrl && (
                    <img className="share-image" src={imageUrl} alt={quote} />
                  )}
                </div>

                <div className="share-segment" role="group">
                  {(["story", "square"] as ShareFormat[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={format === f}
                      className={`share-seg-btn ${format === f ? "active" : ""}`}
                      onClick={() => setFormat(f)}
                    >
                      {f === "story" ? t("formatStory") : t("formatSquare")}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className={`cta-button cta-${accent}`}
                  disabled={status !== "ready" || sharing}
                  onClick={handleShare}
                >
                  <span>{t("share")}</span>
                  <IoShareOutline className="text-xl" aria-hidden="true" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ShareSheet;
