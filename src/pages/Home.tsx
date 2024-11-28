import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import {
  addOrUpdatePhrase,
  getPhraseById,
  getRandomPhrase,
  initDB,
} from "../persistence/IndexedDBService";
import "./Home.css";
import Greetings from "../components/home/Greetings";
import CardPhrase from "../components/home/CardPhrase";
import { Phrase } from "../models/Phrase";
import CardsContainer from "../components/home/CardsContainer";

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
      // Actualizar la frase en la base de datos con la fecha actual
      await updateHistoryDate(randomPhrase.id!);
      setPhrase(randomPhrase); // Mostrar en español, puedes cambiarlo dinámicamente
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
    <IonPage>
      <IonContent fullscreen>
        <div className="background flex flex-col min-h-screen">
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
