import { IonButton, IonContent, IonPage, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import { AppGenderScreenLanguage } from "../persistence/languages";
import "./Gender.css";
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { IoArrowBack } from "react-icons/io5";

const Gender: React.FC = () => {
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("language")
  );
  const [title, setTitle] = useState(["I", "identify", "as"]);
  const [options, setOptions] = useState(["Woman", "Man"]);

  const navigate = useIonRouter();
  const handleGenderChange = (gender: string) => {
    localStorage.setItem("gender", gender);
    navigate.push("/quoteTime", "forward");
  };

  useEffect(() => {
    setTitle(
      AppGenderScreenLanguage.title[
      userLanguage as keyof typeof AppGenderScreenLanguage.title
      ]
    );
    setOptions([
      AppGenderScreenLanguage.options.woman[
      userLanguage as keyof typeof AppGenderScreenLanguage.options.woman
      ],
      AppGenderScreenLanguage.options.man[
      userLanguage as keyof typeof AppGenderScreenLanguage.options.man
      ],
    ]);
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div className="background flex flex-col items-center justify-center min-h-screen">
            {/* Flecha de retroceso */}
            <div className="absolute top-4 left-4">
              <IoArrowBack
                className="text-black text-3xl cursor-pointer"
                onClick={() => navigate.push("/languages", "back")}
              />
            </div>

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
                  handleGenderChange("W")
                  await Haptics.impact({ style: ImpactStyle.Medium });
                }}
              >
                {options[0]}
              </button>
              <button
                className="gender-button"
                onClick={async () => {
                  handleGenderChange("M")
                  await Haptics.impact({ style: ImpactStyle.Medium });
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
