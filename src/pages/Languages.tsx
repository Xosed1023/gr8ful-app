import { refreshDailyQuotes } from "../notifications/dailyQuote";
import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./Languages.css";
import { useEffect, useState } from "react";
import { AppSelectLanguage } from "../persistence/languages";
import { useAppLanguage } from "../hooks/useAppLanguage";
import { useSelectThenAdvance } from "../hooks/useSelectThenAdvance";
import { useUserGender } from "../hooks/useUserGender";
import BackButton from "../components/common/BackButton";
import GlowBackground from "../components/common/GlowBackground";
import StepIndicator from "../components/common/StepIndicator";
import StepBadge from "../components/common/StepBadge";
import { IoCheckmark } from "react-icons/io5";

const LANGUAGE_OPTIONS = [
  { key: "es", label: "Español" },
  { key: "en", label: "English" },
  { key: "fr", label: "Français" },
] as const;

const Languages = ({ backTo }: { backTo?: string }) => {
  const navigate = useIonRouter();
  const [title, setTitle] = useState(["Select", "your", "language"]);
  const { userLanguage } = useAppLanguage();
  // En el onboarding aún no hay género elegido (paleta por defecto); al editar desde
  // Ajustes ya existe y la pantalla debe usar los acentos del usuario.
  const { isMale } = useUserGender();
  const accentClass = backTo !== undefined && isMale ? "man" : "";
  // Al editar desde Ajustes se marca el idioma actual; en el onboarding no hay ninguno elegido.
  const selectedLanguage = backTo ? localStorage.getItem("language") : null;

  const { chosen, leaving, select } = useSelectThenAdvance();

  const handleLanguageChange = (language: string) =>
    select(
      language,
      async () => {
        localStorage.setItem("language", language);
        await refreshDailyQuotes();
      },
      () => {
        if (backTo) navigate.push(backTo, "back");
        else navigate.push("/gender", "forward");
      }
    );

  useEffect(() => {
    setTitle(AppSelectLanguage.title[userLanguage]);
  }, [userLanguage]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div
            className={`onboarding-background ${accentClass} ${
              backTo !== undefined ? "edit-mode" : ""
            } flex flex-col items-center justify-center min-h-screen`}
          >
            <GlowBackground />

            {/* Barra superior: atrás (solo al editar desde Ajustes) o indicador de pasos
                (solo en el onboarding). En el onboarding no hay destino al que volver:
                Welcome redirige a Home si la app ya arrancó (spec 012, FR-001). */}
            {backTo !== undefined && (
              <BackButton
                variant="glass"
                onClick={() => navigate.push(backTo, "back")}
              />
            )}
            {backTo === undefined && (
              <div
                className="onboarding-topbar"
                style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
              >
                <StepIndicator step={1} total={5} />
              </div>
            )}

            <div className={`onboarding-content ${leaving ? "leaving" : ""}`}>
              {/* Etiqueta de paso (solo en el onboarding) */}
              {backTo === undefined && (
                <StepBadge label={AppSelectLanguage.stepBadge[userLanguage]} />
              )}

              {/* Título */}
              <div className="text-container flex items-center justify-center mt-4">
                <p className="text-normal">{title[0]}</p>
                <p className="text-normal">{title[1]}</p>
                <p className="text-highlight">{title[2]}</p>
              </div>

              {/* Idiomas */}
              <div className={`option-list ${chosen ? "has-chosen" : ""}`}>
                {LANGUAGE_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    className={`option-card ${chosen === key ? "chosen" : ""}`}
                    onClick={() => handleLanguageChange(key)}
                  >
                    <span>{label}</span>
                    <span
                      className={`option-check ${
                        (chosen ?? selectedLanguage) === key ? "selected" : ""
                      }`}
                    >
                      <IoCheckmark aria-hidden="true" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Languages;
