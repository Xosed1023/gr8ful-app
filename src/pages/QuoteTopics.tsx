import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./QuoteTopics.css";
import { useEffect, useState } from "react";
import { AppTopicsScreenLanguage } from "../persistence/languages";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { IoArrowBack } from "react-icons/io5";

const QuoteTopics = ({ backTo }: { backTo: string }) => {
  const navigate = useIonRouter();
  const [selectedTopics, setSelectedTopics] = useState<any[]>([]);
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
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("language")
  );
  const [buttonText, setButtonText] = useState(["Next"]);

  const toggleTopic = async (topic: any) => {
    setSelectedTopics((prev) =>
      prev.some((eTopic) => eTopic.key === topic.key)
        ? prev.filter((t) => t.key !== topic.key)
        : [...prev, topic]
    );
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  useEffect(() => {
    // verificar si los elementos del localStorage (por lo menos el language están cargados)

    setTitle(
      AppTopicsScreenLanguage.title[
        userLanguage as keyof typeof AppTopicsScreenLanguage.title
      ]
    );
    setNote(
      AppTopicsScreenLanguage.note[
        userLanguage as keyof typeof AppTopicsScreenLanguage.note
      ]
    );
    setTopics(
      AppTopicsScreenLanguage.topics[
        userLanguage as keyof typeof AppTopicsScreenLanguage.topics
      ]
    );
    setButtonText(
      AppTopicsScreenLanguage.buttons[
        userLanguage as keyof typeof AppTopicsScreenLanguage.buttons
      ]
    );
    setSelectedTopics(JSON.parse(localStorage.getItem("topics") || "[]"));
  }, []);

  const handleTopicsChange = async () => {
    localStorage.setItem("topics", JSON.stringify(selectedTopics));
    if (backTo) navigate.push(backTo, "back");
    else navigate.push("/userName", "forward");
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const backgroundClass =
    localStorage.gender === "W" ? "background-woman" : "background-man";

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
          <div className="absolute top-6 left-6 z-10">
            <IoArrowBack
              className="text-black text-3xl cursor-pointer"
              /* onClick={() => navigate.push(backTo || "/quoteTime", "back")} */

              onClick={() => {
                
                if (import.meta.env.VITE_SHOW_PUSH_NOTIFICACIONS_SCREEN === "true") {
                  navigate.push(backTo || "/quoteTime", "back")
                } else {
                  navigate.push(backTo || "/gender", "back")
                }
              
              }}
            />
          </div>

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
                } ${
                  localStorage.gender === "W"
                    ? "woman-selected"
                    : "man-selected"
                }`}
                onClick={() => toggleTopic(topic)}
              >
                {topic.value}
              </button>
            ))}
          </div>

          {/* Botón de continuar */}
          <button
            className={`next-button ${
              localStorage.gender === "W" ? "woman-button" : "man-button"
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
