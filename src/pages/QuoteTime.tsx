import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./QuoteTime.css";
import { useEffect, useState } from "react";
import { AppTimeScreenLanguage } from '../persistence/languages';
import { useAppLanguage } from "../hooks/useAppLanguage";
import { useUserGender } from "../hooks/useUserGender";
import { hapticTap } from "../hooks/useHaptics";
import { enableDailyQuotes, refreshDailyQuotes } from "../notifications/dailyQuote";
import BackButton from "../components/common/BackButton";

const QuoteTime = ({ backTo }: { backTo?: string }) => {
  const navigate = useIonRouter();
  const { userLanguage } = useAppLanguage();
  const { isWoman } = useUserGender();
  const [title, setTitle] = useState(["When should we send your daily", "quote?"]);
  const [note, setNote] = useState(["*You can change this later in settings."]);

  useEffect(() => {
    setTitle(AppTimeScreenLanguage.title[userLanguage]);
    setNote(AppTimeScreenLanguage.note[userLanguage]);
  }, [userLanguage]);

  const handleTimeChange = async (time: string) => {
    localStorage.setItem("time", time);
    // Onboarding: las notificaciones quedan activadas y el permiso se pide aquí
    // (spec 021, FR-005). Desde Ajustes solo se reprograman si ya están activas.
    if (backTo) await refreshDailyQuotes();
    else await enableDailyQuotes();
    if (backTo) navigate.push(backTo, "back");
    else navigate.push("/quoteTopics", "forward");
    await hapticTap();
  };

  const backgroundClass = isWoman ? "background-woman" : "background-man";

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className={`${backgroundClass} flex flex-col items-center justify-center min-h-screen`}>
          {/* Flecha de retroceso */}
          <BackButton
            onClick={() => navigate.push(backTo || "/gender", "back")}
          />

          {/* SVG de los puntos superiores */}
          {backTo === undefined &&
            <img
              src="./step4.svg"
              alt="Progress dots"
              className="dots1 absolute top-20"
            />
          }

          {/* Texto principal */}
          <div className="text-container flex flex-col items-center mt-12 px-16 pb-6 pt-6">
            <p className="text-normal">{title[0]}</p>
            <p className="text-highlight">{title[1]}</p>
          </div>

          {/* Botones de horario */}
          <div className="buttons-container flex flex-col gap-4 mt-12 pb-6">
            <button
              className="time-button"
              onClick={() => handleTimeChange("6")}
            >
              6:00 AM
            </button>
            <button
              className="time-button"
              onClick={() => handleTimeChange("12")}
            >
              12:00 PM
            </button>
            <button
              className="time-button"
              onClick={() => handleTimeChange("18")}
            >
              6:00 PM
            </button>
          </div>

          {/* Texto de nota */}
          {backTo === undefined &&
            <div className="note-container mt-8 text-center px-20">
              <p className="text-note">{note[0]}</p>
            </div>
          }
        </div>
      </IonContent>
    </IonPage>
  );
};

export default QuoteTime;
