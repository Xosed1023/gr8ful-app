import { IonButton, IonContent, IonPage, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import { AppGenderScreenLanguage } from "../persistence/languages";
import "./Gender.css";
import { useAppLanguage } from "../hooks/useAppLanguage";
import { hapticTap } from "../hooks/useHaptics";
import BackButton from "../components/common/BackButton";

const Gender: React.FC = () => {
  const { userLanguage } = useAppLanguage();
  const [title, setTitle] = useState(["I", "identify", "as"]);
  const [options, setOptions] = useState(["Woman", "Man"]);

  const navigate = useIonRouter();
  const handleGenderChange = (gender: string) => {
    localStorage.setItem("gender", gender);
    if (import.meta.env.VITE_SHOW_PUSH_NOTIFICACIONS_SCREEN === "true") {
      navigate.push("/quoteTime", "forward");
    } else {
      navigate.push("/quoteTopics", "forward");
    }
  };

  useEffect(() => {
    setTitle(AppGenderScreenLanguage.title[userLanguage]);
    setOptions([
      AppGenderScreenLanguage.options.woman[userLanguage],
      AppGenderScreenLanguage.options.man[userLanguage],
    ]);
  }, [userLanguage]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div className="background flex flex-col items-center justify-center min-h-screen">
            {/* Flecha de retroceso */}
            <BackButton onClick={() => navigate.push("/languages", "back")} />

            {/* SVG de los puntos superiores */}
            <img
              src="./step2.svg"
              alt="Progress dots"
              className="dots1 absolute top-20"
            />

            {/* Texto "I Identify as" */}
            <div className="text-container flex items-center justify-center mt-16">
              <p className="text-normal">{title[0]}</p>
              <p className="text-highlight">{title[1]}</p>
              <p className="text-normal">{title[2]}</p>
            </div>

            {/* Botones de opciones */}
            <div className="buttons-container flex gap-4 mt-8">
              <button
                className="gender-button"
                onClick={async () => {
                  handleGenderChange("W");
                  await hapticTap();
                }}
              >
                {options[0]}
              </button>
              <button
                className="gender-button"
                onClick={async () => {
                  handleGenderChange("M");
                  await hapticTap();
                }}
              >
                {options[1]}
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Gender;
