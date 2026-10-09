import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import "./Welcome.css";
import { IoArrowForward } from "react-icons/io5";
import { hapticTap } from "../hooks/useHaptics";
import GlowBackground from "../components/common/GlowBackground";
import { isOnboardingComplete } from "../persistence/onboardingState";
import { useCalmEnter } from "../theme/useCalmEnter";

// Fuera del componente: la lista es constante y no debe recrearse en cada render.
const welcomeTexts = [
  "Discover daily inspiration and gratitude quotes to brighten your day!",
  "Descubre frases diarias de inspiración y gratitud para alegrar tu día.",
  "Découvrez des citations quotidiennes d'inspiration et de gratitude pour illuminer votre journée !",
];

const Welcome: React.FC = () => {
  const [textIndex, setTextIndex] = useState(0); // Índice del texto actual
  const navigate = useIonRouter();
  const calmRef = useCalmEnter<HTMLDivElement>();

  useEffect(() => {
    // gr8fulFirstTime solo indica que las frases iniciales ya se cargaron; el
    // onboarding se considera terminado únicamente al pulsar «Finalizar»
    // (spec 022).
    if (isOnboardingComplete()) {
      navigate.push("/mainHome", "root", "replace");
    }

    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % welcomeTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div className="onboarding-background flex flex-col items-center justify-center min-h-screen">
            <GlowBackground />

            {/* Contenido en un solo bloque: el logo, el texto, los puntos y el botón
                entran uno tras otro (spec 031) */}
            <div ref={calmRef} className="welcome-content calm-stagger">
            {/* Logo */}
            <img src="./logo.svg" alt="Gr8ful Logo" className="logo" />

            {/* Descripción (rota entre EN/ES/FR). Los tres textos comparten la misma
                celda de una rejilla: el contenedor toma el alto del más largo y los
                puntos y el botón no se mueven al cambiar de idioma. */}
            <div className="welcome-copy">
              {welcomeTexts.map((text, i) => (
                <p
                  key={i}
                  className={`description ${i === textIndex ? "active" : ""}`}
                  aria-hidden={i !== textIndex}
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Indicador del texto rotativo: el punto alargado es el visible */}
            <div className="welcome-dots" aria-hidden="true">
              {welcomeTexts.map((_, i) => (
                <span
                  key={i}
                  className={`welcome-dot ${i === textIndex ? "active" : ""}`}
                />
              ))}
            </div>

            {/* Botón */}
            <button
              className="cta-button"
              onClick={async () => {
                navigate.push("/languages", "forward")
                await hapticTap();
              }
              }
            >
              <span>Continue</span>
              <IoArrowForward className="text-xl" aria-hidden="true" />
            </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
