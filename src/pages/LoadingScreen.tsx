import { IonContent, IonPage } from "@ionic/react";
import "./LoadingScreen.css";
import { AppLoadingScreenLanguage } from "../persistence/languages";
import { useAppLanguage } from "../hooks/useAppLanguage";
import { useUserGender } from "../hooks/useUserGender";
import GlowBackground from "../components/common/GlowBackground";

/** Trazo del ∞ (el 8 del logo): una sola curva cerrada que se recorre de punta a punta. */
const INFINITY_PATH =
  "M100,60 C130,20 190,20 190,60 C190,100 130,100 100,60 C70,20 10,20 10,60 C10,100 70,100 100,60 Z";

const LANGUAGE_CHIPS = ["ES", "EN", "FR"];

/**
 * Cuánto se muestra la pantalla de carga antes de pasar a Home. Lo usa también la
 * barra de progreso, así que cambiarlo aquí mantiene todo sincronizado.
 */
export const LOADING_SCREEN_MS = 3000;

const LoadingScreen: React.FC = () => {
  const { userLanguage } = useAppLanguage();
  const { isMale } = useUserGender();
  const title = AppLoadingScreenLanguage.title[userLanguage];

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div
            className={`onboarding-background loading-screen ${
              isMale ? "man" : ""
            } flex flex-col items-center justify-center min-h-screen`}
          >
            <GlowBackground />

            {/* Mensaje principal */}
            <div className="loading-title">
              <p className="text-normal">{title[0]}</p>
              <p className="text-normal">
                {title[1]} <span className="text-highlight">{title[2]}</span>
              </p>
            </div>

            {/* Un cometa de luz recorre el ∞ del logo */}
            <div className="loading-infinity" aria-hidden="true">
              <span className="loading-halo" />
              <svg viewBox="0 0 200 120" role="presentation">
                <defs>
                  <linearGradient id="inf-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" className="grad-a" />
                    <stop offset="100%" className="grad-b" />
                  </linearGradient>
                </defs>
                <path className="inf-track" d={INFINITY_PATH} pathLength={1} />
                <path
                  className="inf-glow"
                  d={INFINITY_PATH}
                  pathLength={1}
                  stroke="url(#inf-gradient)"
                />
                <path
                  className="inf-comet"
                  d={INFINITY_PATH}
                  pathLength={1}
                  stroke="url(#inf-gradient)"
                />
              </svg>
            </div>

            {/* Los tres idiomas se encienden por turnos */}
            <div className="loading-langs" aria-hidden="true">
              {LANGUAGE_CHIPS.map((code, i) => (
                <span
                  key={code}
                  className="lang-chip"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {code}
                </span>
              ))}
            </div>

            <div className="load-track" aria-hidden="true">
              <span
                className="load-fill"
                style={{ animationDuration: `${LOADING_SCREEN_MS}ms` }}
              />
            </div>
            <p className="loading-status">
              {AppLoadingScreenLanguage.status[userLanguage]}
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoadingScreen;
