import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import CardsContainer from "../components/home/CardsContainer";
import Greetings from "../components/home/Greetings";
import { Phrase } from "../models/Phrase";

import "./Home.css";
import { AppHomeScreenLanguage } from "../persistence/languages";

const Home = ({ phrase }: { phrase: Phrase }) => {
  
  const [greetingsText, setGreetingsText] = useState(["Hi"]);
  const [inspirationText, setInspirationText] = useState([
    "Here's some inspiration for your today!",
  ]);
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("language")
  );
  const navigate = useIonRouter();

  useEffect(() => {
    setUserLanguage(localStorage.getItem("language"));
  }, [navigate]);

  useEffect(() => {
    setGreetingsText(
      AppHomeScreenLanguage.greetings[
        userLanguage as keyof typeof AppHomeScreenLanguage.greetings
      ]
    );
    setInspirationText(
      AppHomeScreenLanguage.inspirationText[
        userLanguage as keyof typeof AppHomeScreenLanguage.inspirationText
      ]
    );
  }, [userLanguage]);

  return (
    <IonPage className="overflow-hidden">
      <IonContent fullscreen>
        <div className="backgroundHome flex flex-col overflow-hidden h-4/5">
          <Greetings
            greeting={greetingsText[0]}
            inspiration={inspirationText[0]}
          />
          {phrase && (
            <div className="flex flex-col items-center justify-center -mt-6">
              <CardsContainer phrase={phrase} />
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
