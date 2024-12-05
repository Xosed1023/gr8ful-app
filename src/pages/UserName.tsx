import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./UserName.css";
import { useEffect, useState } from "react";
import { AppNameScreenLanguage } from '../persistence/languages';

const UserName = ({ backTo }: { backTo?: string }) => {
  const [name, setName] = useState<string>("");
  const navigate = useIonRouter();
  const [title, setTitle] = useState(["What's your", "name?"]);
  const [note, setNote] = useState(["*Your name will appear with your daily quotes for a personalized experience."]);
  const [placeholder, setPlaceholder] = useState(["Your name here..."]);
  const [button, setButton] = useState(["Finish"]);
  const [userLanguage, setUserLanguage] = useState(localStorage.getItem("language"));

  const handleFinish = () => {
    if (name.trim() === "") return; // Evitar continuar si el nombre está vacío
    localStorage.setItem("name", name);
    if (backTo) navigate.push(backTo, "back");
    else navigate.push("/loadingScreen", "forward");
  };

  useEffect(() => {
    setTitle(
      AppNameScreenLanguage.title[
      userLanguage as keyof typeof AppNameScreenLanguage.title
      ]
    );
    setNote(
      AppNameScreenLanguage.note[
      userLanguage as keyof typeof AppNameScreenLanguage.note
      ]);
    setPlaceholder(
      AppNameScreenLanguage.placeHolder[
      userLanguage as keyof typeof AppNameScreenLanguage.placeHolder
      ]);
    setButton(
      AppNameScreenLanguage.buttons[
      userLanguage as keyof typeof AppNameScreenLanguage.buttons
      ]);
  }, []);

  const backgroundClass =
    localStorage.gender === "W" ? "background-woman" : "background-man";

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className={`${backgroundClass} flex flex-col items-center justify-center min-h-screen`}>
          {/* Puntos superiores */}
          {backTo === undefined &&
            <img
              src="./step6.svg"
              alt="Progress dots"
              className="dots1 absolute top-20"
            />
          }
          {/* Texto principal */}
          <div className="text-container flex flex-col items-center mt-12 px-16 pb-8 pt-6">
            <p className="text-normal">
              {title[0]} <span className="text-highlight"> {title[1]}</span>
            </p>
          </div>
          {/* Input para el nombre */}
          <div className="input-container pt-8 pb-8">
            <input
              type="text"
              className="name-input"
              placeholder={placeholder[0]}
              value={name}
              maxLength={7} // Limita la longitud del input
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Botones de opciones */}
          <div className="action-container flex gap-4 mt-8 pb-8">
            <button
              className={`next-button mt-2 rounded-full ${name.trim() === "" ? "disabled" : ""}`}
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
