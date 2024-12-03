import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToggle,
  useIonRouter,
} from "@ionic/react";
import { alarmOutline, arrowForward, language, list } from "ionicons/icons";
import "./Settings.css";

const Settings = () => {
  const navigate = useIonRouter();

  return (
    <IonPage className="bg-slate-900">
      <div className="bg-slate-900 h-1/5 flex items-center pl-10">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>
      <div
        className="bg-white rounded-t-3xl
       text-black h-4/5 absolute bottom-0 w-full flex flex-col items-center justify-between pt-9 px-6"
      >
        <div className="flex flex-col items-center justify-between w-full">
          <h1 className="text-3xl font-bold">{localStorage.getItem("name")}</h1>
          <IonButton
            size="small"
            fill="outline"
            onClick={() => navigate.push("/userName", "root")}
          >
            Edit name
          </IonButton>
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
              <IonToggle slot="end" />
            </IonItem>
          </IonList>
        </div>

        <p className="mb-2 text-xs">Version 1.0.0</p>
      </div>
    </IonPage>
  );
};

export default Settings;
