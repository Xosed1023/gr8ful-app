import {
  IonContent,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { settings, sync } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Route } from "react-router";
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
import Tab3 from "./Tab3";

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
    <IonPage className="overflow-hidden">
      <IonContent fullscreen className="overflow-hidden">
        <div className="background flex flex-col min-h-screen overflow-hidden">
          <Greetings />
          {phrase && (
            <div className="flex flex-col items-center justify-center -mt-6">
              <CardsContainer phrase={phrase} />
            </div>
          )}
        </div>

        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tab2">
                <Tab3 />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/home" onClick={loadRandomPhrase}>
                <IonIcon aria-hidden="true" icon={sync} />
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tab2">
                <IonIcon aria-hidden="true" icon={settings} />
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonContent>
    </IonPage>
  );
};

export default Home;
