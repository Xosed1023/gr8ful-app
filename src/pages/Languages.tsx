import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./Languages.css";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { IoArrowBack } from "react-icons/io5";

const Languages = ({ backTo }: { backTo: string }) => {
  const navigate = useIonRouter();

  const handleLanguageChange = async (language: string) => {
    localStorage.setItem("language", language);
    await Haptics.impact({ style: ImpactStyle.Medium });
    if (backTo) {
      navigate.push(backTo, "back");
    } else {
      navigate.push("/gender", "forward");
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div className="background flex flex-col items-center justify-center min-h-screen">
            {/* Flecha de retroceso */}
            <div className="absolute top-4 left-4">
              <IoArrowBack
                className="text-black text-3xl cursor-pointer"
                onClick={() => navigate.push(backTo || "/", "back")}
              />
            </div>

            {/* Puntos superiores */}
            {backTo === undefined && (
              <img
                src="./step1.svg"
                alt="Progress dots"
                className="dots1 absolute top-20"
              />
            )}

            {/* Idiomas */}
            <div className="buttons-container flex flex-col items-center gap-8 mt-16">
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
