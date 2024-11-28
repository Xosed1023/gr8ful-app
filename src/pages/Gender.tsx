import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Gender.css";
import { useHistory } from "react-router";

const Gender: React.FC = () => {
  const navigate = useHistory();
  const handleGenderChange = (gender: string) => {
    localStorage.setItem("gender", gender);
    navigate.push("/quoteTime");
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="background flex flex-col items-center justify-center min-h-screen">
          {/* SVG de los puntos superiores */}
          <img
            src="./step2.svg"
            alt="Progress dots"
            className="dots1 absolute top-20"
          />

          {/* Texto "I Identify as" */}
          <div className="text-container flex items-center justify-center mt-16">
            <p className="text-normal">I</p>
            <p className="text-highlight">Identify</p>
            <p className="text-normal">as</p>
          </div>

          {/* Botones de opciones */}
          <div className="buttons-container flex gap-4 mt-8">
            <button
              className="option-button"
              onClick={() => handleGenderChange("W")}
            >
              A woman
            </button>
            <button
              className="option-button"
              onClick={() => handleGenderChange("M")}
            >
              A man
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Gender;
