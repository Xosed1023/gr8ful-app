import { refreshDailyQuotes } from "../notifications/dailyQuote";
import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./Languages.css";
import { useEffect, useState } from "react";
import { AppSelectLanguage } from "../persistence/languages";
import { useAppLanguage } from "../hooks/useAppLanguage";
import { hapticTap } from "../hooks/useHaptics";
import BackButton from "../components/common/BackButton";

const Languages = ({ backTo }: { backTo?: string }) => {
  const navigate = useIonRouter();
  const [title, setTitle] = useState(["Select", "your", "language"]);
  const { userLanguage } = useAppLanguage();

  const handleLanguageChange = async (language: string) => {
    localStorage.setItem("language", language);
    await refreshDailyQuotes();
    await hapticTap();
    if (backTo) {
      navigate.push(backTo, "back");
    } else {
      navigate.push("/gender", "forward");
    }
  };

  useEffect(() => {
    setTitle(AppSelectLanguage.title[userLanguage]);
  }, [userLanguage]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div className="background flex flex-col items-center justify-center min-h-screen">
            {/* Flecha de retroceso: solo al editar desde Ajustes. En el onboarding
                inicial el paso previo es Welcome, que redirige a Home si la app
                ya arrancó una vez, así que no hay destino válido al que volver
                (spec 012, FR-001). */}
            {backTo !== undefined && (
              <BackButton onClick={() => navigate.push(backTo, "back")} />
            )}

            {/* Puntos superiores */}
            {backTo === undefined && (
              <img
                src="./step1.svg"
                alt="Progress dots"
                className="dots1 absolute top-20"
              />
            )}

            {/* Título */}
            <div className="text-container flex items-center justify-center mt-4">
              <p className="text-normal">{title[0]}</p>
              <p className="text-normal">{title[1]}</p>
              <p className="text-highlight">{title[2]}</p>
            </div>

            {/* Idiomas */}
            <div className="buttons-container flex flex-col items-center gap-8 mt-10">
              <button
                className="language-button"
                onClick={() => handleLanguageChange("es")}
              >
                Español
              </button>
              <button
                className="language-button"
                onClick={() => handleLanguageChange("en")}
              >
                English
              </button>
              <button
                className="language-button"
                onClick={() => handleLanguageChange("fr")}
              >
                Français
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Languages;
