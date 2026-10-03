import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import { IoCheckmark, IoFlower, IoWater } from "react-icons/io5";
import { AppGenderScreenLanguage } from "../persistence/languages";
import "./Gender.css";
import { useAppLanguage } from "../hooks/useAppLanguage";
import { useSelectThenAdvance } from "../hooks/useSelectThenAdvance";
import BackButton from "../components/common/BackButton";
import GlowBackground from "../components/common/GlowBackground";
import StepBadge from "../components/common/StepBadge";
import StepIndicator from "../components/common/StepIndicator";

const Gender: React.FC = () => {
  const { userLanguage } = useAppLanguage();
  const title = AppGenderScreenLanguage.title[userLanguage];
  const navigate = useIonRouter();
  // Si se retoma el onboarding, la opción elegida antes aparece marcada.
  const selectedGender = localStorage.getItem("gender");

  const options = [
    {
      key: "W",
      label: AppGenderScreenLanguage.options.woman[userLanguage],
      iconClass: "woman",
      Icon: IoFlower,
    },
    {
      key: "M",
      label: AppGenderScreenLanguage.options.man[userLanguage],
      iconClass: "man",
      Icon: IoWater,
    },
  ] as const;

  const { chosen, leaving, select } = useSelectThenAdvance();

  const handleGenderChange = (gender: "W" | "M") =>
    select(
      gender,
      () => localStorage.setItem("gender", gender),
      () => navigate.push("/quoteTime", "forward")
    );

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div className={`onboarding-background ${
            (chosen ?? selectedGender) === "M" ? "man" : ""
          } flex flex-col items-center justify-center min-h-screen`}>
            <GlowBackground />

            {/* Atrás (vuelve a Idioma) e indicador de pasos */}
            <BackButton
              variant="glass"
              onClick={() => navigate.push("/languages", "back")}
            />
            <div
              className="onboarding-topbar"
              style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
            >
              <StepIndicator step={2} total={5} />
            </div>

            <div className={`onboarding-content ${leaving ? "leaving" : ""}`}>
              <StepBadge label={AppGenderScreenLanguage.stepBadge[userLanguage]} />

              {/* Texto "I Identify as" */}
              <div className="text-container flex items-center justify-center mt-4">
                <p className="text-normal">{title[0]}</p>
                <p className="text-highlight">{title[1]}</p>
                <p className="text-normal">{title[2]}</p>
              </div>

              <p className="onboarding-subtitle">
                {AppGenderScreenLanguage.subtitle[userLanguage]}
              </p>

              {/* Opciones: elegir una avanza al siguiente paso */}
              <div className={`option-list ${chosen ? "has-chosen" : ""}`}>
                {options.map(({ key, label, iconClass, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={`option-card with-icon ${
                      chosen === key ? "chosen" : ""
                    }`}
                    onClick={() => handleGenderChange(key)}
                  >
                    <span className="option-card-main">
                      <span className={`option-icon ${iconClass}`}>
                        <Icon aria-hidden="true" />
                      </span>
                      <span>{label}</span>
                    </span>
                    <span
                      className={`option-check ${
                        (chosen ?? selectedGender) === key ? "selected" : ""
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

export default Gender;
