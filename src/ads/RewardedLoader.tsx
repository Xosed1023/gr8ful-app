import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useUserGender } from "../hooks/useUserGender";
import { RewardedText, currentLanguage } from "./rewardedCopy";
import { useRewardedLoading } from "./rewardedLoading";
import "./RewardedLoader.css";

/** Mismo ∞ que la pantalla de carga: una curva cerrada que se recorre despacio. */
const INFINITY_PATH =
  "M100,60 C130,20 190,20 190,60 C190,100 130,100 100,60 C70,20 10,20 10,60 C10,100 70,100 100,60 Z";

/** Si el anuncio llega antes, el loader no llega a verse (sin destellos). */
const SHOW_AFTER_MS = 250;
/** Lo que dura la salida: el componente se mantiene montado hasta que termina el fundido. */
const FADE_OUT_MS = 400;

/**
 * Loader global mientras se prepara un anuncio recompensado (spec 033). Va por encima de todo
 * (también del aviso de rescate de racha) y respeta el tema, la paleta de género y reduced motion.
 */
const RewardedLoader = () => {
  const loading = useRewardedLoading();
  const { isMale } = useUserGender();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setMounted(true);
        // Un fotograma después, para que la transición de entrada se aplique
        requestAnimationFrame(() => setVisible(true));
      }, SHOW_AFTER_MS);
      return () => clearTimeout(timer);
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), FADE_OUT_MS);
    return () => clearTimeout(timer);
  }, [loading]);

  if (!mounted) return null;
  return createPortal(
    <div
      className={`rewarded-loader ${isMale ? "man" : "woman"} ${visible ? "visible" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="rewarded-loader-card">
        <svg viewBox="0 0 200 120" className="rewarded-loader-infinity" aria-hidden="true">
          <path className="rewarded-loader-track" d={INFINITY_PATH} />
          <path className="rewarded-loader-trace" d={INFINITY_PATH} pathLength={100} />
        </svg>
        <p>{RewardedText.loading[currentLanguage()]}</p>
      </div>
    </div>,
    document.body
  );
};

export default RewardedLoader;
