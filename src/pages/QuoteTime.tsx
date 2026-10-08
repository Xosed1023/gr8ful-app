import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import { IoCheckmark } from "react-icons/io5";
import { AppTimeScreenLanguage } from "../persistence/languages";
import { useAppLanguage } from "../hooks/useAppLanguage";
import { useSelectThenAdvance } from "../hooks/useSelectThenAdvance";
import { useUserGender } from "../hooks/useUserGender";
import { enableDailyQuotes } from "../notifications/dailyQuote";
import { refreshDailyContent } from "../daily/refreshDailyContent";
import BackButton from "../components/common/BackButton";
import GlowBackground from "../components/common/GlowBackground";

const TIME_OPTIONS = [
  { key: "6", label: "6:00 AM" },
  { key: "12", label: "12:00 PM" },
  { key: "18", label: "6:00 PM" },
] as const;

const QuoteTime = ({ backTo }: { backTo?: string }) => {
  const navigate = useIonRouter();
  const { userLanguage } = useAppLanguage();
  const { isMale } = useUserGender();
  const text = AppTimeScreenLanguage;
  // Al editar desde Ajustes se marca la hora actual; en el onboarding no hay ninguna elegida.
  const selectedTime = backTo ? localStorage.getItem("time") : null;

  const { chosen, leaving, select } = useSelectThenAdvance();

  const handleTimeChange = (time: string) =>
    select(
      time,
      async () => {
        localStorage.setItem("time", time);
        // Onboarding: las notificaciones quedan activadas y el permiso se pide aquí
        // (spec 021, FR-005). Desde Ajustes solo se reprograman si ya están activas.
        if (backTo) await refreshDailyContent();
        else await enableDailyQuotes();
      },
      () => {
        if (backTo) navigate.push(backTo, "back");
        else navigate.push("/quoteTopics", "forward");
      }
    );

  const title = text.title[userLanguage];

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div className={`onboarding-background ${
            isMale ? "man" : ""
          } ${backTo !== undefined ? "edit-mode" : ""} flex flex-col items-center justify-center min-h-screen`}>
            <GlowBackground />

            {/* Atrás (a Género en el onboarding, a Ajustes al editar) e indicador de pasos */}
            <BackButton
              variant="glass"
              onClick={() => navigate.push(backTo || "/gender", "back")}
            />

            <div className={`onboarding-content ${leaving ? "leaving" : ""}`}>

              {/* Texto principal */}
              <div className="text-container flex flex-col items-center mt-4 px-4">
                <p className="text-normal">{title[0]}</p>
                <p className="text-highlight">{title[1]}</p>
              </div>

              {/* Horarios */}
              <div className={`option-list ${chosen ? "has-chosen" : ""}`}>
                {TIME_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    className={`option-card ${chosen === key ? "chosen" : ""}`}
                    onClick={() => handleTimeChange(key)}
                  >
                    <span>{label}</span>
                    <span
                      className={`option-check ${
                        (chosen ?? selectedTime) === key ? "selected" : ""
                      }`}
                    >
                      <IoCheckmark aria-hidden="true" />
                    </span>
                  </button>
                ))}
              </div>

              {/* Nota (solo en el onboarding) */}
              {backTo === undefined && (
                <p className="topics-note">{text.note[userLanguage][0]}</p>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default QuoteTime;
