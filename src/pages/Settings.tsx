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
import { applyStoredTheme } from "../theme/applyStoredTheme";
import { AppSetttingsScreenLanguage, LanguageKeys } from "../persistence/languages";

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
  // No usa useAppLanguage(): Settings se revisita sin remount (p. ej. al volver
  // tras cambiar el idioma) y necesita releer localStorage en cada navegación —
  // ver research.md A1 (Edge Case), misma excepción deliberada que Home.tsx.
  const [userLanguage, setUserLanguage] = useState<LanguageKeys | null>(
    localStorage.getItem("language") as LanguageKeys | null
  );
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    setUserLanguage(localStorage.getItem("language") as LanguageKeys | null);
  }, [navigate]);

  useEffect(() => {
    if (!userLanguage) return;

    setTitle(AppSetttingsScreenLanguage.title[userLanguage]);
    setChangeNameBtnText(AppSetttingsScreenLanguage.editNameButton[userLanguage]);
    setLanguageOptText(AppSetttingsScreenLanguage.languageButton[userLanguage]);
    setHourOptText(AppSetttingsScreenLanguage.TimeButton[userLanguage]);
    setTopicsOptText(AppSetttingsScreenLanguage.topicsButton[userLanguage]);
    setPushNotificationsOptText(
      AppSetttingsScreenLanguage.pushNotificationsButton[userLanguage]
    );
    setDarkmodeOptText(AppSetttingsScreenLanguage.darkModeButton[userLanguage]);
    setVersionText(AppSetttingsScreenLanguage.versionLabel[userLanguage]);
  }, [userLanguage]);

  return (
    <IonPage className="bg-[color:var(--header-bg)]">
      <div className="bg-[color:var(--header-bg)] h-1/5 flex items-center pl-10">
        <h1 className="text-3xl font-bold text-white">{title[0]}</h1>
      </div>
      <div
        className="bg-[color:var(--surface)] rounded-t-3xl
       text-[color:var(--text-color)] h-4/5 w-full flex flex-col items-center justify-between pt-9 px-6"
      >
        <div className="flex flex-col items-center justify-between w-full">
          <h1 className="text-3xl font-bold">{localStorage.getItem("name")}</h1>
          <button
            className="mt-2 px-2 py-1 border-solid border border-[color:var(--icon-color)] rounded-3xl text-sm"
            onClick={() => navigate.push("/userName", "root")}
          >
            {changeNameBtnText[0]}
          </button>

          <IonList inset={true} lines="none" className="w-full">
            <IonItem onClick={() => navigate.push("/languages")}>
              <IonIcon
                className="text-[color:var(--icon-color)]"
                slot="start"
                icon={language}
              />
              <IonLabel>{languageOptText[0]}</IonLabel>
              <IonIcon
                className="text-[color:var(--icon-color)]"
                slot="end"
                icon={arrowForward}
              />
            </IonItem>
            <IonItem onClick={() => navigate.push("/quoteTime", "forward")}>
              <IonIcon
                className="text-[color:var(--icon-color)]"
                slot="start"
                icon={alarmOutline}
              />
              <IonLabel>{hourOptText[0]}</IonLabel>
              <IonIcon
                className="text-[color:var(--icon-color)]"
                slot="end"
                icon={arrowForward}
              />
            </IonItem>
            <IonItem onClick={() => navigate.push("/quoteTopics", "forward")}>
              <IonIcon className="text-[color:var(--icon-color)]" slot="start" icon={list} />
              <IonLabel>{topicsOptText[0]}</IonLabel>
              <IonIcon
                className="text-[color:var(--icon-color)]"
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
                    message:
                      "Para poder enviarte notificaciones push necesitamos algunos permisos.",
                    buttons: [
                      {
                        text: "Cancelar",
                        handler: () => {},
                      },
                      {
                        text: "Permitir",
                        handler: () => {},
                      },
                    ],
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
                checked={localStorage.getItem("darkMode") === "true"}
                onIonChange={(e) => {
                  localStorage.setItem("darkMode", e.detail.checked.toString());
                  applyStoredTheme();
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
