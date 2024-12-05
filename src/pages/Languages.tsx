import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./Languages.css";

const Languages = ({ backTo }: { backTo: string }) => {
  const navigate = useIonRouter();

  const handleLanguageChange = (language: string) => {
    localStorage.setItem("language", language);
    if (backTo) navigate.push(backTo, "back");
    else navigate.push("/gender", "forward");
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="background flex flex-col items-center justify-center min-h-screen">
          {/* Puntos superiores */}
          {backTo === undefined &&
            <img
              src="./step1.svg"
              alt="Progress dots"
              className="dots1 absolute top-20"
            />
          }

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
      </IonContent>
    </IonPage>
  );
};

export default Languages;
