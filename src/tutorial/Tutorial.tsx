import { IonIcon } from "@ionic/react";
import { bookmarkOutline, copyOutline, shareSocialOutline } from "ionicons/icons";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { hapticTap } from "../hooks/useHaptics";
import { useUserGender } from "../hooks/useUserGender";
import { LanguageKeys } from "../persistence/languages";
import { TutorialText } from "./tutorialLanguage";
import { setTutorialActive } from "./tutorialState";
import { canShowWidgetGuide, WidgetGuideBody } from "./WidgetGuide";
import "./WidgetGuide.css";
import "./Tutorial.css";

type Step = 0 | 1 | 2;
const TOTAL_STEPS = 3;

interface Hole {
  top: number;
  left: number;
  width: number;
  height: number;
  radius: number;
}

const HOLE_PADDING = 10;
/** Cuánto esperar a que una tarjeta termine de abrirse o cerrarse antes de seguir igualmente. */
const CARD_TIMEOUT_MS = 1800;

const cardEl = () => document.querySelector<HTMLElement>('[data-tutorial="card-en"]');
const isCardOpen = (el: HTMLElement | null) => el?.getAttribute("data-tutorial-open") === "true";
const isCardSettled = (el: HTMLElement | null) =>
  el?.getAttribute("data-tutorial-settled") === "true";

/** Espera a que la tarjeta cumpla la condición (observando sus atributos) o venza el tiempo. */
function waitForCard(predicate: (el: HTMLElement) => boolean): Promise<void> {
  return new Promise((resolve) => {
    const el = cardEl();
    if (!el || predicate(el)) return resolve();
    const done = () => {
      observer.disconnect();
      clearTimeout(timer);
      resolve();
    };
    const observer = new MutationObserver(() => predicate(el) && done());
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-tutorial-open", "data-tutorial-settled"],
    });
    const timer = setTimeout(done, CARD_TIMEOUT_MS);
  });
}

/** Zona que se ilumina en cada paso (coordenadas de la ventana), o `null` = todo atenuado. */
function measureHole(step: Step): Hole | null {
  const card = cardEl();
  if (!card) return null;
  if (step === 0) {
    // De la tarjeta inglesa solo se ve la franja superior: llega hasta la siguiente tarjeta
    const rect = card.getBoundingClientRect();
    const next = document
      .querySelector<HTMLElement>('[data-tutorial="card-es"]')
      ?.getBoundingClientRect();
    const height = next ? Math.max(80, next.top - rect.top) : 140;
    return { top: rect.top, left: rect.left, width: rect.width, height, radius: 28 };
  }
  if (step === 1) {
    const actions = card.querySelector<HTMLElement>('[data-tutorial="actions"]');
    if (!actions) return null;
    const rect = actions.getBoundingClientRect();
    return {
      top: rect.top - HOLE_PADDING,
      left: rect.left - HOLE_PADDING,
      width: rect.width + HOLE_PADDING * 2,
      height: rect.height + HOLE_PADDING * 2,
      radius: 9999,
    };
  }
  return null;
}

interface TutorialProps {
  running: boolean;
  language: LanguageKeys;
  /** Se llama al terminar o saltar; en ambos casos el tutorial no vuelve a salir solo. */
  onFinish: () => void;
}

/**
 * Tutorial guiado de Home (spec 030): un único «foco» suave se mueve entre elementos reales de
 * las tarjetas. Solo señala: nada de lo señalado se puede pulsar, y mientras dura no cuentan
 * ni se muestran anuncios (`tutorialActive`).
 */
const Tutorial = ({ running, language, onFinish }: TutorialProps) => {
  const { isMale } = useUserGender();
  const [step, setStep] = useState<Step>(0);
  const [hole, setHole] = useState<Hole | null>(null);
  const [visible, setVisible] = useState(false);
  const t = TutorialText;

  const remeasure = useCallback(() => setHole(measureHole(step)), [step]);

  // Arranque: se desactivan los anuncios y se asegura que la tarjeta esté cerrada
  useEffect(() => {
    if (!running) return;
    setTutorialActive(true);
    setStep(0);
    const card = cardEl();
    if (isCardOpen(card)) card?.click();
    const show = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(show);
      setVisible(false);
      setTutorialActive(false);
    };
  }, [running]);

  // El foco sigue al paso y se recalcula si cambia el tamaño de la ventana
  useLayoutEffect(() => {
    if (!running) return;
    remeasure();
    const again = setTimeout(remeasure, 450); // por si la tarjeta aún se está asentando
    window.addEventListener("resize", remeasure);
    return () => {
      clearTimeout(again);
      window.removeEventListener("resize", remeasure);
    };
  }, [running, remeasure]);

  // Paso 1: si la usuaria toca la tarjeta (o lo hace «Siguiente»), al asentarse pasa al paso 2
  useEffect(() => {
    if (!running || step !== 0) return;
    const el = cardEl();
    if (!el) return;
    const advance = () => {
      if (isCardOpen(el) && isCardSettled(el)) {
        observer.disconnect();
        void hapticTap();
        setStep(1);
      }
    };
    const observer = new MutationObserver(advance);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-tutorial-open", "data-tutorial-settled"],
    });
    return () => observer.disconnect();
  }, [running, step]);

  const closeCardIfOpen = async () => {
    const el = cardEl();
    if (!isCardOpen(el)) return;
    el?.click();
    await waitForCard((card) => !isCardOpen(card));
  };

  const handleSkip = async () => {
    await closeCardIfOpen();
    onFinish();
  };

  const handleNext = async () => {
    if (step === 0) {
      const el = cardEl();
      if (!el) return setStep(2);
      if (isCardOpen(el) && isCardSettled(el)) return setStep(1);
      if (!isCardOpen(el)) el.click(); // el observador del paso 1 avanza al asentarse
      return;
    }
    if (step === 1) {
      await closeCardIfOpen();
      setStep(2);
      return;
    }
    onFinish();
  };

  if (!running) return null;

  // Panel: debajo del foco si este está en la mitad de arriba; si no, encima
  const panelStyle: React.CSSProperties = (() => {
    if (!hole) return {};
    const center = hole.top + hole.height / 2;
    return center < window.innerHeight / 2
      ? { top: hole.top + hole.height + 16 }
      : { bottom: window.innerHeight - hole.top + 16 };
  })();

  const fullBlock = step !== 0 || !hole;
  const accent = isMale ? "man" : "woman";
  const holeStyle: React.CSSProperties = hole
    ? { top: hole.top, left: hole.left, width: hole.width, height: hole.height, borderRadius: hole.radius }
    : {
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        width: 0,
        height: 0,
        borderRadius: 9999,
      };

  const progress = t.progress[language]
    .replace("{n}", String(step + 1))
    .replace("{total}", String(TOTAL_STEPS));

  const dots = (
    <div className="tutorial-dots" role="img" aria-label={progress}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span key={i} className={i === step ? "active" : ""} />
      ))}
    </div>
  );

  return createPortal(
    <div
      className={`tutorial-root ${accent} ${visible ? "visible" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={progress}
    >
      {/* Bloqueadores invisibles: solo el foco del paso 1 deja pasar el toque (a la tarjeta) */}
      {fullBlock || !hole ? (
        <div className="tutorial-block" style={{ inset: 0 }} />
      ) : (
        <>
          <div className="tutorial-block" style={{ top: 0, left: 0, right: 0, height: hole.top }} />
          <div className="tutorial-block" style={{ top: hole.top + hole.height, left: 0, right: 0, bottom: 0 }} />
          <div className="tutorial-block" style={{ top: hole.top, left: 0, width: hole.left, height: hole.height }} />
          <div className="tutorial-block" style={{ top: hole.top, left: hole.left + hole.width, right: 0, height: hole.height }} />
        </>
      )}

      <div className="tutorial-hole" style={holeStyle} />

      {step === 2 ? (
        <div className="tutorial-center">
          <div className={`tutorial-panel centered ${accent}`} key="end">
            {canShowWidgetGuide() ? (
              <WidgetGuideBody
                language={language}
                lead
                onDone={onFinish}
                laterLabel={t.widget.later[language]}
                onLater={onFinish}
              />
            ) : (
              <div className="wg-body">
                <h2 className="wg-title">{t.closingTitle[language]}</h2>
                <p className="wg-text">{t.closingBody[language]}</p>
                <button type="button" className="wg-primary" onClick={onFinish}>
                  {t.done[language]}
                </button>
              </div>
            )}
            <div className="tutorial-footer-dots">{dots}</div>
          </div>
        </div>
      ) : (
        <div className={`tutorial-panel ${accent}`} style={panelStyle} key={step}>
          <div className="tutorial-head">
            {dots}
            <button type="button" className="tutorial-skip" onClick={handleSkip}>
              {t.skip[language]}
            </button>
          </div>
          {step === 0 ? (
            <>
              <h2 className="tutorial-title">{t.openTitle[language]}</h2>
              <p className="tutorial-text">{t.openBody[language]}</p>
            </>
          ) : (
            <>
              <h2 className="tutorial-title">{t.actionsTitle[language]}</h2>
              <ul className="tutorial-actions">
                {[
                  { icon: bookmarkOutline, text: t.actionSave },
                  { icon: shareSocialOutline, text: t.actionShare },
                  { icon: copyOutline, text: t.actionCopy },
                ].map(({ icon, text }) => (
                  <li key={text.title.en}>
                    <span className="tutorial-action-icon">
                      <IonIcon icon={icon} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{text.title[language]}</strong>
                      <span className="tutorial-text">{text.body[language]}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button type="button" className="tutorial-next" onClick={handleNext}>
            {t.next[language]}
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};

export default Tutorial;
