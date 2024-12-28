import {
  IonContent,
  IonPage,
  useIonRouter,
} from "@ionic/react";
import "./QuoteTopics.css";
import { useEffect, useState } from "react";
import { AppTopicsScreenLanguage } from "../persistence/languages";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { IoArrowBack } from "react-icons/io5";

const QuoteTopics = ({ backTo }: { backTo: string }) => {
  const navigate = useIonRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [title, setTitle] = useState([
    "Choose the",
    "topics",
    "that matter to you the most",
  ]);
  const [note, setNote] = useState([
    "*We'll tailor your daily quotes to match your interests. Select as many topics as you like!",
  ]);
  const [topics, setTopics] = useState([
    "Motivation",
    "Love",
    "Happiness",
    "Success",
    "Mindfulness",
    "Humor",
    "Creativity",
    "Spirituality",
    "Leadership",
    "Investing",
  ]);
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("language")
  );
  const [buttonText, setButtonText] = useState(["Next"]);

  const toggleTopic = async (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  useEffect(() => {
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
        <div className={`${backgroundClass} flex flex-col items-center justify-center min-h-screen`} />

        {/* Contenido principal */}
        <div className="content-wrapper">
          {/* Flecha de retroceso */}
          <div className="absolute top-6 left-6 z-10">
            <IoArrowBack
              className="text-black text-3xl cursor-pointer"
              onClick={() => navigate.push(backTo || "/quoteTime", "back")}
            />
          </div>

          {/* Puntos superiores */}
          {backTo === undefined && (
            <div className="dots-container">
              <img
                src="./step5.svg"
                alt="Progress dots"
                className="dots-top"
              />
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
            {topics.map((topic, index) => (
              <button
                key={index}
                className={`topic-button ${selectedTopics.includes(topic) ? "selected" : ""
                  } ${localStorage.gender === "W"
                    ? "woman-selected"
                    : "man-selected"
                  }`}
                onClick={() => toggleTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Botón de continuar */}
          <button
            className={`next-button ${localStorage.gender === "W" ? "woman-button" : "man-button"
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
