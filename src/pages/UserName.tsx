import { markOnboardingComplete } from "../persistence/onboardingState";
import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./UserName.css";
import { useState } from "react";
import { IoArrowForward, IoPerson } from "react-icons/io5";
import { AppNameScreenLanguage } from "../persistence/languages";
import { useAppLanguage } from "../hooks/useAppLanguage";
import { useUserGender } from "../hooks/useUserGender";
import { hapticTap } from "../hooks/useHaptics";
import BackButton from "../components/common/BackButton";
import GlowBackground from "../components/common/GlowBackground";
import { LOADING_SCREEN_MS } from "./LoadingScreen";
import { refreshWidget } from "../daily/refreshDailyContent";
import StepBadge from "../components/common/StepBadge";
import StepIndicator from "../components/common/StepIndicator";

const UserName = ({ backTo }: { backTo?: string }) => {
  const [name, setName] = useState<string>(localStorage.getItem("name") || "");
  const navigate = useIonRouter();
  const { userLanguage } = useAppLanguage();
  const { isWoman } = useUserGender();
  const text = AppNameScreenLanguage;
  const genderClass = isWoman ? "woman" : "man";
  const trimmedName = name.trim();

  const handleFinish = async () => {
    if (trimmedName === "") return;
    localStorage.setItem("name", name);
    // Último paso del onboarding: a partir de aquí la app abre directo en Home.
    markOnboardingComplete();
    // Ya hay idioma, género, temas y nombre: el widget puede mostrar la frase del día
    void refreshWidget();
    await hapticTap();
    navigate.push("/loadingScreen", "forward");
    setTimeout(() => {
      // «replace»: la pantalla de carga no debe quedar en el historial.
      navigate.push("/mainHome", "root", "replace");
    }, LOADING_SCREEN_MS);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div className={`onboarding-background ${
            isWoman ? "" : "man"
          } ${backTo !== undefined ? "edit-mode" : ""} flex flex-col items-center justify-center min-h-screen`}>
            <GlowBackground />

            {/* Atrás e indicador de pasos (el indicador solo en el onboarding) */}
            <BackButton
              variant="glass"
              // Desde Ajustes se llega con la dirección «root» (historial reiniciado), así
              // que `goBack()` no tiene destino y deja la pantalla vacía: se navega a `backTo`.
              onClick={() =>
                backTo ? navigate.push(backTo, "back") : navigate.goBack()
              }
            />
            {backTo === undefined && (
              <div
                className="onboarding-topbar"
                style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
              >
                <StepIndicator step={5} total={5} />
              </div>
            )}

            <div className="onboarding-content">
              {backTo === undefined && (
                <StepBadge label={text.stepBadge[userLanguage]} />
              )}

              {/* Texto principal */}
              <div className="text-container flex flex-row items-center justify-center mt-4">
                <p className="text-normal">{text.title[userLanguage][0]}</p>
                <p className="text-highlight">{text.title[userLanguage][1]}</p>
              </div>
              <p className="onboarding-subtitle">{text.subtitle[userLanguage]}</p>

              {/* Campo de nombre */}
              <div className="name-card flex flex-col">
                <label className="name-label" htmlFor="user-name">
                  <IoPerson aria-hidden="true" />
                  {text.fieldLabel[userLanguage]}
                </label>
                <input
                  id="user-name"
                  type="text"
                  className="name-input"
                  placeholder={text.placeHolder[userLanguage][0]}
                  value={name}
                  maxLength={10}
                  autoComplete="given-name"
                  onChange={(e) => setName(e.target.value)}
                />
                {trimmedName !== "" && (
                  <span className={`name-chip ${genderClass}`}>
                    {text.greeting[userLanguage].replace("{name}", trimmedName)}
                  </span>
                )}
              </div>

              {/* Finalizar: deshabilitado hasta escribir un nombre */}
              <button
                type="button"
                className={`cta-button name-submit cta-${genderClass}`}
                onClick={handleFinish}
                disabled={trimmedName === ""}
              >
                <span>{text.buttons[userLanguage][0]}</span>
                <IoArrowForward className="text-xl" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserName;
