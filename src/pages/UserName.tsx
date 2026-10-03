import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./UserName.css";
import { useEffect, useState } from "react";
import { AppNameScreenLanguage } from '../persistence/languages';
import { useAppLanguage } from "../hooks/useAppLanguage";
import { useUserGender } from "../hooks/useUserGender";
import { hapticTap } from "../hooks/useHaptics";
import BackButton from "../components/common/BackButton";

const UserName = ({ backTo }: { backTo?: string }) => {
  const [name, setName] = useState<string>(localStorage.getItem("name") || "");
  const navigate = useIonRouter();
  const [title, setTitle] = useState(["What's your", "name"]);
  const [note, setNote] = useState(["*Your name will appear with your daily quotes for a personalized experience."]);
  const [placeholder, setPlaceholder] = useState(["Your name here..."]);
  const [button, setButton] = useState(["Finish"]);
  const { userLanguage } = useAppLanguage();
  const { isWoman } = useUserGender();

  const handleFinish = async () => {
    if (name.trim() === "") return;
    localStorage.setItem("name", name);
    await hapticTap();
    navigate.push("/loadingScreen", "forward");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTimeout(() => {
      navigate.push("/mainHome", "forward");
    }, 1000);
  };

  useEffect(() => {
    setTitle(AppNameScreenLanguage.title[userLanguage]);
    setNote(AppNameScreenLanguage.note[userLanguage]);
    setPlaceholder(AppNameScreenLanguage.placeHolder[userLanguage]);
    setButton(AppNameScreenLanguage.buttons[userLanguage]);
  }, [userLanguage]);

  const backgroundClass = isWoman ? "background-woman" : "background-man";

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className={`${backgroundClass} flex flex-col items-center justify-center min-h-screen`}>
          {/* Flecha de retroceso */}
          <BackButton onClick={() => navigate.goBack()} />

          {/* Puntos superiores */}
          {backTo === undefined &&
            <img
              src="./step6.svg"
              alt="Progress dots"
              className="dots1 absolute top-20"
            />
          }
          {/* Texto principal */}
          <div className="text-container flex flex-row items-center mt-12 px-16 pb-8 pt-6">
            <p className="text-normal">
              {title[0]}
            </p>
            <p className="text-highlight">
              {title[1]}
            </p>
          </div>
          {/* Input para el nombre */}
          <div className="input-container pt-8 pb-8">
            <input
              type="text"
              className="name-input"
              placeholder={placeholder[0]}
              value={name}
              maxLength={10}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Botones de opciones */}
          <div className="action-container flex gap-4 mt-8 pb-8">
            <button
              className={`next-button mt-2 rounded-full ${isWoman ? "woman-button" : "man-button"
                } ${name.trim() === "" ? "disabled" : ""}`}
              onClick={handleFinish}
              disabled={name.trim() === ""}

            >
              {button[0]}
            </button>
          </div>
          {/* Texto de nota */}
          <div className="note-container-topics mt-8 text-center px-20">
            <p className="text-note">
              {note[0]}
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserName;
