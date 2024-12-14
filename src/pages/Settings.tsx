import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToggle,
  useIonRouter,
} from "@ionic/react";
import { alarmOutline, arrowForward, language, list } from "ionicons/icons";
import { useEffect, useState } from "react";
import "./Settings.css";
import { AppTimeScreenLanguage } from "../persistence/languages";

const Settings = () => {
  const navigate = useIonRouter();
  const [title, setTitle] = useState(["Settings"]);
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("language")
  );

  useEffect(() => {
    document.documentElement.classList.toggle(
      "ion-palette-dark",
      localStorage.getItem("darkMode")?.toLowerCase?.() === "true"
    );

    setTitle(
      AppTimeScreenLanguage.title[
        userLanguage as keyof typeof AppTimeScreenLanguage.title
      ]
    );
  }, []);

  return (
    <IonPage className="bg-slate-900">
      <div className="bg-slate-900 h-1/5 flex items-center pl-10">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
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
            Edit name
          </button>

          <IonList inset={true} lines="none" className="w-full">
            <IonItem onClick={() => navigate.push("/languages")}>
              <IonIcon
                className="text-slate-900"
                slot="start"
                icon={language}
              />
              <IonLabel>Language</IonLabel>
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
              <IonLabel>Time</IonLabel>
              <IonIcon
                className="text-slate-900"
                slot="end"
                icon={arrowForward}
              />
            </IonItem>
            <IonItem onClick={() => navigate.push("/quoteTopics", "forward")}>
              <IonIcon className="text-slate-900" slot="start" icon={list} />
              <IonLabel>Topics</IonLabel>
              <IonIcon
                className="text-slate-900"
                slot="end"
                icon={arrowForward}
              />
            </IonItem>
            <IonItem>
              <IonLabel>Push Notifications</IonLabel>
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
                }}
              />
            </IonItem>
            <IonItem>
              <IonLabel>Tema Oscuro</IonLabel>
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

        <p className="mb-2 text-xs">Version 1.0.0</p>
      </div>
    </IonPage>
  );
};

export default Settings;
