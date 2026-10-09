import { IonContent, IonPage, useIonRouter, useIonToast } from "@ionic/react";
import "./QuoteTopics.css";
import { useEffect, useState } from "react";
import { AppTopicsNoticeLanguage, AppTopicsScreenLanguage } from "../persistence/languages";
import { topicsKeyOf } from "../daily/dailyPlan";
import { useAppLanguage } from "../hooks/useAppLanguage";
import { useUserGender } from "../hooks/useUserGender";
import { hapticTap } from "../hooks/useHaptics";
import { refreshDailyContent } from "../daily/refreshDailyContent";
import BackButton from "../components/common/BackButton";
import GlowBackground from "../components/common/GlowBackground";
import { IoArrowForward, IoCheckmarkCircleOutline } from "react-icons/io5";
import { Topic } from "../models/Topic";
import { useCalmEnter } from "../theme/useCalmEnter";

const QuoteTopics = ({ backTo }: { backTo?: string }) => {
  const navigate = useIonRouter();
  const calmRef = useCalmEnter<HTMLDivElement>();
  const [present] = useIonToast();
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [title, setTitle] = useState([
    "Choose the",
    "topics",
    "that matter to you the most",
  ]);
  const [note, setNote] = useState([
    "*We'll tailor your daily quotes to match your interests. Select as many topics as you like!",
  ]);
  const [topics, setTopics] = useState<Topic[]>([
    { key: "motivation", value: "Motivation" },
    { key: "love", value: "Love" },
    { key: "happiness", value: "Happiness" },
    { key: "success", value: "Success" },
    { key: "mindfulness", value: "Mindfulness" },
    { key: "humor", value: "Humor" },
    { key: "creativity", value: "Creativity" },
    { key: "spirituality", value: "Spirituality" },
    { key: "leadership", value: "Leadership" },
    { key: "investing", value: "Investing" },
  ]);
  const { userLanguage } = useAppLanguage();
  const { isWoman } = useUserGender();
  const [buttonText, setButtonText] = useState(["Next"]);

  const toggleTopic = async (topic: Topic) => {
    setSelectedTopics((prev) =>
      prev.some((eTopic) => eTopic.key === topic.key)
        ? prev.filter((t) => t.key !== topic.key)
        : [...prev, topic]
    );
    await hapticTap();
  };

  useEffect(() => {
    // verificar si los elementos del localStorage (por lo menos el language están cargados)

    setTitle(AppTopicsScreenLanguage.title[userLanguage]);
    setNote(AppTopicsScreenLanguage.note[userLanguage]);
    setTopics(AppTopicsScreenLanguage.topics[userLanguage]);
    setButtonText(AppTopicsScreenLanguage.buttons[userLanguage]);
    setSelectedTopics(JSON.parse(localStorage.getItem("topics") || "[]"));
  }, [userLanguage]);

  const handleTopicsChange = async () => {
    const previous: Topic[] = JSON.parse(localStorage.getItem("topics") || "[]");
    localStorage.setItem("topics", JSON.stringify(selectedTopics));
    await refreshDailyContent();
    // Al editar desde Ajustes la frase de hoy se conserva: se avisa de que los temas rigen desde mañana
    if (backTo && topicsKeyOf(previous) !== topicsKeyOf(selectedTopics)) {
      present({
        message: AppTopicsNoticeLanguage.changed[userLanguage],
        duration: 6000,
        position: "bottom",
      });
    }
    if (backTo) navigate.push(backTo, "back");
    else navigate.push("/userName", "forward");
    await hapticTap();
  };

  const genderClass = isWoman ? "woman" : "man";

  return (
    <IonPage>
      <IonContent fullscreen scroll-y="true">
        <div className="safe-area">
          <div className={`onboarding-background topics-page ${
              isWoman ? "" : "man"
            } flex flex-col items-center justify-center`}>
            <GlowBackground />

            {/* Atrás (a Hora en el onboarding, a Ajustes al editar) e indicador de pasos */}
            <BackButton
              variant="glass"
              onClick={() => navigate.push(backTo || "/quoteTime", "back")}
            />

            <div ref={calmRef} className="onboarding-content calm-stagger">

              {/* Texto principal */}
              <div className="text-container mt-4">
                <p className="text-normal">
                  {title[0]} <span className="text-highlight">{title[1]}</span>{" "}
                  {title[2]}
                </p>
              </div>
              <p className="onboarding-subtitle">
                {AppTopicsScreenLanguage.subtitle[userLanguage]}
              </p>

              {/* Temas */}
              <div className="topics-grid">
                {topics.map((topic) => {
                  const isSelected = selectedTopics.some(
                    (eTopic) => eTopic.key === topic.key
                  );
                  return (
                    <button
                      key={topic.key}
                      type="button"
                      aria-pressed={isSelected}
                      className={`topic-card ${genderClass} ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() => toggleTopic(topic)}
                    >
                      <span>{topic.value}</span>
                      {isSelected && (
                        <IoCheckmarkCircleOutline
                          className="topic-check"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Continuar: deshabilitado hasta elegir al menos un tema */}
              <button
                type="button"
                className={`cta-button topics-next cta-${genderClass}`}
                onClick={() => handleTopicsChange()}
                disabled={selectedTopics.length === 0}
              >
                <span>{buttonText[0]}</span>
                <IoArrowForward className="text-xl" aria-hidden="true" />
              </button>

              {/* Nota */}
              <p className="topics-note">{note[0]}</p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default QuoteTopics;
