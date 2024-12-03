import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import CardsContainer from "../components/home/CardsContainer";
import Greetings from "../components/home/Greetings";
import { Phrase } from "../models/Phrase";
import {
  addOrUpdatePhrase,
  getPhraseById,
  getRandomPhrase,
  initDB,
} from "../persistence/IndexedDBService";
import "./Home.css";

const Home = () => {
  const [phrase, setPhrase] = useState<Phrase | null>(null);

  useEffect(() => {
    // Inicializar la base de datos
    initDB().then(() => {
      loadRandomPhrase();
    });
  }, []);

  const loadRandomPhrase = async () => {
    const randomPhrase = await getRandomPhrase();
    if (randomPhrase) {
      await updateHistoryDate(randomPhrase.id!);
      setPhrase(randomPhrase);
    }
  };

  const updateHistoryDate = async (id: number) => {
    const phrase = await getPhraseById(id);
    if (phrase) {
      phrase.hasShown = true;
      await addOrUpdatePhrase(phrase);
    }
  };

  return (
    <IonPage className="overflow-hidden">
      <IonContent fullscreen>
        <div className="backgroundHome flex flex-col overflow-hidden h-4/5">
          <Greetings />
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
