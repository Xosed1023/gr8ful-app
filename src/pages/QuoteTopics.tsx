import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import "./QuoteTopics.css";
import { useEffect, useState } from "react";
import { AppTopicsScreenLanguage } from '../persistence/languages';

const QuoteTopics = ({ backTo }: { backTo: string }) => {
  const navigate = useIonRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [title, setTitle] = useState(["Choose the", "topics", "that matter to you the most"]);
  const [note, setNote] = useState(["*We'll tailor your daily quotes to match your interests. Select as many topics as you like!"]);
  const [topics, setTopics] = useState(["Motivation", "Love", "Happiness", "Success", "Mindfulness", "Humor", "Creativity", "Spirituality", "Leadership", "Investing"]);
  const [userLanguage, setUserLanguage] = useState(localStorage.getItem("language"));
  const [buttonText, setButtonText] = useState(["Next"]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
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
      ]);
    setTopics(
      AppTopicsScreenLanguage.topics[
      userLanguage as keyof typeof AppTopicsScreenLanguage.topics
      ]);
    setButtonText(
      AppTopicsScreenLanguage.buttons[
      userLanguage as keyof typeof AppTopicsScreenLanguage.buttons
      ]);
  }, []);

  const handleTopicsChange = () => {
    localStorage.setItem("topics", JSON.stringify(selectedTopics));
    if (backTo) navigate.push(backTo, "back");
    else navigate.push("/userName", "forward");
  };

  const backgroundClass =
    localStorage.gender === "W" ? "background-woman" : "background-man";

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className={`${backgroundClass} flex flex-col items-center justify-center min-h-screen`}>
          {/* SVG de los puntos superiores */}
          {backTo === undefined &&
            <img
              src="./step5.svg"
              alt="Progress dots"
              className="dots1 absolute top-20 mb-6"
            />
          }

          {/* Texto principal */}
          <div className="text-container flex flex-col items-center mt-12 px-16 pb-4 pt-6">
            <p className="text-normal">
              {title[0]} <span className="text-highlight">{title[1]}</span> {title[2]}
            </p>
          </div>

          {/* Botones de temas */}
          <div className="topics-container grid grid-cols-2 gap-4 mt-2">
            {topics.map((topic, index) => (
              <button
                key={index}
                className={`topic-button ${selectedTopics.includes(topic) ? "selected" : ""
                  }`}
                onClick={() => toggleTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Botones de opciones */}
          <div className="action-container flex gap-4 mt-6 mb-4">
            <button
              className={`next-button mt-2 rounded-full ${selectedTopics.length === 0 ? "disabled" : ""
                }`}
              onClick={() => handleTopicsChange()}
              disabled={selectedTopics.length === 0}
            >
              {buttonText[0]}
            </button>
          </div>

          {/* Texto de nota */}
          {backTo === undefined &&
            <div className="note-container-topics mt-2 text-center px-20 ">
              <p className="text-note">
                {note[0]}
              </p>
            </div>
          }
        </div>
      </IonContent>
    </IonPage>
  );
};

export default QuoteTopics;
