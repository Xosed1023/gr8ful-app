import {
  IonAlert,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToggle,
  useIonAlert,
  useIonRouter,
} from "@ionic/react";
import { alarmOutline, arrowForward, language, list } from "ionicons/icons";
import { useEffect, useState } from "react";
import "./Settings.css";
import { AppSetttingsScreenLanguage } from "../persistence/languages";

const Settings = () => {
  const navigate = useIonRouter();
  const [title, setTitle] = useState(["Settings"]);
  const [changeNameBtnText, setChangeNameBtnText] = useState(["Edit name"]);
  const [languageOptText, setLanguageOptText] = useState(["Language"]);
  const [hourOptText, setHourOptText] = useState(["Time"]);
  const [topicsOptText, setTopicsOptText] = useState(["Topics"]);
  const [versionText, setVersionText] = useState(["Version"]);
  const [pushNotificationsOptText, setPushNotificationsOptText] = useState([
    "Push Notifications",
  ]);
  const [darkmodeOptText, setDarkmodeOptText] = useState(["Dark Mode"]);
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("language")
  );
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    document.documentElement.classList.toggle(
      "ion-palette-dark",
      localStorage.getItem("darkMode")?.toLowerCase?.() === "true"
    );
  }, []);

  useEffect(() => {
    setUserLanguage(localStorage.getItem("language"));
  }, [navigate]);

  useEffect(() => {
    setTitle(
      AppSetttingsScreenLanguage.title[
        userLanguage as keyof typeof AppSetttingsScreenLanguage.title
      ]
    );

    setChangeNameBtnText(
      AppSetttingsScreenLanguage.editNameButton[
        userLanguage as keyof typeof AppSetttingsScreenLanguage.editNameButton
      ]
    );

    setLanguageOptText(
      AppSetttingsScreenLanguage.languageButton[
        userLanguage as keyof typeof AppSetttingsScreenLanguage.languageButton
      ]
    );

    setHourOptText(
      AppSetttingsScreenLanguage.TimeButton[
        userLanguage as keyof typeof AppSetttingsScreenLanguage.TimeButton
      ]
    );

    setTopicsOptText(
      AppSetttingsScreenLanguage.topicsButton[
        userLanguage as keyof typeof AppSetttingsScreenLanguage.topicsButton
      ]
    );
    setPushNotificationsOptText(
      AppSetttingsScreenLanguage.pushNotificationsButton[
        userLanguage as keyof typeof AppSetttingsScreenLanguage.pushNotificationsButton
      ]
    );
    setDarkmodeOptText(
      AppSetttingsScreenLanguage.darkModeButton[
        userLanguage as keyof typeof AppSetttingsScreenLanguage.darkModeButton
      ]
    );

    setVersionText(
      AppSetttingsScreenLanguage.versionLabel[
        userLanguage as keyof typeof AppSetttingsScreenLanguage.versionLabel
      ]
    );
  }, [userLanguage]);

  return (
    <IonPage className="bg-slate-900">
      <div className="bg-slate-900 h-1/5 flex items-center pl-10">
        <h1 className="text-3xl font-bold text-white">{title[0]}</h1>
      </div>
      <div
        className="bg-white rounded-t-3xl
       text-black h-4/5 w-full flex flex-col items-center justify-between pt-9 px-6"
      >
        <div className="flex flex-col items-center justify-between w-full">
          <h1 className="text-3xl font-bold">{localStorage.getItem("name")}</h1>
          <button
            className="mt-2 px-2 py-1 border-solid border border-slate-900 rounded-3xl text-sm"
            onClick={() => navigate.push("/userName", "root")}
          >
            {changeNameBtnText[0]}
          </button>

          <IonList inset={true} lines="none" className="w-full">
            <IonItem onClick={() => navigate.push("/languages")}>
              <IonIcon
                className="text-slate-900"
                slot="start"
                icon={language}
              />
              <IonLabel>{languageOptText[0]}</IonLabel>
              <IonIcon
                className="text-slate-900"
                slot="end"
                icon={arrowForward}
              />
            </IonItem>
            <IonItem onClick={() => navigate.push("/quoteTime", "forward")}>
              <IonIcon
                className="text-slate-900"
                slot="start"
                icon={alarmOutline}
              />
              <IonLabel>{hourOptText[0]}</IonLabel>
              <IonIcon
                className="text-slate-900"
                slot="end"
                icon={arrowForward}
              />
            </IonItem>
            <IonItem onClick={() => navigate.push("/quoteTopics", "forward")}>
              <IonIcon className="text-slate-900" slot="start" icon={list} />
              <IonLabel>{topicsOptText[0]}</IonLabel>
              <IonIcon
                className="text-slate-900"
                slot="end"
                icon={arrowForward}
              />
            </IonItem>
            <IonItem>
              <IonLabel>{pushNotificationsOptText[0]}</IonLabel>
              <IonToggle
                enableOnOffLabels={true}
                color="tertiary"
                slot="end"
                value={
                  localStorage.getItem("pushNotifications") === "true"
                    ? "true"
                    : "false"
                }
                onIonChange={(e) => {
                  localStorage.setItem(
                    "pushNotifications",
                    e.detail.checked.toString()
                  );
                  presentAlert({
                    header: pushNotificationsOptText[0],
                    message: "Para poder enviarte notificaciones push necesitamos algunos permisos.",
                    buttons: [{
                      text: "Cancelar",
                      handler: () => {
                        console.log("Cancelado");
                      }
                    },{
                      text: "Permitir",
                      handler: () => {
                        console.log("Permitido");
                      }
                    }],
                  });
                }}
              />
            </IonItem>
            <IonItem>
              <IonLabel>{darkmodeOptText[0]}</IonLabel>
              <IonToggle
                enableOnOffLabels={true}
                color="tertiary"
                slot="end"
                value={
                  localStorage.getItem("darkMode") === "true" ? "true" : "false"
                }
                onIonChange={(e) => {
                  localStorage.setItem("darkMode", e.detail.checked.toString());
                  document.documentElement.classList.toggle(
                    "ion-palette-dark",
                    e.detail.checked
                  );
                }}
              />
            </IonItem>
          </IonList>
        </div>

        <p className="mb-2 text-xs">
          {versionText[0]} {import.meta.env.VITE_VERSION_APP}
        </p>
      </div>
    </IonPage>
  );
};

export default Settings;
