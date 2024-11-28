import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './QuoteTopics.css';
import { useHistory } from "react-router";
import { useState } from 'react';
const QuoteTopics: React.FC = () => {
  const navigate = useHistory();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const topics = [
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
  ];

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleTopicsChange = () => {
    localStorage.setItem("topics", JSON.stringify(selectedTopics));
    navigate.push("/userName")
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="background-woman flex flex-col items-center justify-center min-h-screen">
          {/* SVG de los puntos superiores */}
          <img src="./step5.svg" alt="Progress dots" className="dots1 absolute top-20 mb-6" />

          {/* Texto principal */}
          <div className="text-container flex flex-col items-center mt-12 px-16 pb-4 pt-6">
            <p className="text-normal">
              Choose the {" "}
              <span className="text-highlight">topics</span>
              {" "} that matter to you most
            </p>
          </div>

          {/* Botones de temas */}
          <div className="topics-container grid grid-cols-2 gap-4 mt-2">
            {topics.map((topic, index) => (
              <button
                key={index}
                className={`topic-button ${selectedTopics.includes(topic) ? 'selected' : ''
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
              className="next-button mt-2 rounded-full"
              onClick={() => handleTopicsChange()}
            >
              Next
            </button>
          </div>


          {/* Texto de nota */}
          <div className="note-container-topics mt-2 text-center px-20 ">
            <p className="text-note">
              * We'll tailor your daily quotes to match your interests. Select as many topics as you like!
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default QuoteTopics;