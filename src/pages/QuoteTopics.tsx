import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./QuoteTopics.css";
import { useEffect, useState } from "react";
import { AppTopicsScreenLanguage } from "../persistence/languages";
import { useAppLanguage } from "../hooks/useAppLanguage";
import { useUserGender } from "../hooks/useUserGender";
import { hapticTap } from "../hooks/useHaptics";
import { refreshDailyQuotes } from "../notifications/dailyQuote";
import BackButton from "../components/common/BackButton";
import { Topic } from "../models/Topic";

const QuoteTopics = ({ backTo }: { backTo?: string }) => {
  const navigate = useIonRouter();
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
    localStorage.setItem("topics", JSON.stringify(selectedTopics));
    await refreshDailyQuotes();
    if (backTo) navigate.push(backTo, "back");
    else navigate.push("/userName", "forward");
    await hapticTap();
  };

  const backgroundClass = isWoman ? "background-woman" : "background-man";

  return (
    <IonPage>
      <IonContent fullscreen scroll-y="true">
        {/* Fondo fijo */}
        <div
          className={`${backgroundClass} flex flex-col items-center justify-center min-h-screen`}
        />

        {/* Contenido principal */}
        <div className="content-wrapper">
          {/* Flecha de retroceso */}
          <BackButton
            className="absolute top-6 left-6 z-10"
            onClick={() => {
              navigate.push(backTo || "/quoteTime", "back");
            }}
          />

          {/* Puntos superiores */}
          {backTo === undefined && (
            <div className="dots-container">
              <img src="./step5.svg" alt="Progress dots" className="dots-top" />
            </div>
          )}

          {/* Texto principal */}
          <div className="text-container">
            <p className="text-normal">
              {title[0]} <span className="text-highlight">{title[1]}</span>{" "}
              {title[2]}
            </p>
          </div>

          {/* Botones de temas */}
          <div className="topics-container">
            {topics.map((topic) => (
              <button
                key={topic.key}
                className={`topic-button ${
                  selectedTopics.some((eTopic) => eTopic.key === topic.key)
                    ? "selected"
                    : ""
                } ${isWoman ? "woman-selected" : "man-selected"}`}
                onClick={() => toggleTopic(topic)}
              >
                {topic.value}
              </button>
            ))}
          </div>

          {/* Botón de continuar */}
          <button
            className={`next-button ${
              isWoman ? "woman-button" : "man-button"
            } ${selectedTopics.length === 0 ? "disabled" : ""}`}
            onClick={() => handleTopicsChange()}
            disabled={selectedTopics.length === 0}
          >
            {buttonText[0]}
          </button>

          {/* Nota */}
          <div className="note-container-topics">
            <p className="text-note">{note[0]}</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default QuoteTopics;
