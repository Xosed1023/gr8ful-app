import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import CardsContainer from "../components/home/CardsContainer";
import Greetings from "../components/home/Greetings";
import { Phrase } from "../models/Phrase";
import { useUserGender } from "../hooks/useUserGender";

import "./Home.css";
import { AppHomeScreenLanguage } from "../persistence/languages";
import { LanguageKeys } from "../persistence/languages";

const Home = ({ phrase }: { phrase: Phrase }) => {
  const { isMale } = useUserGender();

  const [greetingsText, setGreetingsText] = useState(["Hi"]);
  const [inspirationText, setInspirationText] = useState([
    "Here's some inspiration for your today!",
  ]);
  // No usa useAppLanguage(): a diferencia de las pantallas de onboarding,
  // Home se revisita sin remount (p. ej. al volver de Ajustes tras cambiar
  // idioma) y necesita releer localStorage en cada navegación — ver
  // research.md A1 (Edge Case) para el detalle de esta excepción deliberada.
  const [userLanguage, setUserLanguage] = useState<LanguageKeys | null>(
    localStorage.getItem("language") as LanguageKeys | null
  );
  const navigate = useIonRouter();

  useEffect(() => {
    setUserLanguage(localStorage.getItem("language") as LanguageKeys | null);
  }, [navigate]);

  useEffect(() => {
    if (!userLanguage) return;
    setGreetingsText(AppHomeScreenLanguage.greetings[userLanguage]);
    setInspirationText(AppHomeScreenLanguage.inspirationText[userLanguage]);
  }, [userLanguage]);

  return (
    <IonPage className="overflow-hidden">
      <IonContent fullscreen>
        <div
          className={`backgroundHome ${
            isMale ? "home-man" : ""
          } flex flex-col overflow-hidden h-4/5`}
        >
          <Greetings
            greeting={greetingsText[0]}
            inspiration={inspirationText[0]}
          />
          {phrase && (
            <CardsContainer phrase={phrase} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
